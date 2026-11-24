import Kapsule from 'kapsule';
import accessorFn from 'accessor-fn';
import ThreeRenderObjects from 'three-render-objects';
import { AmbientLight, DirectionalLight } from 'three';
import ThreeHilbert from 'three-hilbert';

import './index.css';

export default Kapsule({
  props: {
    width: { default: window.innerWidth, onChange(v, state) { state.renderObjs.width(v) }},
    height: { default: window.innerHeight, onChange(v, state) { state.renderObjs.height(v) }},
    hilbertOrder: { default: 3, onChange(v, state) { state.hilbert.order(v) }}, // 0-4096 default
    data: { default: [], onChange(v, state) {
      state.hilbert.data(v);
      state.renderObjs.pointerRaycasterThrottleMs(v.length > 1e4 ? 100 : 50); // throttle raycaster when there's a lot of objects
    }},
    padding: { default: 0, onChange(v, state) { state.hilbert.padding(v) }},
    paddingAbsolute: { default: 0, onChange(v, state) { state.hilbert.paddingAbsolute(v) }},
    color: { onChange(v, state) { state.hilbert.color(v) }},
    label: { default: 'name', onChange(v, state) { state.hilbert.label(v) }},
    labelColor: { default: () => 'lavender', onChange(v, state) { state.hilbert.labelColor(v) }},
    simplifyCurves: { default: true, onChange(v, state) { state.hilbert.simplifyCurves(v) }},
    useInstancedMeshes: { default: false, onChange(v, state) { state.hilbert.useInstancedMeshes(v) }},
    valFormatter: { default: d => d },
    tooltipContent: { triggerUpdate: false },
    onHover: { triggerUpdate: false },
    onClick: { triggerUpdate: false },
    onBackgroundClick: { triggerUpdate: false }
  },
  methods: {
    focusOn: function(state, pos, length, transitionDuration) {
      setTimeout(() => { // Give time for hilbert to initialize
        const bbox = state.hilbert.getRangeBbox(pos, length);
        const roBbox = { x: [bbox.min.x, bbox.max.x], y: [bbox.min.y, bbox.max.y], z: [bbox.min.z, bbox.max.z] }
        state.renderObjs.fitToBbox(roBbox, transitionDuration);
      });
      return this;
    },
    zoomToFit: function(state, transitionDuration, padding) {
      state.renderObjs.zoomToFit(transitionDuration, padding);
      return this;
    },
    getPositionAtVal: (state, ...args) => state.hilbert.getPositionAtVal(...args),
    _animationCycle(state) {
      // Frame cycle
      state.renderObjs.tick();
      state.animationFrameRequestId = requestAnimationFrame(this._animationCycle);
    },
    cameraPosition: function(state, ...args) {
      if (args.length) { // setter
        state.renderObjs.cameraPosition(...args);
        return this;
      }
      return state.renderObjs.cameraPosition();
    },
    lights: function(state, ...args) {
      if (args.length) { // setter
        state.renderObjs.lights(...args);
        return this;
      }
      return state.renderObjs.lights();
    },
    scene: state => state.renderObjs.scene(), // Expose scene
    camera: state => state.renderObjs.camera(), // Expose camera
    renderer: state => state.renderObjs.renderer(), // Expose renderer
    controls: state => state.renderObjs.controls(), // Expose controls
    hoverOrderComparator: function(state, dataComp) {
      state.renderObjs.hoverOrderComparator(dataComp && ((_a, _b, a, b) => {
        const [da, db] = [a, b].map(i => getHilbertObjData(i?.object, i));
        return (!da - !db) || dataComp(da, db) || (a.distance - b.distance);
      }));
      return this;
    },
    _destructor: function(state) {
      cancelAnimationFrame(state.animationFrameRequestId);
      this.data([]);
      state.hilbert._destructor?.();
      state.renderObjs._destructor?.();
    }
  },
  stateInit({ controlType = 'orbit', rendererConfig = { reversedDepthBuffer: true, antialias: true, alpha: true }}) {
    const hilbert = new ThreeHilbert();
    return {
      hilbert,
      renderObjs: ThreeRenderObjects({ controlType, rendererConfig })
        .objects([hilbert])
        .lights([
          new AmbientLight(0xcccccc, Math.PI),
          new DirectionalLight(0xffffff, 0.6 * Math.PI)
        ]),
      controlType
    };
  },

  init: function(el, state) {
    // Wipe DOM
    el.innerHTML = '';
    el.style.position = 'relative';

    // Add renderObjs
    const roDomNode = document.createElement('div');
    roDomNode.className = 'hilbert-scene-container';
    el.appendChild(roDomNode);
    state.renderObjs(roDomNode)
      .tooltipContent((obj, intersection) => {
        const d = getHilbertObjData(obj, intersection);
        return !d ? '' : state.tooltipContent
          ? accessorFn(state.tooltipContent)(d) || ''
          : (() => {
            // default content
            const label = accessorFn(state.label)(d);
            return `${label ? `<b>${label}</b>: ` : ''}${state.valFormatter(d.start) + (d.length > 1 ? ' - ' + state.valFormatter(d.start + d.length - (typeof d.start === 'bigint' ? 1n : 1)) : '')}`;
          })()
      })
      .onHover((obj, _, intersection) => {
        // Update tooltip and trigger onHover events
        const hoverD = getHilbertObjData(obj, intersection);
        if (hoverD !== state.hoverD) {
          state.onHover?.(hoverD, state.hoverD || null);

          // set pointer if hovered object is clickable
          state.renderObjs.renderer().domElement.classList[
            ((hoverD && state.onClick) || (!hoverD && state.onBackgroundClick)) ? 'add' : 'remove'
            ]('clickable');

          state.hoverD = hoverD;
        }
      })
      .onClick((obj, ev, intersection) => {
        const d = getHilbertObjData(obj, intersection);
        d ? state.onClick?.(d, ev) : state.onBackgroundClick?.(ev);
      });

    const camera = state.renderObjs.camera();
    camera.near = 0.001;
    camera.position.x = -350;
    camera.position.y = 160;
    camera.position.z = -175;
    state.controlType === 'fly' && (state.renderObjs.controls().movementSpeed = 80);

    //

    // Kick-off renderer
    this._animationCycle();
  }
});

function getHilbertObjData(obj, intersection) {
  if (!obj) return null;
  const hilbertObj = getHilbertObj(obj);
  const d = hilbertObj?.__data || null;
  return (intersection && hilbertObj.isInstancedMesh) ? d?.[intersection.instanceId] : d;

  function getHilbertObj(object) {
    let obj = object;
    // recurse up object chain until finding the hilbert object
    while (obj && !obj.hasOwnProperty('__data')) {
      obj = obj.parent;
    }
    return obj;
  }
}
