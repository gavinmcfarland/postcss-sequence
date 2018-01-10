# PostCSS Sequence [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

A [PostCSS] plugin for managing consistent scale, proportion and vertical rhythm using custom units based on numerical sequences.

## Usage

Create custom units by defining an abbreviation and the pattern to generate the n<sup>th</sup> index from a numerical sequence.

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
    padding: 16px;
}
```

## Setup

```bash
npm install postcss-sequence --save-dev
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

## Options

| Key | Description |
|-----|-------------|
| `abbr`    | A `string`  with the abbreviation of the name for your unit.  For more complex units you can use a number identifier like so `<g>` where `g` is the variable used in your pattern. If you require something unique you can also use a `regex`. |
| `position`| Position of where the abbreviation is placed. To the end by default. Choose from `'start'`, `'middle'` or `'end'`. |
| `pattern` | Pattern used to generate the `n` index from a numerical sequence. If using a regex or middle position affix you can use lowercase letters starting from `a` to reference groups in in the order they were captured. See example below. |
| `output` | Optional,`'px'` used by default. |


# Examples

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

Example:

```html
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

Setting the font based on a scale using golden ratio.

```js
units: [
    {
        abbr: 'x',
        pattern: 'round (16 * 1.618 ^ n) / 16',
        output: 'rem'
    }
]
```

Example:

```css
h1 {
	font-size: 4x;
}
h2 {
	font-size: 3x;
}
h3 {
	font-size: 2x;
}
```

Output:

```css
h1 {
	font-size: 6.875rem;
}
h2 {
	font-size: 4.25rem;
}
h3 {
	font-size: 2.625rem;
}
```

### Feet and inches

Writing in feet and inches.

```js
units: [
    {
        abbr: /([0-9]+)\'([0-9]+)\"/,
        pattern: '((a * 12) + b ) * 10',
        output: 'px'
    }
]
```

Example:

```css
div {
	width: 4'2";
}
```

Outputs:

```css
div {
	width: 500px;
}
```

### Fractions

Using fractions for percentages.

```js
units: [
    {
        abbr: '<n>/<d>',
        pattern: 'n / d',
        output: '%'
    }
]
```

Example:

```css
div {
	width: 1/4;
}
```

Outputs:

```css
div {
	width: 25%;
}
```

### Automatic rounding

Automatically round pixels to the nearest ten pixels.

```js
units: [
    {
        abbr: 'px',
    	pattern: 'round (n / 10) * 10'
    }]
```

Example:
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

Selecting a number from the fibonacci sequence.

```js
units: [
    {
	    abbr: 'f',
	    position: 'start',
	    pattern: 'floor (phi ^ n / sqrt 5 + 0.5)'
    }
]
```

Example:

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

[npm-url]: https://www.npmjs.com/package/postcss-sequence
[npm-img]: https://img.shields.io/npm/v/postcss-sequence.svg?=style=flat
[cli-url]: https://travis-ci.org/mindthetic/postcss-sequence
[cli-img]: https://img.shields.io/travis/mindthetic/postcss-sequence.svg
[win-url]: https://ci.appveyor.com/project/mindthetic/postcss-sequence
[win-img]: https://img.shields.io/appveyor/ci/mindthetic/postcss-sequence.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[PostCSS]: https://github.com/postcss/postcss
