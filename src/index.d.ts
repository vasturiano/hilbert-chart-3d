type Accessor<In, Out> = Out | string | ((obj: In) => Out);
type NumericValue = number | bigint;

export interface Range {
  start: NumericValue;
  length: NumericValue;
  [key: string]: any;
}

type RangeBounds = Pick<Range, 'start' | 'length'>;
type RangeAccessor<R extends RangeBounds, T> = Accessor<R, T>;
type NumFormatter = (num: NumericValue) => string;

declare class HilbertChart<R extends RangeBounds = Range> {
  constructor(element: HTMLElement);

  width(): number;
  width(width: number): HilbertChart<R>;
  height(): number;
  height(width: number): HilbertChart<R>;

  hilbertOrder(): number;
  hilbertOrder(height: number): HilbertChart<R>;

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

  focusOn(pos: NumericValue, length: NumericValue, ms?: number): HilbertChart<R>;

  tooltipContent(): RangeAccessor<R, string>;
  tooltipContent(contentAccessor: RangeAccessor<R, string>): HilbertChart<R>;

  onHover(cb: (range: R | null) => void): HilbertChart<R>;
  onClick(cb: (range: R) => void): HilbertChart<R>;
  onBackgroundClick(cb: () => void): HilbertChart<R>;
}

export default HilbertChart;
