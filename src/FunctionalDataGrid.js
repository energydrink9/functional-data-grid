// @flow

import React from 'react'
import BaseColumn from './BaseColumn'
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
  columns: List<BaseColumn | ColumnGroup>,
  initialFilter : List<Filter>,
  initialSort : List<Sort>,
  groups : List<Group<any, T>>,
  data : List<T>,
  style : FunctionalDataGridStyle,
  aggregatesCalculator: ?((List<T>, any) => A),
  showGroupHeaders: boolean,
  rowHeight: number | ((T) => number),
  includeFilteredElementsInAggregates: boolean,
  onColumnResize: (Object) => void,
  onColumnsOrderChange: (Object) => void,
  onColumnVisibilityChange: (Object) => void,
  showFooter: boolean,
  className: 'string',
  overscanRowCount: number,
  sortableColumns: boolean,
  enableColumnsSorting: boolean,
  enableColumnsShowAndHide: boolean
}
type FunctionalDataGridState<T> = {
  cachedElements : List<DataRow<T>>,
  sort : List<Sort>,
  filter : List<Filter>,
  columnsWidth : Map<string, number>,
  columnsVisibility: Map<string, boolean>,
  columnsOrder: List<string>
}

export default class FunctionalDataGrid<T, A: void> extends React.PureComponent<FunctionalDataGridProps<T, A>, FunctionalDataGridState<T>> {

  debouncedUpdateElements = debounce((data : List<T>, groups : List<Group<any, T>>, sort : List<Sort>, filter : List<Filter>) => this.updateElements(data, groups, sort, filter), debounceTimeout);

  static defaultProps = {
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
    onColumnVisibilityChange: (e: Object) => {}
  }

  constructor(props : FunctionalDataGridProps<T, A>) {
    super(props)
    this.state = {
      cachedElements : this.computeElements(this.props.data, this.props.groups, this.props.initialSort, this.props.initialFilter),
      sort : this.props.initialSort,
      filter : this.props.initialFilter,
      columnsWidth : this.getInitialColumnsWidth(props.columns),
      columnsVisibility: this.getInitialColumnsVisibility(props.columns),
      columnsOrder: props.columns.map(c => c.id)
    }
  }

  componentDidUpdate = (prevProps: any) => {
    if (prevProps.data !== this.props.data || prevProps.columns !== this.props.columns)
      this.debouncedUpdateElements(this.props.data, this.props.groups, this.state.sort, this.state.filter)
  }

  render = () => <PresentationalFunctionalDataGrid
    columns={this.props.columns}
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
    groups={this.props.groups}
    columnsWidth={this.state.columnsWidth}
    columnsVisibility={this.state.columnsVisibility}
    columnsOrder={this.state.columnsOrder}
    onUpdateSort={this.updateSortState}
    onUpdateFilter={this.updateFilterState}
    onColumnResize={this.resizeColumn}
    onColumnsOrderChange={this.onColumnsOrderChange}
    onColumnVisibilityChange={this.updateColumnVisibility}
  />

  getOrderedColumns = () => this.state.columnsOrder.map(columnId => this.props.columns.find(c => c.id === columnId))

  updateElements = (data : List<T>, groups : List<Group<any, T>>, sort : List<Sort>, filter : List<Filter>) => {
    this.setState({ cachedElements: this.computeElements(data, groups, sort, filter) })
  }

  computeElements = (data : List<T>, groups : List<Group<any, T>>, sort : List<Sort>, filter : List<Filter>) =>
    Engine.computeElements(data, groups, sort, filter, this.props.columns, this.props.showGroupHeaders, this.props.includeFilteredElementsInAggregates, this.props.aggregatesCalculator)

  getElement = (index : number) => this.getElements().get(index)

  getElements = () => this.state.cachedElements

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

  getInitialColumnsWidth = (columns : List<BaseColumn | ColumnGroup>) => columns.groupBy(c => c.id).map(v => v.get(0).width != null ? v.get(0).width : defaultInitialColumnWidth)

  getInitialColumnsVisibility = (columns : List<BaseColumn | ColumnGroup>) => columns.groupBy(c => c.id).map(v => v.get(0).hidden != null ? ! v.get(0).hidden : true)

  updateColumnVisibility = (columnId: string, columnVisibility: boolean) => {
    this.setState({
      columnsVisibility: this.state.columnsVisibility.set(columnId, columnVisibility)
    })
    this.props.onColumnVisibilityChange({id: columnId, visible: columnVisibility})
  }
}
