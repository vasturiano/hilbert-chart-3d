import { Scene, Light, Camera, WebGLRenderer, Controls, Vector3, WebGLRendererParameters } from 'three';

type Accessor<In, Out> = Out | string | ((obj: In) => Out);
type NumericValue = number | bigint;
type ControlType = 'arcball' | 'trackball' | 'orbit' | 'fly' | Controls;
type Coordinates = { x: number; y: number; z: number };
type CameraPosition = Coordinates & { lookAt: Coordinates };

export type Range =
  | { start: number; length: number; [key: string]: any }
  | { start: bigint; length: bigint; [key: string]: any };

export interface HilbertChartOptions {
  controlType?: ControlType;
  rendererConfig?: WebGLRendererParameters;
}

type RangeBounds = { start: number; length: number } | { start: bigint; length: bigint };
type RangeAccessor<R extends RangeBounds, T> = Accessor<R, T>;
type RangeCompFn = (a: Range, b: Range) => number;
type NumFormatter = (num: NumericValue) => string;

declare class HilbertChart<R extends RangeBounds = Range> {
  constructor(element: HTMLElement, options?: HilbertChartOptions);

  _destructor(): void;

  width(): number;
  width(width: number): HilbertChart<R>;
  height(): number;
  height(height: number): HilbertChart<R>;

  hilbertOrder(): number;
  hilbertOrder(order: number): HilbertChart<R>;

  data(): R[];
  data<T extends RangeBounds>(data: T[]): HilbertChart<T>;
  color(): RangeAccessor<R, string>;
  color(colorAccessor: RangeAccessor<R, string>): HilbertChart<R>;
  label(): RangeAccessor<R, string>;
  label(textAccessor: RangeAccessor<R, string>): HilbertChart<R>;
  labelColor(): RangeAccessor<R, string | false>;
  labelColor(colorAccessor: RangeAccessor<R, string | false>): HilbertChart<R>;
  padding(): RangeAccessor<R, number>;
  padding(paddingAccessor: RangeAccessor<R, number>): HilbertChart<R>;
  paddingAbsolute(): RangeAccessor<R, number>;
  paddingAbsolute(paddingAbsoluteAccessor: RangeAccessor<R, number>): HilbertChart<R>;
  valFormatter(): NumFormatter;
  valFormatter(formatter: NumFormatter): HilbertChart<R>;
  simplifyCurves(): boolean;
  simplifyCurves(simplifyCurves: boolean): HilbertChart<R>;
  useInstancedMeshes(): RangeAccessor<R, boolean>;
  useInstancedMeshes(useInstancedMeshesAccessor: RangeAccessor<R, boolean>): HilbertChart<R>;

  focusOn(pos: NumericValue, length: NumericValue, ms?: number): HilbertChart<R>;
  zoomToFit(ms?: number, padding?: number): HilbertChart<R>;
  cameraPosition(): CameraPosition;
  cameraPosition(position: Partial<Coordinates>, lookAt?: Coordinates, transitionMs?: number): HilbertChart<R>;
  getPositionAtVal(value: NumericValue): Vector3;

  scene(): Scene;
  camera(): Camera;
  renderer(): WebGLRenderer;
  controls(): Controls;
  lights(): Light[];
  lights(lights: Light[]): HilbertChart<R>;

  tooltipContent(): RangeAccessor<R, string>;
  tooltipContent(contentAccessor: RangeAccessor<R, string>): HilbertChart<R>;

  onHover(cb: (range: R | null, previousRange: R | null) => void): HilbertChart<R>;
  onClick(cb: (range: R, event: MouseEvent) => void): HilbertChart<R>;
  onBackgroundClick(cb: (event: MouseEvent) => void): HilbertChart<R>;
  hoverOrderComparator(compFn: RangeCompFn): HilbertChart<R>;
}

export default HilbertChart;
