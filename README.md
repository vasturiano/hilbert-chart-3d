Hilbert Chart 3D
================

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![NPM Downloads][npm-downloads-img]][npm-downloads-url]
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url)

A 3D hilbert space-filling curve chart for representing one-dimensional lengths on a three-dimensional space.

<p align="center">
   <a href="https://vasturiano.github.io/hilbert-chart-3d/examples/ipv4-address-space/"><img width="80%" src="https://vasturiano.github.io/hilbert-chart-3d/examples/ipv4-address-space/preview.png"></a>
</p>

Uses [ThreeJS](https://github.com/mrdoob/three.js/)/WebGL for 3D rendering and [three-hilbert](https://github.com/vasturiano/three-hilbert) for the layout computation.

See also the [2D version](https://github.com/vasturiano/hilbert-chart).

## Examples

* [IPv4 Address Space](https://vasturiano.github.io/hilbert-chart-3d/examples/ipv4-address-space/) ([source](https://github.com/vasturiano/hilbert-chart-3d/blob/master/examples/ipv4-address-space/index.html))
* [Ordinal (cubic pie chart)](https://vasturiano.github.io/hilbert-chart-3d/examples/ordinal/) ([source](https://github.com/vasturiano/hilbert-chart-3d/blob/master/examples/ordinal/index.html))
* [IPv6 BGP Routing Table](https://vasturiano.github.io/hilbert-chart-3d/examples/bgp-announced-space-ipv6/) ([source](https://github.com/vasturiano/hilbert-chart-3d/blob/master/examples/bgp-announced-space-ipv6/index.html))

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
| <b>controlType</b>: <i>str</i> or <i>class</i> | Which type of control to use to control the camera. Choice between [trackball](https://threejs.org/examples/misc_controls_trackball.html), [arcball](https://threejs.org/examples/misc_controls_arcball.html), [orbit](https://threejs.org/examples/#misc_controls_orbit), [fly](https://threejs.org/examples/misc_controls_fly.html), or a custom [Three.js controls](https://threejs.org/docs/#Controls) class. | `orbit` |
| <b>rendererConfig</b>: <i>object</i> | Configuration parameters to pass to the [ThreeJS WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) constructor. | `{ antialias: true, alpha: true }` |

### Container
| Method | Description | Default |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------- |
| <b>width</b>([<i>px</i>]) | Getter/setter for the canvas width. | *&lt;window width&gt;* |
| <b>height</b>([<i>px</i>]) | Getter/setter for the canvas height. | *&lt;window height&gt;* |

### Hilbert layout
| Method | Description | Default |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------- |
| <b>hilbertOrder</b>([<i>number</i>]) | Getter/setter for the extent of the hilbert curve range, determined by `8^order`. Orders above `17` use BigInt arithmetic; supply BigInt values or safe integer Numbers for exact input. | 3 |
| <b>simplifyCurves</b>([<i>boolean</i>]) | Getter/setter for whether to simplify the resolution of the curve to the most canonical 2-bit boundary that fits the range integral. For example, in a 2nd order curve (64 values), a range from 8 to 23 can be simplified from 16 vertices to 2 (each filling a cube with 8 values). This simplification greatly reduces the number of vertices in the curve and improves the calculation and rendering performance, specially for high-order ranges which tend to fall on bit boundaries. | `true` |
| <b>padding</b>([<i>number</i>, <i>string</i> or <i>fn</i>]) | Getter/setter for the range object padding ratio accessor function (`fn(range)`), attribute or a constant number for all ranges. The padding ratio should be a number between `0` and `1` representing the proportional size of the padding space compared to the width of the path. | 0 |
| <b>paddingAbsolute</b>([<i>number</i>, <i>string</i> or <i>fn</i>]) | Getter/setter for the range object absolute padding accessor function (`fn(range)`), attribute or a constant number for all ranges. The value represents the absolute padding size as a fraction of the full Hilbert width. | 0 |
| <b>getPositionAtVal</b>(<i>value</i>) | Returns the `THREE.Vector3` position at the specified value along the curve. `value` may be a Number or BigInt. | |

### Data input
| Method | Description | Default |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------- |
| <b>data</b>([<i>array</i>]) | Getter/setter for the list of ranges to render. Each range object should follow the minimum syntax of `{start: <number or bigint>, length: <number or bigint>}`; `start` and `length` must both be Numbers or both be BigInts. | `[]` |
| <b>color</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for the range object color accessor function (`fn(range)`) or attribute. | (cycle through d3.schemePaired for unique labels) |
| <b>label</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for the range object label accessor function (`fn(range)`) or attribute. | `name` |
| <b>labelColor</b>([<i>string</i>, <i>false</i> or <i>fn</i>]) | Getter/setter for the range object label color accessor function (`fn(range)`) or attribute. A falsy value disables the label. | `() => 'white'` |
| <b>valFormatter</b>([<i>fn</i>]) | Getter/setter for the value formatting function (`fn(value)`), in default tooltips. Values may be Numbers or BigInts. | `d => d` |

### Render control
| Method | Description | Default |
| --- | --- | :--: |
| <b>useInstancedMeshes</b>([<i>boolean</i> or <i>fn</i>]) | Getter/setter for whether to render compatible segments with [THREE.InstancedMesh](https://threejs.org/docs/#InstancedMesh) to reduce draw calls. Accepts a boolean or a function of the datum. Recommended for very large datasets. Segments that cannot be instanced use regular meshes. | `false` |
| <b>zoomToFit</b>([<i>ms</i>], [<i>px</i>]) | Automatically moves the camera so that all of the hilbert segments become visible within its field of view. It accepts two optional arguments: the first defines the duration of the transition (in ms) to animate the camera motion (default: 0ms). The second argument is the amount of padding (in px) between the edge of the canvas and the outermost node location (default: 10px). | `(0, 10)` |
| <b>focusOn</b>(<i>pos</i>, <i>length</i>, [<i>ms</i>]) | Zoom-in on a particular area of the chart, defined by [`pos`, `pos+length-1`]. `pos` and `length` may be Numbers or BigInts. An optional 3rd argument defines the duration of the transition (in ms) to animate the zooming motion. A value of 0 (default) jumps immediately to the final position. ||
| <b>cameraPosition</b>([<i>{x,y,z}</i>], [<i>lookAt</i>], [<i>ms</i>]) | Getter/setter for the camera position, in terms of `x`, `y`, `z` coordinates. Each of the coordinates is optional, allowing for motion in just some dimensions. The optional second argument can be used to define the direction that the camera should aim at, in terms of an `{x,y,z}` point in the 3D space. The 3rd optional argument defines the duration of the transition (in ms) to animate the camera motion. A value of 0 (default) moves the camera immediately to the final position. | |
| <b>lights</b>([<i>array</i>]) | Getter/setter for the list of lights to use in the scene. Each item should be an instance of [Light](https://threejs.org/docs/#api/en/lights/Light). | [AmbientLight](https://threejs.org/docs/?q=ambient#api/en/lights/AmbientLight) + [DirectionalLight](https://threejs.org/docs/#api/en/lights/DirectionalLight) (from above) |
| <b>scene</b>() | Access the internal ThreeJS [Scene](https://threejs.org/docs/#api/scenes/Scene). | |
| <b>camera</b>() | Access the internal ThreeJS [Camera](https://threejs.org/docs/#api/cameras/PerspectiveCamera). | |
| <b>renderer</b>() | Access the internal ThreeJS [WebGL renderer](https://threejs.org/docs/#api/renderers/WebGLRenderer). ||
| <b>controls</b>() | Access the internal ThreeJS controls object. ||

### Interaction
| Method | Description | Default |
| --- | --- | :--: |
| <b>tooltipContent</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for the range object tooltip content accessor function or attribute. Supports plain text or HTML content. | `<label>: <start> - <end>` |
| <b>onHover</b>(<i>fn</i>) | Callback function for range mouse over events. Receives the current range (or `null` if hovering out) and the previous range (or `null`). | - |
| <b>onClick</b>(<i>fn</i>) | Callback function for range clicks. Receives the range object and the mouse event. | - |
| <b>onBackgroundClick</b>(<i>fn</i>) | Callback function for click events on the empty background space. Receives the mouse event. | - |
| <b>hoverOrderComparator</b>(<i>fn</i>) | Comparator function to use when hovering over multiple ranges under the same line of sight. This function can be used to prioritize hovering some ranges over others. | By default, hovering priority is based solely on camera proximity (closest range wins). |

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
