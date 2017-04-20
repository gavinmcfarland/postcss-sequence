var postcss = require('postcss');
var Parser = require('expr-eval').Parser;

var parser = new Parser();

// List of letters in the alphabet
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
var SPEC_CHARACTERS = /[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g;

// Common regexes
var DEC_REGEX = /([+-]?(?:\d*\.)?\d+)/;
var CHAR_REGEX = /(<[a-z]>)/;
var GROUP_REGEX = /(<([a-z])>)/;

// Common math numbers
var SQRT5 = Math.sqrt(5);
var phi = (SQRT5 + 1) / 2;


function escapeRegex(string) {
    return string.replace(SPEC_CHARACTERS, '\\$&');
}

function makeRegex(unit) {

    var regexString = "";

    if (unit.abbr instanceof RegExp) {
        // If unit abbreviation is a regex then use that
        regexString = unit.abbr.source;

    } else if (typeof unit.abbr == "string") {

        if (unit.abbr.match(GROUP_REGEX)) {
            // If unit abbreviation is made up of group identifiers then create regex
            var originalString = unit.abbr;
            var newString = unit.abbr.replace(GROUP_REGEX, DEC_REGEX.source);
            var regexString = unit.abbr.replace(GROUP_REGEX, DEC_REGEX.source);

        }

        else {
            // If unit abbreviation is just a string
            if (unit.position == "start") {
                regexString = escapeRegex(unit.abbr) + DEC_REGEX.source;
            } else if (unit.position == "middle") {
                regexString = DEC_REGEX.source + escapeRegex(unit.abbr) + DEC_REGEX.source;
            } else {
                regexString = DEC_REGEX.source + escapeRegex(unit.abbr);
            }
        }
    }

    return new RegExp(regexString, "gmi");

};

function unitCalculator (decl, units) {


    // Grab list of values in declValueArray
    var declValue = decl.value;
    var declValueArray = postcss.list.space(decl.value);

    // For each value in the declValueArray
    for (var i = 0; i < declValueArray.length; i++) {
        var delcValueArg = declValueArray[i];

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
                var unnamedIdents = [];
                var variableValues = regex.exec(declValueArray[i]); // Beware includes original string as well

                if ((typeof unit.abbr === "string") && (unit.abbr.match(GROUP_REGEX))) {

                    var newMatches;
                    while ((newMatches = GROUP_REGEX.exec(unit.abbr)) !== null) {
                        namedIdents.push(newMatches[2]);
                    }

                    for (var d = 0; d < (variableValues.length - 1); d++) {

                        for (var j = 0; j < namedIdents.length; j++) {
                            // Assign letter from alphabet as key
                            var variableName = namedIdents[d];
                            // and value as value
                            var variableValue = variableValues[d+1];
                        }

                        // Add key value pair to object
                        variableObj[variableName] = variableValue;
                    }

                } else {
                    // For each captured variable value
                    for (var d = 0; d < (variableValues.length - 1); d++) {

                        for (var j = 0; j < alphabet.length; j++) {
                            // Assign letter from alphabet as key
                            var variableName = alphabet[d];
                            // and value as value
                            var variableValue = variableValues[d+1];
                        }

                        // Add key value pair to object
                        variableObj[variableName] = variableValue;
                    }
                    // console.log(variableObj);
                }

                variableObj['phi'] = phi;
                var newValue = pattern.evaluate(variableObj);
                var delcValueArg = newValue + unit.output;

            }
        };

        declValueArray[i] = delcValueArg;
    };

    declValue = declValueArray.join(" ");

    return declValue;
}


module.exports = postcss.plugin('postcss-pat', function (opts) {
    opts = opts || {};

    return function (css, result) {

        // Runs through all of the nodes (declorations) in the file
        css.walkDecls(decl => {

            decl.value = unitCalculator(decl, opts.units);

        });

    };
});
