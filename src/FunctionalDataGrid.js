// @flow

import React from 'react'
import Column from './Column'
import ColumnGroup from './ColumnGroup'
import { List, Map } from 'immutable'
import Filter from './Filter'
import Sort from './Sort'
import Group from "./Group"
import DataRow from './DataRow'
import debounce from 'debounce'
import type { FunctionalDataGridStyle } from './FunctionalDataGridStyle'
import PresentationalFunctionalDataGrid from './PresentationalFunctionalDataGrid'
import Engine from './Engine'

const debounceTimeout = 250
const defaultInitialColumnWidth = 100
const defaultRowHeight = 26

type FunctionalDataGridProps<T, A> = {
  columns: Array<Column> | List<Column>,
  columnGroups: Array<ColumnGroup> | List<ColumnGroup>,
  initialFilter : Array<Filter> | List<Filter>,
  initialSort : Array<Sort> | List<Sort>,
  groups : Array<Group<any, T>> | List<Group<any, T>>,
  data : Array<T> | List<T>,
  style : FunctionalDataGridStyle<T>,
  aggregatesCalculator: ?((Array<T>, any) => A),
  showGroupHeaders: boolean,
  rowHeight: number | ((T) => number),
  includeFilteredElementsInAggregates: boolean,
  onColumnResize: (Object) => void,
  onColumnsOrderChange: (Object) => void,
  onColumnVisibilityChange: (Object) => void,
  onRowClick: (Object) => void,
  showFooter: boolean,
  className: 'string',
  overscanRowCount: number,
  sortableColumns: boolean,
  enableColumnsSorting: boolean,
  enableColumnsShowAndHide: boolean,
  height: string
}
type FunctionalDataGridState<T> = {
  cachedElements : List<DataRow<T>>,
  sort : List<Sort>,
  filter : List<Filter>,
  columnsWidth : Map<string, number>,
  columnsVisibility: Map<string, boolean>,
  columnsOrder: List<string>,
  keysMap: Map<Object, string>
}

export default class FunctionalDataGrid<T, A: void> extends React.PureComponent<FunctionalDataGridProps<T, A>, FunctionalDataGridState<T>> {

  grid: ?PresentationalFunctionalDataGrid<T, A>

  debouncedUpdateElements = debounce((data : List<T>, groups : List<Group<any, T>>, sort : List<Sort>, filter : List<Filter>, keysMap: Map<Object, string>) => this.updateElements(data, groups, sort, filter, keysMap), debounceTimeout);

  static defaultProps = {
    columnGroups: List(),
    initialFilter : List(),
    initialSort : List(),
    groups : List(),
    style : {},
    aggregatesCalculator: null,
    showGroupHeaders: true,
    rowHeight: defaultRowHeight,
    includeFilteredElementsInAggregates: false,
    showFooter: true,
    className: '',
    overscanRowCount: 10,
    enableColumnsSorting: false,
    enableColumnsShowAndHide: false,
    onColumnResize: (e: Object) => {},
    onColumnsOrderChange: (e: Object) => {},
    onColumnVisibilityChange: (e: Object) => {},
    onRowClick: (e: Object) => {},
    height: '500px'
  }

  constructor(props : FunctionalDataGridProps<T, A>) {
    super(props)

    let elements = this.computeElements(this.getData(), this.getGroups(), this.getInitialSort(), this.getInitialFilter(), Map())
    let keysMap = this.computeKeysMap(elements)

    this.state = {
      cachedElements : elements,
      sort : this.getInitialSort(),
      filter : this.getInitialFilter(),
      columnsWidth : this.getInitialColumnsWidth(this.getColumns()),
      columnsVisibility: this.getInitialColumnsVisibility(this.getColumns()),
      columnsOrder: this.getColumns().map(c => c.id),
      keysMap: keysMap
    }
  }

  getData = () => this.wrapInImmutableList(this.props.data)
  getColumns = () => this.wrapInImmutableList(this.props.columns)
  getColumnGroups = () => this.wrapInImmutableList(this.props.columnGroups)
  getInitialSort = () => this.wrapInImmutableList(this.props.initialSort)
  getInitialFilter = () => this.wrapInImmutableList(this.props.initialFilter)
  getGroups = () => this.wrapInImmutableList(this.props.groups)

  wrapInImmutableList = <T,> (element: Array<T> | List<T>) => element instanceof List ? element : List(element)

  componentDidUpdate = (prevProps: any) => {
    if (prevProps.data !== this.props.data || prevProps.columns !== this.props.columns)
      this.doUpdateElements()
  }

  doUpdateElements = () => this.debouncedUpdateElements(this.getData(), this.getGroups(), this.state.sort, this.state.filter, this.state.keysMap)

  render = () => <PresentationalFunctionalDataGrid
    ref={ref => this.grid = ref}
    columns={this.getColumns()}
    columnGroups={this.getColumnGroups()}
    elements={this.state.cachedElements}
    style={this.props.style}
    showGroupHeaders={this.props.showGroupHeaders}
    rowHeight={this.props.rowHeight}
    showFooter={this.props.showFooter}
    className={this.props.className}
    overscanRowCount={this.props.overscanRowCount}
    enableColumnsSorting={this.props.enableColumnsSorting}
    enableColumnsShowAndHide={this.props.enableColumnsShowAndHide}
    sort={this.state.sort}
    groups={this.getGroups()}
    columnsWidth={this.state.columnsWidth}
    columnsVisibility={this.state.columnsVisibility}
    columnsOrder={this.state.columnsOrder}
    onUpdateSort={this.updateSortState}
    onUpdateFilter={this.updateFilterState}
    onColumnResize={this.resizeColumn}
    onColumnsOrderChange={this.onColumnsOrderChange}
    onColumnVisibilityChange={this.updateColumnVisibility}
    onRowClick={this.props.onRowClick}
    height={this.props.height}
  />

  getOrderedColumns = () => this.state.columnsOrder.map(columnId => this.getColumns().find(c => c.id === columnId))

  updateElements = (data : List<T>, groups : List<Group<any, T>>, sort : List<Sort>, filter : List<Filter>, keysMap: Map<Object, string>) => {
    let elements = this.computeElements(data, groups, sort, filter, keysMap)
    this.setState({
      cachedElements: elements,
      keysMap: this.computeKeysMap(elements)
    })
  }

  computeKeysMap = (elements: List<DataRow<T>>) => Map(elements.filter(e => e.type === 'element').map(e => [e.content, e.key]))

  computeElements = (data : List<T>, groups : List<Group<any, T>>, sort : List<Sort>, filter : List<Filter>, keysMap: Map<Object, string>) =>
    Engine.computeElements(data, groups, sort, filter, this.getColumns(), this.props.showGroupHeaders, this.props.includeFilteredElementsInAggregates, this.props.aggregatesCalculator, keysMap)

  getElement = (index : number) => this.getElements().get(index)

  getElements = () => this.state.cachedElements

  updateSortState = (columnId : string, direction : 'asc' | 'desc' | 'none') => {

    this.setState({
      'sort' : this.updateSort(this.state.sort, columnId, direction)
    }, () => {
      this.doUpdateElements()
    })
  }

  updateFilterState = (columnId : string, matcher : Function) => {

    this.setState({
      'filter' : this.updateFilter(this.state.filter, columnId, matcher)
    }, () => {
      this.doUpdateElements()
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
      columnsWidth: this.state.columnsWidth.set(columnId, width)
    })
    this.props.onColumnResize({id: columnId, width: width})
  }

  onColumnsOrderChange = (columnsOrder: List<string>) => {
    this.setState({
      columnsOrder
    })
    this.props.onColumnsOrderChange({columnsOrder})
  }

  getInitialColumnsWidth = (columns : List<Column | ColumnGroup>) => columns.groupBy(c => c.id).map(v => v.get(0).width != null ? v.get(0).width : defaultInitialColumnWidth)

  getInitialColumnsVisibility = (columns : List<Column | ColumnGroup>) => columns.groupBy(c => c.id).map(v => v.get(0).hidden != null ? ! v.get(0).hidden : true)

  updateColumnVisibility = (columnId: string, columnVisibility: boolean) => {
    this.setState({
      columnsVisibility: this.state.columnsVisibility.set(columnId, columnVisibility)
    })
    this.props.onColumnVisibilityChange({id: columnId, visible: columnVisibility})
  }

  recomputeRowHeights = () => { 
    if (this.grid != null)
      this.grid.recomputeRowHeights()
  }
}
