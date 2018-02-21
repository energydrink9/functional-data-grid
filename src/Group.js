// @flow

import React  from 'react'

type GroupOptionsType<K, T> = {
  groupingFunction : (T) => K,
  renderer? : (T) => React.Node,
  comparator? : (groupKey1: K, groupKey2: K) => number,
};

export default class Group<K, T> {
  groupingFunction : (T) => K;
  renderer : (T) => React.Node = v => v;
  comparator : (groupKey1: K, groupKey2: K) => number = (a: K, b: K) => a === b ? 0 : (a: any) < (b: any) ? -1 : 1;

  constructor(options : GroupOptionsType<K, T>) {
    this.groupingFunction = options.groupingFunction
    if (options.renderer != null)
      this.renderer = options.renderer
    if (options.comparator != null)
      this.comparator = options.comparator
  }
}