module.exports = {
	"postcss-sequence": {
		basic: {
			message: "supports basic usage",
			options: {
				units: [
					{
						abbr: "gu",
						pattern: "n * 4",
						output: "px"
					}
				]
			}
		},
		idents: {
			message: "Supports identifiers",
			options: {
				units: [
					{
						abbr: "<a>fs",
						pattern: "a * 1",
						output: "calc(var(--font-size-<a>))"
					}
				]
			}
		}
	}
};
