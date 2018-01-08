// @flow

import React from 'react'
import BaseColumn from './BaseColumn'
import ColumnGroup from './ColumnGroup'
import { List, Map, OrderedMap, KeyedSeq } from 'immutable'
import Filter from './Filter'
import Sort from './Sort'
import Header from './Header'
import Row from './Row'
import { ScrollSync, AutoSizer, List as ReactVirtualizedList } from 'react-virtualized'
import Group from "./Group"
import DataGroup from "./DataGroup"
import DataRow from "./ElementRow"
import debounce from 'debounce'

const debounceTimeout = 250

type FunctionalDataGridProps = {
  columns: List<BaseColumn | ColumnGroup>,
  initialFilter : List<Filter>,
  initialSort : List<Sort>,
  groups : List<Group>,
  data : List<any>
}
type FunctionalDataGridState = {
  cachedElements : List<any>,
  sort : List<Sort>,
  filter : List<Filter>,
  columnWidths : Map<string, number>
}

export default class FunctionalDataGrid extends React.Component<FunctionalDataGridProps, FunctionalDataGridState> {
  props: FunctionalDataGridProps;
  state : FunctionalDataGridState
  list : ReactVirtualizedList;
  debouncedUpdateElements = debounce((data : List<any>, groups : List<Group>, sort : List<Sort>, filter : List<Filter>) => this.updateElements(data, groups, sort, filter), debounceTimeout);

  constructor(props : FunctionalDataGridProps) {
    super(props)
    this.state = {
      cachedElements : List(),
      sort : this.props.initialSort,
      filter : this.props.initialFilter,
      columnWidths : Map()
    }
  }

  componentWillMount = () => {
    this.updateElements(this.props.data, this.props.groups, this.state.sort, this.state.filter)
  }

  componentWillUpdate = (newProps: FunctionalDataGridProps) => {
    if (newProps.data !== this.props.data)
      this.debouncedUpdateElements(newProps.data, newProps.groups, this.state.sort, this.state.filter)
  }

  render = () => <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
    <ScrollSync>
      {({clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <Header columns={this.props.columns} columnWidths={this.state.columnWidths} scrollLeft={scrollLeft} onScroll={onScroll} sort={this.props.initialSort} onUpdateSort={this.updateSortState} onUpdateFilter={this.updateFilterState} onColumnResize={this.resizeColumn} />
          <div style={{flexGrow: 1}}>
            <AutoSizer>
              {({height, width}) => (
                  <ReactVirtualizedList
                    rowCount={this.getTotalCount()}
                    height={height}
                    width={width}
                    rowHeight={26}
                    rowRenderer={this.rowRenderer(scrollLeft, onScroll)}
                    ref={(list) => { this.list = list }}
                    style={{backgroundColor: '#fff'}}>
                  </ReactVirtualizedList>
              )}
            </AutoSizer>
          </div>
        </div>
      )}
    </ScrollSync>
  </div>

  rowRenderer = (scrollLeft : number, onScroll : Function) => (param: { key: number, index: number, style: Object }) => {
    let element = this.getElement(param.index)
    return <Row key={param.index} style={param.style} columns={this.flatColumns(this.props.columns)} columnWidths={this.state.columnWidths} element={element} onScroll={onScroll} scrollLeft={scrollLeft} rowIndex={param.index} />
  }

  updateElements = (data : List<any>, groups : List<Group>, sort : List<Sort>, filter : List<Filter>) => {
    this.setState({ cachedElements: this.computeElements(data, groups, sort, filter) })
    if (this.list != null)
      this.list.forceUpdateGrid()
  }

  computeElements = (data : List<any>, groups : List<Group>, sort : List<Sort>, filter : List<Filter>) => this.removeMetaData(this.flatGroups(this.filterGroups(this.groupData(this.sortData(this.enrichData(data), sort), groups), filter)).flatten())

  removeMetaData = (data : List<DataRow<any>>) => data.map(r => r.content)

  sortData = (data : List<any>, sort : List<Sort>) => sort.reverse().reduce((data, s) => this.applySort(data, s), data)

  applySort = (data : List<any>, sort : Sort) => {
    let column = this.getColumnById(sort.columnId)
    return data.sortBy(column.valueGetter, (a, b) => (sort.direction === 'asc' ? 1 : -1) * column.comparator(a, b))
  }

  getColumnById = (columnId : string) => {
    let column = this.flatColumns(this.props.columns).find(c => c.id === columnId)
    if (column == null)
      throw new Error('Invalid column id')
    return column
  }

  enrichData = (data : List<any>) => data.map((e, index) => { e._index = index; return e })

  getElement = (index : number) => this.getElements().get(index)

  getElements = () => this.state.cachedElements

  groupData = (data : List<any>, groups : List<Group>) => groups.isEmpty() ? data :
    this.groupDataByGroup(data, groups.first()).map((e : DataGroup<any>) => new DataGroup(e.key, this.groupData(e.data, groups.shift()), e.aggregate))

  groupDataByGroup = (data : List<any>, group : Group) => data.groupBy(group.groupingFunction).map((g, key) => this.computeAggregates(g, group, key)).toList().sort(group.comparator)

  computeAggregates = (data: List<any>, group : Group, key : any) => group.aggregatesCalculator == null ? new DataGroup(key, data) : new DataGroup(key, data, group.aggregatesCalculator(data, key))

  filterGroups = (data : List<any>, filters : List<Filter>) => data
    .filter(e => e instanceof DataGroup || this.applyFiltersToElement(e, filters))
    .map(e => e instanceof DataGroup ? this.filterDataGroup(e, filters) : e)
    .filter(e => !(e instanceof DataGroup) || e.data.size > 0)

  filterDataGroup = (dataGroup : DataGroup<any>, filters : List<Filter>) => dataGroup.filter(e => this.applyFiltersToElement(e, filters))

  applyFiltersToElement = (e : any, filters : List<Filter>) => filters.reduce((a, f) => a && this.applyFilterToElement(e, f), true)

  applyFilterToElement = (e : any, filter : Filter) => filter.matcher(this.getColumnById(filter.columnId).valueGetter(e))

  flatGroups = (data : any) => data instanceof List ? data.map(this.flatGroups) : data instanceof DataGroup ? this.flatGroups(this.flatDataGroup(data)) : data

  flatDataGroup = (e : DataGroup<any>) : List<any> => {
    let elements = e.data.map(el => el instanceof DataGroup ? el : new DataRow(el, 'element'))
    return e.aggregate == null ? elements : elements.push(new DataRow(e.aggregate, 'aggregate'))
  }

  flatColumns = (columns : List<BaseColumn | ColumnGroup>) => columns.flatMap(c => c instanceof ColumnGroup ? c.columns : [c])

  getTotalCount = () => this.getElements().size

  updateSortState = (columnId : string, direction : 'asc' | 'desc' | 'none') => {

    this.setState({
      'sort' : this.updateSort(this.state.sort, columnId, direction)
    }, () => {
      this.debouncedUpdateElements(this.props.data, this.props.groups, this.state.sort, this.state.filter)
    })
  }

  updateFilterState = (columnId : string, matcher : Function) => {

    this.setState({
      'filter' : this.updateFilter(this.state.filter, columnId, matcher)
    }, () => {
      this.debouncedUpdateElements(this.props.data, this.props.groups, this.state.sort, this.state.filter)
    })
  }

  updateFilter = (filter : List<Filter>, columnId : string, matcher : Function) => {
    let index = filter.findIndex(c => c.columnId === columnId)

    return index === -1
      ? filter.push(new Filter(columnId, matcher))
      : filter.set(index, new Filter(columnId, matcher))
  }

  updateSort = (sort : List<Sort>, columnId : string, direction : 'asc' | 'desc' | 'none') => {

    let index = sort.findIndex(c => c.columnId === columnId)

    if (index === -1) {
      if (direction === 'none')
        return sort
      else
        return sort.push(new Sort(columnId, direction))
    }
    else {
      if (direction === 'none')
        return sort.delete(index)
      else
        return sort.set(index, new Sort(columnId, direction))
    }
  }

  resizeColumn = (columnId : string, width : number) => {
    this.setState({
      columnWidths: this.state.columnWidths.set(columnId, width)
    })
  }
}
