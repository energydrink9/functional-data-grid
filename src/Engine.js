// @flow

import { List } from 'immutable'
import DataRow from './DataRow'
import DataGroup from './DataGroup'
import Sort from './Sort'
import ColumnGroup from './ColumnGroup'
import BaseColumn from './BaseColumn'
import Group from './Group'
import Filter from './Filter'
import Aggregate from './Aggregate'

export default class Engine<T, A: void> {

  static computeElements = <A,> (data : List<T>, groups : List<Group<any, T>>, sort : List<Sort>, filter : List<Filter>, columns: List<BaseColumn | ColumnGroup>, showGroupHeaders: boolean, includeFilteredElementsInAggregates: boolean, aggregatesCalculator: ?((Array<T>, any) => A)) : List<DataRow<any>> =>
    Engine.filterGroups(
      Engine.groupData(
        Engine.sortData(
          Engine.filterData(
            Engine.enrichData(data),
            filter,
            groups,
            includeFilteredElementsInAggregates,
            columns
          ),
          sort,
          columns
        ),
        groups,
        List(),
        aggregatesCalculator
      ),
      filter,
      groups,
      includeFilteredElementsInAggregates,
      columns
    ).flatMap(e => Engine.flatGroups(e, showGroupHeaders))

  static flatGroups = (e: List<DataRow<T> | DataGroup<any, any, A>>, showGroupHeaders: boolean) => e instanceof DataGroup
          ? e.flatten(showGroupHeaders)
          : List([e])

  static sortData = (data : List<DataRow<T>>, sort : List<Sort>, columns: List<ColumnGroup | BaseColumn>): List<DataRow<T>> => sort
    .reverse()
    .reduce((data: List<DataRow<T>>, s: Sort) =>
      Engine.applySort(data, s, columns), data)

  static applySort = (data : List<DataRow<T>>, sort : Sort, columns: List<ColumnGroup | BaseColumn>): List<DataRow<T>> => {
    let column = Engine.getColumnById(Engine.flatColumns(columns), sort.columnId)
    return data.sortBy((e: DataRow<T>) => column.valueGetter(e.content), (a, b) => (sort.direction === 'asc' ? 1 : -1) * column.comparator(a, b))
  }

  static getColumnById = (columns: List<BaseColumn>, columnId: string) => {
    let column = columns.find(c => c.id === columnId)
    if (column == null)
      throw new Error('Invalid column id')
    return column
  }

  static enrichData = (data : List<T>) : List<DataRow<T>> => data.map((e, index) => new DataRow(e, 'element', index))

  static groupData = <K, A> (data : List<DataRow<T>>, groups : List<Group<any, T>>, currentSubGroup: List<[string, any]> = List(), aggregatesCalculator: ?((Array<any>, any) => A)): (List<DataRow<T> | DataGroup<any, any, A>>) => groups.isEmpty()
    ? data
    : Engine.groupDataByGroup(data, groups.first(), currentSubGroup, aggregatesCalculator)
          .map((e : DataGroup<K, T, A>) => new DataGroup(e.key, Engine.groupData(e.data, groups.shift(), currentSubGroup.push([groups.first().id, ((e.key): any)[groups.first().id]]), aggregatesCalculator), e.aggregate))

  static groupDataByGroup = <K, A> (data : (List<DataRow<T>>), group : Group<K, T>, subGroup: List<[string, any]>, aggregatesCalculator: ?((Array<any>, any) => A)) : List<DataGroup<K, DataRow<T>, A>> =>
    data.groupBy((e: DataRow<T>) => group.groupingFunction(e.content))
        .map((g: List<T>, key: K) => Engine.createDataGroup(g, group.id, key, subGroup.push([group.id, key]), aggregatesCalculator))
        .toList()
        .sort((dg1, dg2) => group.comparator(dg1.key, dg2.key, dg1.aggregate, dg2.aggregate))

  static createDataGroup = <K, A> (data: List<T>, groupId: string, key : K, subGroup: List<[string, any]>, aggregatesCalculator: ?((Array<T>, any) => A)): DataGroup<any, T, Aggregate<any>> => aggregatesCalculator != null
    ? new DataGroup(Engine.getGroupKey(subGroup), data, Engine.createAggregate(Engine.getGroupKey(subGroup), data.map(e => e.content), aggregatesCalculator))
    : new DataGroup(Engine.getGroupKey(subGroup), data)

  static createAggregate = <K, A> (groupKey: any, data: List<T>, aggregatesCalculator: ?((Array<any>, any) => A)) : Aggregate<A> => {
    if (aggregatesCalculator == null)
      throw new Error('Aggregates calculator not specified.')
    return new Aggregate(groupKey, aggregatesCalculator((data.toArray()), groupKey))
  }

  static getGroupKey = (subGroup: List<[string, any]>) => {
    let groupKey: Object = {}
    subGroup.forEach((g: [string, any]) => groupKey[g[0]] = g[1])
    return groupKey
  }

  static filterElementsBeforeGrouping = (groups: List<Group<>>, includeFilteredElementsInAggregates: boolean) => groups.isEmpty() || ! includeFilteredElementsInAggregates

  static filterData = (data : List<DataRow<T>>, filters : List<Filter>, groups: List<Group<>>, includeFilteredElementsInAggregates: boolean, columns : List<BaseColumn | ColumnGroup>) => Engine.filterElementsBeforeGrouping(groups, includeFilteredElementsInAggregates) ? data.filter(e => Engine.applyFiltersToElement(e, filters, columns)) : data

  static filterGroups = (data : List<DataRow<T> | DataGroup<DataRow<T>>>, filters : List<Filter>, groups: List<Group<>>, includeFilteredElementsInAggregates: boolean, columns : List<BaseColumn | ColumnGroup>) => Engine.filterElementsBeforeGrouping(groups, includeFilteredElementsInAggregates) ? data : data
    .map(e => e instanceof DataGroup ? Engine.filterDataGroup(e, filters, columns) : e)          // filter data group
    .filter(e => !(e instanceof DataGroup) || e.data.size > 0)                        // remove empty data groups

  static filterDataGroup = <K, G> (dataGroup : DataGroup<K, G, A>, filters : List<Filter>, columns : List<BaseColumn | ColumnGroup>) : DataGroup<K, T, A> =>
    new DataGroup(
      dataGroup.key,
      dataGroup.data.filter(e => e instanceof DataGroup || Engine.applyFiltersToElement(e, filters, columns))
               .map(e => e instanceof DataGroup ? Engine.filterDataGroup(e, filters) : e)
               .filter(e => !(e instanceof DataGroup) || e.data.size > 0),
      dataGroup.aggregate
    )

  static applyFiltersToElement = <T,> (e: DataRow<T>, filters : List<Filter>, columns : List<BaseColumn | ColumnGroup>): boolean => filters.reduce((a: boolean, f: Filter) => a && Engine.applyFilterToElement(e, f, columns), true)

  static applyFilterToElement = <T,> (e : DataRow<T>, filter : Filter, columns : List<BaseColumn | ColumnGroup>) : boolean => filter.matcher(Engine.getColumnById(columns, filter.columnId).valueGetter(e.content))

  static flatColumns = (columns : List<BaseColumn | ColumnGroup>) => columns.flatMap(c => c instanceof ColumnGroup ? c.columns : [c])
}