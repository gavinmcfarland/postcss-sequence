var postcss = require('postcss');
var Parser = require('expr-eval').Parser;
// var unitCalculator = require('./unitCalculator.js');

module.exports = postcss.plugin('postcss-pat', function (opts) {
    opts = opts || {};

    var parser = new Parser();

    // List of letters in the alphabet
    var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    // Common regexes
    var DEC_REGEX = /([+-]?(?:\d*\.)?\d+)/gmi;
    var CHAR_REGEX = /(<[a-z]>)/gmi;
    var GROUP_REGEX = /(<([a-z])>)/gmi;

    var SQRT5 = Math.sqrt(5);
    var PHI = (SQRT5 + 1) / 2;

    function regExpEscape(literal_string) {
        return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
    }

    var makeRegex = function(unit) {

    	var regex = "";

    	if (unit.abbr instanceof RegExp) {
    		regex = unit.abbr.source;
    	} else if (typeof unit.abbr == "string") {
    		if (unit.abbr.match(GROUP_REGEX)) {
    			// Somehow need to turn this custom abbr into a regex. If possible to split
    			// into an array, so look for groups '<a>'' and characters 'ft'. Would need to
    			// somehow create name for group. Maybe put groups into another array, and name
    			// contentds of group identifier.

    			// 1. replace each group reference with regex group
    			var originalString = unit.abbr;
    			var newString = unit.abbr.replace(GROUP_REGEX, DEC_REGEX.source);
    			var regex = unit.abbr.replace(GROUP_REGEX, DEC_REGEX.source);

    		} else {
    			if (unit.position == "start") {
    				regex = regExpEscape(unit.abbr) + DEC_REGEX.source;
    			} else if (unit.position == "middle") {
    				regex = DEC_REGEX.source + regExpEscape(unit.abbr) + DEC_REGEX.source;
    			} else {
    				regex = DEC_REGEX.source + regExpEscape(unit.abbr);
    			}
    		}
    	}

    	return new RegExp(regex, "gmi");

    };


    function unitCalculator (decl) {
    	// Grab list of values in expression
    	var expression = postcss.list.space(decl.value);

    	// For each value in the expression
    	for (var i = 0; i < expression.length; i++) {
    		var completeValue = expression[i];
    		// For each unit in array
    		for (var z = 0; z < opts.units.length; z++) {
    			var unit = opts.units[z];
                unit.output = unit.output || "px";
    			var regex = makeRegex(unit);


    			// If unit matches expression
    			if (expression[i].match(regex)) {



    				var expr = parser.parse(opts.units[z].pattern);

    				var variableObj = {};
    				var namedIdents = [];
    				var unnamedIdents = [];
    				var variableValues = regex.exec(expression[i]); // Beware includes original string as well

    				// Temp
    				var equationN = variableValues[1];
    				var equationA = variableValues[1];
    				var equationB = variableValues[2];

    				var variableName;
    				var variableValue;

    				if ((typeof unit.abbr === "string") && (unit.abbr.match(GROUP_REGEX))) {

    					// Put matches into an array and name.
    					// console.log(expression[i]);
    					// console.log(unit.abbr);
    					// console.log(regex);

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

    				variableObj['PHI'] = PHI;
                    var newValue = expr.evaluate(variableObj);
    				var completeValue = newValue + unit.output;




    			}
    		};
    		expression[i] = completeValue;
    	};

    	// 	} else if (expression[i].match(FRACTION_REGEX)) {
    	// 		var fraction = expression[i];
    	// 		fraction.split("/");
    	// 		expression[i] = (fraction[0] / fraction[2]) * 100 + "%";
    	// 	}
    	// };



    	expression = expression.join(" ");

    	return expression;
    }

    return function (css, result) {

        // Runs through all of the nodes (declorations) in the file
        css.walkDecls(decl => {

            decl.value = unitCalculator(decl);

        });

    };
});
