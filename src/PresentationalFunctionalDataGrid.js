// @flow

import React from 'react'
import BaseColumn from './BaseColumn'
import ColumnGroup from './ColumnGroup'
import { List, Map } from 'immutable'
import Sort from './Sort'
import Header from './Header'
import Row from './Row'
import { ScrollSync, AutoSizer, List as ReactVirtualizedList } from 'react-virtualized'
import Group from "./Group"
import DataRow from './DataRow'
import Footer from './Footer'
import HorizontalScrollbar from './HorizontalScrollbar'
import type { FunctionalDataGridStyle } from './FunctionalDataGridStyle'

type PresentationalFunctionalDataGridProps<T, A> = {
  columns: List<BaseColumn | ColumnGroup>,
  elements: List<DataRow<T>>,
  style : FunctionalDataGridStyle,
  showGroupHeaders: boolean,
  rowHeight: number | ((T) => number),
  showFooter: boolean,
  className: string,
  overscanRowCount: number,
  enableColumnsSorting: boolean,
  enableColumnsShowAndHide: boolean,
  sort: List<Sort>,
  groups : List<Group<any, T>>,
  columnsWidth : Map<string, number>,
  columnsVisibility: Map<string, boolean>,
  columnsOrder: List<string>,
  onUpdateSort: (string, 'asc' | 'desc' | 'none') => void,
  onUpdateFilter: (string, Function) => void,
  onColumnResize: (string, number) => void,
  onColumnsOrderChange: (List<string>) => void,
  onColumnVisibilityChange: (string, boolean) => void
}
type PresentationalFunctionalDataGridState<T> = {
  ref: ?HTMLElement
}

const emptyObject = {}
export default class PresentationalFunctionalDataGrid<T, A: void> extends React.PureComponent<PresentationalFunctionalDataGridProps<T, A>, PresentationalFunctionalDataGridState<T>> {

  props: PresentationalFunctionalDataGridProps<T, A>
  state : PresentationalFunctionalDataGridState<T>
  list : ReactVirtualizedList

  static defaultProps = {
    showGroupHeaders: true,
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

  constructor(props : PresentationalFunctionalDataGridProps<T, A>) {
    super(props)
    this.state = {
      ref: null
    }
  }

  componentDidUpdate(prevProps: PresentationalFunctionalDataGridProps<T, A>) {
    if (this.props.elements !== prevProps.elements)
      this.recomputeRowHeights()
  }

  render = () => {
    let style = {display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box', border: 'solid 1px #ccc'}
    return <div ref={ref => this.setState({ ref: ref })} className={`functional-data-grid ${this.props.className}`} style={{...style, ...(this.props.style.grid != null ? this.props.style.grid : {})}}>
      <ScrollSync>
        {({clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => (
          <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Header columns={this.getOrderedColumns()} columnsVisibility={this.props.columnsVisibility} columnsWidth={this.props.columnsWidth} scrollLeft={scrollLeft} onScroll={onScroll} style={this.props.style.header != null ? this.props.style.header : {}} sort={this.props.sort} onUpdateSort={this.props.onUpdateSort} onUpdateFilter={this.props.onUpdateFilter} onColumnResize={this.props.onColumnResize} enableColumnsShowAndHide={this.props.enableColumnsShowAndHide} enableColumnsSorting={this.props.enableColumnsSorting} onColumnVisibilityChange={this.props.onColumnVisibilityChange} onColumnsOrderChange={this.props.onColumnsOrderChange} columnsOrder={this.props.columnsOrder} popperContainer={this.state.ref} />
            <div style={{flexGrow: 1}}>
              <AutoSizer>
                {({height, width}) => (
                    <ReactVirtualizedList
                      rowCount={this.getTotalCount()}
                      height={height}
                      width={width}
                      rowHeight={this.getRowHeight()}
                      rowRenderer={this.rowRenderer(scrollLeft, onScroll)}
                      ref={(list) => { this.list = list }}
                      style={{backgroundColor: '#fff', outline: 'none'}}
                      overscanRowCount={this.props.overscanRowCount} >
                    </ReactVirtualizedList>
                )}
              </AutoSizer>
            </div>
            <HorizontalScrollbar enableColumnsMenu={this.props.enableColumnsShowAndHide || this.props.enableColumnsSorting} columnsVisibility={this.props.columnsVisibility} columns={this.getOrderedColumns()} columnsWidth={this.props.columnsWidth} scrollLeft={scrollLeft} onScroll={onScroll} />
            { this.props.showFooter && <Footer style={this.props.style.footer != null ? this.props.style.footer : {}} totalElements={this.getElements().filter(r => r.type === 'element').size} /> }
          </div>
        )}
      </ScrollSync>
    </div>
  }

  getRowHeight = () => {
    let rowHeight = this.props.rowHeight
    return rowHeight instanceof Function
    ? (args: Object) => {
      let element = this.getElement(args.index)
      return rowHeight(element.content, element.originalIndex, element.type)
    }
    : rowHeight
  }

  static flatColumns = (columns : List<BaseColumn | ColumnGroup>) => columns.flatMap(c => c instanceof ColumnGroup ? c.columns : [c])

  getOrderedColumns = () => this.props.columnsOrder.map(columnId => this.props.columns.find(c => c.id === columnId)).filter(e => e != null)

  rowRenderer = (scrollLeft : number, onScroll : Function) => (param: { key: number, index: number, style: Object }) => {
    let element = this.getElement(param.index)
    let rowStyle = this.props.style.row != null ? this.props.style.row : emptyObject
    let computedStyle = {...param.style, ...rowStyle}
    return <Row
      key={param.index}
      style={computedStyle}
      cellStyle={this.props.style.cell != null ? this.props.style.cell : emptyObject}
      aggregateStyle={this.props.style.aggregate != null ? this.props.style.aggregate : emptyObject}
      groupStyle={this.props.style.group != null ? this.props.style.group : emptyObject}
      groups={this.props.groups}
      columns={PresentationalFunctionalDataGrid.flatColumns(this.getOrderedColumns())}
      columnsWidth={this.props.columnsWidth}
      columnsVisibility={this.props.columnsVisibility}
      element={element}
      onScroll={onScroll}
      scrollLeft={scrollLeft}
      rowIndex={param.index}
      enableColumnsMenu={this.props.enableColumnsShowAndHide || this.props.enableColumnsSorting}
    />
  }

  recomputeRowHeights = () => {
    if (this.list != null)
      this.list.recomputeRowHeights()
  }

  getElement = (index : number) => this.getElements().get(index)

  getElements = () => this.props.elements

  getTotalCount = () => this.getElements().size
}
