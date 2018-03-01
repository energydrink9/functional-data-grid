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

  flatten = (buildHeader: boolean): List<DataRow<T>> => this.flatDataGroup(this, buildHeader)

  flatDataGroup = <K, T, A> (dataGroup : DataGroup<K, T, A>, buildHeader: boolean): List<DataRow<any>> => {
    let elements = dataGroup.data.flatMap(el => el instanceof DataGroup ? this.flatDataGroup(el, buildHeader) : List([el]))
    return this.appendAggregate(this.prependHeader(dataGroup.key, elements, buildHeader), dataGroup.aggregate)
  }

  prependHeader = <K, T> (key : K, elements: List<DataRow<T>>, buildHeader: boolean) => {
    return buildHeader ? elements.unshift(new DataRow(key, 'group-header', null)) : elements;
  }

  appendAggregate = <T, A> (elements: List<DataRow<T | A>>, aggregate: ?A) => aggregate == null ? elements : elements.push(new DataRow(aggregate, 'aggregate', null))
}
