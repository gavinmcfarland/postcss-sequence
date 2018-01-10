module.exports = {
	'postcss-sequence': {
		'basic': {
			message: 'supports basic usage',
			options: {
				units: [
			        {
			            abbr: 'gu',
			            pattern: 'n * 4',
			            output: 'px'
			        }
			    ]
			}
		}
	}
};
