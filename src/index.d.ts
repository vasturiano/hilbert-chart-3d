import { Scene, Light, Camera, WebGLRenderer } from 'three';

type Accessor<In, Out> = Out | string | ((obj: In) => Out);
type NumericValue = number | bigint;
type ControlType = 'arcball' | 'trackball' | 'orbit' | 'fly';

export interface Range {
  start: NumericValue;
  length: NumericValue;
  [key: string]: any;
}

export interface HilbertChartOptions {
  controlType?: ControlType;
}

type RangeBounds = Pick<Range, 'start' | 'length'>;
type RangeAccessor<R extends RangeBounds, T> = Accessor<R, T>;
type NumFormatter = (num: NumericValue) => string;

declare class HilbertChart<R extends RangeBounds = Range> {
  constructor(element: HTMLElement, options?: HilbertChartOptions);

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
  labelColor(): RangeAccessor<R, string>;
  labelColor(colorAccessor: RangeAccessor<R, string>): HilbertChart<R>;
  padding(): RangeAccessor<R, number>;
  padding(paddingAccessor: RangeAccessor<R, number>): HilbertChart<R>;
  paddingAbsolute(): RangeAccessor<R, number>;
  paddingAbsolute(paddingAbsoluteAccessor: RangeAccessor<R, number>): HilbertChart<R>;
  valFormatter(): NumFormatter;
  valFormatter(formatter: NumFormatter): HilbertChart<R>;
  simplifyCurves(): boolean;
  simplifyCurves(simplifyCurves: boolean): HilbertChart<R>;
  useInstancedMeshes(): boolean;
  useInstancedMeshes(useInstancedMeshes: boolean): HilbertChart<R>;

  focusOn(pos: NumericValue, length: NumericValue, ms?: number): void;
  zoomToFit(ms?: number, padding?: number): HilbertChart<R>;

  scene(): Scene;
  camera(): Camera;
  renderer(): WebGLRenderer;
  controls(): object;
  lights(): Light[];
  lights(lights: Light[]): HilbertChart<R>;

  tooltipContent(): RangeAccessor<R, string>;
  tooltipContent(contentAccessor: RangeAccessor<R, string>): HilbertChart<R>;

  onHover(cb: (range: R | null, previousRange: R | null) => void): HilbertChart<R>;
  onClick(cb: (range: R, event: MouseEvent) => void): HilbertChart<R>;
  onBackgroundClick(cb: (event: MouseEvent) => void): HilbertChart<R>;
}

export default HilbertChart;
