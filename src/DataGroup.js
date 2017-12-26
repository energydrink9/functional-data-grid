// @flow

import { List } from 'immutable'

export default class DataGroup<T> {
  key : any;
  data : List<T>;
  aggregate : ?T;

  constructor(key : any, data : List<T>, aggregate : ?T) {
    this.key = key
    this.data = data
    this.aggregate = aggregate
  }

  filter = (filterFunction : Function) : DataGroup<T> => new DataGroup(this.key, this.data.filter(e => e instanceof DataGroup || filterFunction(e)).map(e => e instanceof DataGroup ? e.filter(filterFunction) : e).filter(e => !(e instanceof DataGroup) || e.data.size > 0), this.aggregate)
}