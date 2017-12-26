// @flow

type GroupOptionsType = {
  groupingFunction : Function,
  renderer? : Function,
  comparator? : Function,
  aggregatesCalculator? : ?Function
};

export default class Group {
  groupingFunction : Function;
  renderer : Function = v => v;
  aggregatesCalculator : ?Function;
  comparator : Function = (a, b) => a.key === b.key ? 0 : a.key < b.key ? -1 : 1;

  constructor(options : GroupOptionsType) {
    this.groupingFunction = options.groupingFunction
    if (options.renderer != null)
      this.renderer = options.renderer
    if (options.aggregatesCalculator != null)
      this.aggregatesCalculator = options.aggregatesCalculator
    if (options.comparator != null)
      this.comparator = options.comparator
  }
}