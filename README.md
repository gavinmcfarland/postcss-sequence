# PostCSS Sequence

A [PostCSS](https://github.com/postcss/postcss) plugin for managing consistent scale and proportion of your design using custom units based on numerical sequences.

# Usage

Create custom units by defining an abbreviation and the pattern to generate the `n`th index from a numerical sequence.
```js
units: [
    {
        abbr: 'gu',
        pattern: 'n * 4',
    }
]
```

Example:
```css
div {
    padding: 4gu;
}
```

Outputs:
```css
div {
     padding: 16px; // (4 * 4)
}
```

# Setup

```
npm install postcss-sequence
```

Define one or more units by passing them to the plugin as options:
```js
units: [
    {
        abbr: 'gu',
        pattern: 'n * 4',
    }
]
```

# Options

- `abbr`: A `string`  with the abbreviation of the name for your unit.  For more complex units you can use a number identifier like so `<g>` where `g` is the variable used in your pattern. If you require something unique you can also use a `regex`.
- `position`: Position of where the abbreviation is placed. To the end by default. Choose from `'start'`, `'middle'` or `'end'`.  
- `pattern`: Pattern used to generate the `n` index from a numerical sequence. If using a regex or middle position affix you can use lowercase letters starting from `a` to reference groups in in the order they were captured. See example below.
- `output`:  Optional,`'px'` used by default.


# Various examples

### Grid units

A grid unit based on a grid of 4px
```js
units: [
    {
        abbr: 'gu',
        pattern: 'n * 4',
    }
]
```

Usage:
```css
div {
	padding: 4gu;
	margin: 4gu 2gu;
}
```

Outputs:
```css
div {
	padding: 16px;
	margin: 16px 8px;
}
```

### Font scale

Setting the font based on a scale using golden ratio
```js
units: [
    {
        abbr: 'x',
        pattern: 'n * pow(16, 1.68)',
        output: 'em'
    }
]
```

Usage:
```css
h1 {
	font-size: 5x;
}
h2 {
	font-size: 4x;
}
h3 {
	font-size: 2x;
}
```

### Feet and inches

Writing in feet and inches
```js
units: [
    {
        abbr: /([0-9]+)\'([0-9]+)\"/,
        pattern: '((a * 12) + b ) * 10',
        output: 'px'
    }
]
```

Usage:
```css
div {
	width: 4'2";
}
```

Ouputs:
```css
div {
	width: 500px;
}
```

### Fractions

Using fractions for percentages
```js
units: [
    {
        abbr: '<n>/<d>',
        pattern: 'n / d',
        output: '%'
    }
]
```

Usage:
```css
div {
	width: 1/4;
}
```

Ouputs:
```css
div {
	width: 25%;
}
```

### Automatic rounding

Automatically round pixels to the nearest ten pixels
```js
units: [
    {
        abbr: 'px',
    	pattern: 'round (n / 10) * 10'
    }]
```

Usage:
```css
div {
	width: 26px;
}
```

Outputs:
```css
div {
	width: 30px;
}
```

### Fibonacci number

Selecting a number from the fibonacci sequence
```js
units: [
    {
	    abbr: 'f',
	    position: 'start',
	    pattern: 'floor (phi ^ n / sqrt 5 + 0.5)'
    }
]
```

Usage:
```css
div {
	width: f6;
	padding: f3 f4;
}
```
Outputs:
```css
div {
	font-size: 24px;
	padding: 4.8px;
}
```

See [PostCSS] docs for examples for your environment.
