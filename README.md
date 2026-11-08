Hilbert Chart 3D
================

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![NPM Downloads][npm-downloads-img]][npm-downloads-url]
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url)

A 3D hilbert space-filling curve chart for representing one-dimensional lengths on a three-dimensional space.

Uses [ThreeJS](https://github.com/mrdoob/three.js/)/WebGL for 3D rendering.

See also the [2D version](https://github.com/vasturiano/hilbert-chart).

## Examples

* [IPv4 Address Space](https://vasturiano.github.io/hilbert-chart-3d/examples/ipv4-address-space/) ([source](https://github.com/vasturiano/hilbert-chart-3d/blob/master/examples/ipv4-address-space/index.html))
* [Ordinal (cubic pie chart)](https://vasturiano.github.io/hilbert-chart-3d/examples/ordinal/) ([source](https://github.com/vasturiano/hilbert-chart-3d/blob/master/examples/ordinal/index.html))

## Quick start

```js
import HilbertChart3D from 'hilbert-chart-3d';
```
or using a *script* tag
```html
<script src="//cdn.jsdelivr.net/npm/hilbert-chart-3d"></script>
```
then
```js
const myChart = new HilbertChart3D(<myDOMElement>)
  .hilbertOrder(<hilbertOrder>)
  .data(<myData>);
```

## API reference

### Initialisation
```js
new HilbertChart3D(<domElement>, { configOptions })
```

| Config options | Description | Default |
| --- | --- | :--: |
| <b>controlType</b>: <i>str</i> | Which type of control to use to control the camera. Choice between [trackball](https://threejs.org/examples/misc_controls_trackball.html), [orbit](https://threejs.org/examples/#misc_controls_orbit) or [fly](https://threejs.org/examples/misc_controls_fly.html). | `orbit` |

### Methods

| Method | Description | Default |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------- |
| <b>width</b>([<i>px</i>]) | Getter/setter for the canvas width. | *&lt;window width&gt;* |
| <b>height</b>([<i>px</i>]) | Getter/setter for the canvas height. | *&lt;window height&gt;* |
| <b>hilbertOrder</b>([<i>number</i>]) | Getter/setter for the extent of the hilbert curve range, determined by `8^order`. Orders above `17` use BigInt arithmetic; supply BigInt values or safe integer Numbers for exact input. | 3 |
| <b>data</b>([<i>array</i>]) | Getter/setter for the list of ranges to render. Each range object should follow the minimum syntax of `{start: <number or bigint>, length: <number or bigint>}`. | `[]` |
| <b>color</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for the range object color accessor function (`fn(range)`) or attribute. | (cycle through d3.schemeCategory20 for unique labels) |
| <b>label</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for the range object label accessor function (`fn(range)`) or attribute. | `name` |
| <b>labelColor</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for the range object label color accessor function (`fn(range)`) or attribute. | `() => 'white'` |
| <b>padding</b>([<i>number</i>, <i>string</i> or <i>fn</i>]) | Getter/setter for the range object padding ratio accessor function (`fn(range)`), attribute or a constant number for all ranges. The padding ratio should be a number between `0` and `1` representing the proportional size of the padding space compared to the width of the path. | 0 |
| <b>valFormatter</b>([<i>fn</i>]) | Getter/setter for the value formatting function (`fn(value)`), in default tooltips. Values may be Numbers or BigInts; should return a string. | `d => d` |
| <b>simplifyCurves</b>([<i>boolean</i>]) | Getter/setter for whether to simplify the resolution of the curve to the most canonical 2-bit boundary that fits the range integral. For example, in a 2nd order curve (64 values), a range from 8 to 23 can be simplified from 16 vertices to 2 (each filling a cube with 8 values). This simplification greatly reduces the number of vertices in the curve and improves the calculation and rendering performance, specially for high-order ranges which tend to fall on bit boundaries. | `true` |
| <b>useInstancedMeshes</b>([<i>boolean</i>]) | Getter/setter for whether to render compatible segments with [THREE.InstancedMesh](https://threejs.org/docs/#InstancedMesh) to reduce draw calls. Segments that cannot be instanced use regular meshes. | `false` |
| <b>focusOn</b>(<i>pos</i>, <i>length</i>, [<i>ms</i>]) | Zoom-in on a particular area of the chart, defined by [`pos`, `pos+length-1`]. `pos` and `length` may be Numbers or BigInts. An optional 3rd argument defines the duration of the transition (in ms) to animate the zooming motion. A value of 0 (default) jumps immediately to the final position. ||
| <b>zoomToFit</b>([<i>ms</i>], [<i>px</i>], [<i>nodeFilterFn</i>]) | Automatically moves the camera so that all of the hilbert segments become visible within its field of view. It accepts two optional arguments: the first defines the duration of the transition (in ms) to animate the camera motion (default: 0ms). The second argument is the amount of padding (in px) between the edge of the canvas and the outermost node location (default: 10px). | `(0, 10)` |
| <b>tooltipContent</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for the range object tooltip content accessor function or attribute. Supports plain text or HTML content. | `<label>: <start> - <end>` |
| <b>onHover</b>(<i>fn</i>) | Callback function for range mouse over events. The range object (or `null` if hovering out) is included as single argument `onHover(range)`. | - |
| <b>onClick</b>(<i>fn</i>) | Callback function for range clicks. The range object is included as single argument `onRangeClick(range)`. | - |

Use BigInt literals (for example, `12345678901234567890n`) when values exceed JavaScript's safe integer range.

## ❤️ Support This Project

If you find this module useful and would like to support its development, you can [buy me a ☕](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url). Your contributions help keep open-source sustainable!
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url)


[npm-img]: https://img.shields.io/npm/v/hilbert-chart-3d
[npm-url]: https://npmjs.org/package/hilbert-chart-3d
[build-size-img]: https://img.shields.io/bundlephobia/minzip/hilbert-chart-3d
[build-size-url]: https://bundlephobia.com/result?p=hilbert-chart-3d
[npm-downloads-img]: https://img.shields.io/npm/dt/hilbert-chart-3d
[npm-downloads-url]: https://www.npmtrends.com/hilbert-chart-3d

