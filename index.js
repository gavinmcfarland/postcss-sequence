// tooling
import postcss from "postcss";
var Parser = require("expr-eval").Parser;

var parser = new Parser();

// List of letters in the alphabet
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
var SPEC_CHARACTERS = /[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g;

// Common regexes
var DEC_REGEX = /([+-]?(?:\d*\.)?\d+)/;
// var CHAR_REGEX = /(<[a-z]>)/;
var GROUP_REGEX = /(<([a-z])>)/;

// Common math numbers
var SQRT5 = Math.sqrt(5);
var phi = (SQRT5 + 1) / 2;

function escapeRegex(string) {
  return string.replace(SPEC_CHARACTERS, "\\$&");
}

function makeRegex(unit) {
  var regexString = "";

  if (unit.abbr instanceof RegExp) {
    // If unit abbreviation is a regex then use that
    regexString = unit.abbr.source;
  } else if (typeof unit.abbr === "string") {
    if (unit.abbr.match(GROUP_REGEX)) {
      // If unit abbreviation is made up of group identifiers then create regex
      // var originalString = unit.abbr;
      // var newString = unit.abbr.replace(GROUP_REGEX, DEC_REGEX.source);
      regexString = unit.abbr.replace(GROUP_REGEX, DEC_REGEX.source);
    }
    // If unit abbreviation is just a string
    else if (unit.position === "start") {
      regexString = escapeRegex(unit.abbr) + DEC_REGEX.source;
    } else if (unit.position === "middle") {
      regexString =
        DEC_REGEX.source + escapeRegex(unit.abbr) + DEC_REGEX.source;
    } else {
      regexString = DEC_REGEX.source + escapeRegex(unit.abbr);
    }
  }

  return new RegExp(regexString, "gmi");
}

function unitCalculator(decl, units) {
  // Grab list of values in declValueArray
  var declValue = decl.value;
  var declValueArray = postcss.list.space(decl.value);

  // For each value in the declValueArray
  for (var i = 0; i < declValueArray.length; i++) {
    var originalArg = declValueArray[i];

    // For each unit in array
    for (var z = 0; z < units.length; z++) {
      var unit = units[z];
      unit.output = unit.output || "px";

      var regex = makeRegex(unit);

      // If unit matches declValueArray
      if (declValueArray[i].match(regex)) {
        var pattern = parser.parse(unit.pattern);

        var variableObj = {};
        var namedIdents = [];
        // var unnamedIdents = [];
        var variableValues = regex.exec(declValueArray[i]); // Beware includes original string as well
        var variableName = "";
        var variableValue = "";
        var _d = "";
        var _j = "";
        if (typeof unit.abbr === "string" && unit.abbr.match(GROUP_REGEX)) {
          var regex2 = new RegExp(GROUP_REGEX, "g");
          console.log(regex2);
          var str2 = unit.abbr;
          var array2;

          while ((array2 = regex2.exec(str2)) !== null) {
            namedIdents.push(array2[2]);
          }

          for (_d = 0; _d < variableValues.length - 1; _d++) {
            for (_j = 0; _j < namedIdents.length; _j++) {
              // Assign letter from alphabet as key
              variableName = namedIdents[_d];
              // and value as value
              variableValue = variableValues[_d + 1];
            }

            // Add key value pair to object
            variableObj[variableName] = variableValue;
          }
        } else {
          // For each captured variable value
          for (_d = 0; _d < variableValues.length - 1; _d++) {
            for (_j = 0; _j < alphabet.length; _j++) {
              // Assign letter from alphabet as key
              variableName = alphabet[_d];
              // and value as value
              variableValue = variableValues[_d + 1];
            }

            // Add key value pair to object
            variableObj[variableName] = variableValue;
          }
          // console.log(variableObj);
        }

        variableObj["phi"] = phi;
        variableObj["n"] = variableValues[1];

        var numberOnly = pattern.evaluate(variableObj);

        var finishedValue = "";
        console.log(GROUP_REGEX);
        if (typeof unit.output === "string" && unit.output.match(GROUP_REGEX)) {
          finishedValue = unit.output.replace(GROUP_REGEX, numberOnly);
        } else {
          finishedValue = numberOnly + unit.output;
        }

        // New argument
        var newArg = originalArg.replace(variableValues[0], finishedValue);
        originalArg = newArg;
      }
    }

    declValueArray[i] = originalArg;
  }

  declValue = declValueArray.join(" ");

  return declValue;
}

// plugin
export default postcss.plugin("postcss-sequence", opts => {
  return css => {
    css.walkDecls(decl => {
      if (opts) {
        decl.value = unitCalculator(decl, opts.units);
      }
    });
  };
});
