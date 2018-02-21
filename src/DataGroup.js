// @flow

import { List } from 'immutable'
import DataRow from './DataRow'

export default class DataGroup<K, T, A> {
  key : K;
  data : List<T>;
  aggregate : ?A;

  constructor(key : K, data : List<T>, aggregate: ?A) {
    this.key = key
    this.data = data
    this.aggregate = aggregate
  }

  filter = <G,> (filterFunction : G => boolean) : DataGroup<K, T, A> =>
    new DataGroup(
      this.key,
      this.data.filter(e => e instanceof DataGroup || filterFunction(e))
               .map(e => e instanceof DataGroup ? e.filter(filterFunction) : e)
               .filter(e => !(e instanceof DataGroup) || e.data.size > 0),
      this.aggregate
    )

  flatten = (): List<DataRow<T>> => this.flatDataGroup(this)

  flatDataGroup = <K, T, A> (dataGroup : DataGroup<K, T, A>): List<DataRow<T>> => {
    let elements = dataGroup.data.flatMap(el => el instanceof DataGroup ? this.flatDataGroup(el) : List(new DataRow(el, 'element')))
    return dataGroup.aggregate == null ? elements : elements.push(new DataRow(dataGroup.aggregate, 'aggregate', null))
  }
}