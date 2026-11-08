import Kapsule from 'kapsule';
import accessorFn from 'accessor-fn';
import ThreeRenderObjects from 'three-render-objects';
import { AmbientLight, DirectionalLight } from 'three';
import ThreeHilbert from 'three-hilbert';

export default Kapsule({
  props: {
    width: { default: window.innerWidth, onChange(v, state) { state.renderObjs.width(v) }, triggerUpdate: false },
    height: { default: window.innerHeight, onChange(v, state) { state.renderObjs.height(v) }, triggerUpdate: false },
    hilbertOrder: { default: 3, onChange(v, state) { state.hilbert.order(v) }, triggerUpdate: false }, // 0-4096 default
    data: { default: [], onChange(v, state) { state.hilbert.data(v) }, triggerUpdate: false },
    padding: { default: 0, onChange(v, state) { state.hilbert.padding(v) }, triggerUpdate: false },
    color: { onChange(v, state) { state.hilbert.color(v) }, triggerUpdate: false },
    label: { default: 'name', onChange(v, state) { state.hilbert.label(v) }, triggerUpdate: false },
    labelColor: { default: () => 'white', onChange(v, state) { state.hilbert.labelColor(v) }, triggerUpdate: false },
    simplifyCurves: { default: true, onChange(v, state) { state.hilbert.simplifyCurves(v) }, triggerUpdate: false },
    useInstancedMeshes: { default: false, onChange(v, state) { state.hilbert.useInstancedMeshes(v) }, triggerUpdate: false },
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
    },

    zoomToFit: function(state, transitionDuration, padding) {
      state.renderObjs.zoomTofit(transitionDuration, padding);
      return this;
    },
    _animationCycle(state) {
      // Frame cycle
      state.renderObjs.tick();
      state.animationFrameRequestId = requestAnimationFrame(this._animationCycle);
    },
    scene: state => state.renderObjs.scene(), // Expose scene
    camera: state => state.renderObjs.camera(), // Expose camera
    renderer: state => state.renderObjs.renderer(), // Expose renderer
    controls: state => state.renderObjs.controls(), // Expose controls
    _destructor: function(state) {
      cancelAnimationFrame(state.animationFrameRequestId);
      this.data([]);
      state.hilbert._destructor?.();
      state.renderObjs._destructor?.();
    }
  },
  stateInit({ controlType = 'orbit' }) {
    const hilbert = new ThreeHilbert();
    return {
      hilbert,
      renderObjs: ThreeRenderObjects({ controlType })
        .objects([hilbert])
        .lights([
          new AmbientLight(0xcccccc, Math.PI),
          new DirectionalLight(0xffffff, 0.6 * Math.PI)
        ])
    };
  },

  init: function(el, state) {
    // Wipe DOM
    el.innerHTML = '';
    el.style.position = 'relative';

    // Add renderObjs
    const roDomNode = document.createElement('div');
    el.appendChild(roDomNode);

    const getHilbertObjData = (obj, intersection) => {
      if (!obj) return null;
      if (intersection && obj.isInstancedMesh) {
        return obj.userData.data?.[intersection.instanceId] || null;
      }
      const hilbertObj = getHilbertObj(obj);
      return hilbertObj?.__data || null;

      function getHilbertObj(object) {
        let obj = object;
        // recurse up object chain until finding the globe object
        while (obj && !obj.hasOwnProperty('__data')) {
          obj = obj.parent;
        }
        return obj;
      }
    };

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

    state.renderObjs.camera().position.z = 500;

    //

    // Kick-off renderer
    this._animationCycle();
  }
});
