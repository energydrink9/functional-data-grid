// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import Column from './Column'
import ColumnGroup from './ColumnGroup'
import ColumnsMenu from './ColumnsMenu'
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
import { Manager, Reference, Popper } from 'react-popper'

type PresentationalFunctionalDataGridProps<T, A> = {
  columns: List<Column>,
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
  onColumnVisibilityChange: (string, boolean) => void,
  onRowClick: (Object) => void,
  height: string,
  columnGroups: List<ColumnGroup>
}

type PresentationalFunctionalDataGridState<T> = {
  ref: ?HTMLElement,
  showColumnsMenu: boolean
}

const emptyObject = {}
export default class PresentationalFunctionalDataGrid<T, A: void> extends React.PureComponent<PresentationalFunctionalDataGridProps<T, A>, PresentationalFunctionalDataGridState<T>> {

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
    onColumnVisibilityChange: (e: Object) => {},
    onRowClick: (e: Object) => {},
    height: '100%'
  }

  constructor(props : PresentationalFunctionalDataGridProps<T, A>) {
    super(props)
    this.state = {
      ref: null,
      showColumnsMenu: false
    }
  }

  componentDidUpdate(prevProps: PresentationalFunctionalDataGridProps<T, A>) {
    if (this.props.elements !== prevProps.elements)
      this.recomputeRowHeights()
  }

  render = () => {
    let style = {display: 'flex', flexGrow: 1, flexDirection: 'column', height: this.props.height, boxSizing: 'border-box', border: 'solid 1px #ccc'}
    return <div ref={ref => this.setState({ ref })} className={`functional-data-grid ${this.props.className}`} style={{...style, ...(this.props.style.grid != null ? this.props.style.grid : {})}}>
      <ScrollSync>
        {({clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => (
          <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
            <Header
              leftLockedColumns={this.getSortedColumns(this.getLeftLockedColumns()).filter(c => this.isColumnVisible(c.id))}
              freeColumns={this.getSortedColumns(this.getFreeColumns()).filter(c => this.isColumnVisible(c.id))}
              rightLockedColumns={this.getSortedColumns(this.getRightLockedColumns()).filter(c => this.isColumnVisible(c.id))}
              columnsWidth={this.props.columnsWidth}
              scrollLeft={scrollLeft}
              onScroll={onScroll}
              style={this.props.style.header != null ? this.props.style.header : {}}
              sort={this.props.sort}
              onUpdateSort={this.props.onUpdateSort}
              onUpdateFilter={this.props.onUpdateFilter}
              onColumnResize={this.props.onColumnResize}
              enableColumnsShowAndHide={this.props.enableColumnsShowAndHide}
              enableColumnsSorting={this.props.enableColumnsSorting}
              columnsMenu={(this.props.enableColumnsShowAndHide || this.props.enableColumnsSorting)
                ? this.getColumnsMenu()
                : <div style={{ flexShrink: 0, width: '26px' }}></div>}
              columnGroups={this.props.columnGroups}
            />
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
            <HorizontalScrollbar
              columnsVisibility={this.props.columnsVisibility}
              leftLockedColumnsWidth={this.getColumnsWidth(this.getLeftLockedColumns().filter(c => this.isColumnVisible(c.id)))}
              freeColumnsWidth={this.getColumnsWidth(this.getFreeColumns().filter(c => this.isColumnVisible(c.id)))}
              rightLockedColumnsWidth={this.getColumnsWidth(this.getRightLockedColumns().filter(c => this.isColumnVisible(c.id)))}
              columnsWidth={this.props.columnsWidth}
              scrollLeft={scrollLeft}
              onScroll={onScroll}
            />
            { this.props.showFooter && <Footer style={this.props.style.footer != null ? this.props.style.footer : {}} totalElements={this.getElements().filter(r => r.type === 'element').size} /> }
          </div>
        )}
      </ScrollSync>
    </div>
  }

  getColumnsWidth = (columns: List<Column>) => columns.reduce((accumulator: number, c: Column) => accumulator + this.getColumnWidth(c), 0)

  getColumnWidth = (c : Column) => this.props.columnsWidth.get(c.id) != null ? this.props.columnsWidth.get(c.id) : c.width
  
  getRowHeight = () => {
    let rowHeight = this.props.rowHeight
    return rowHeight instanceof Function
    ? (args: Object) => {
      let element = this.getElement(args.index)
      return rowHeight(element.content, element.originalIndex, element.type)
    }
    : rowHeight
  }

  isColumnVisible = (columnId: string) => this.props.columnsVisibility.get(columnId)

  getFirstFreeColumnIndex = (columns: List<Column>) => columns.findIndex((c) => ! c.locked)

  getLeftLockedColumns = () => this.props.columns.filter((c, index) => c.locked && (this.getFirstFreeColumnIndex(this.props.columns) === -1 || index < this.getFirstFreeColumnIndex(this.props.columns)))
  getFreeColumns = () => this.props.columns.filter(c => ! c.locked)
  getRightLockedColumns = () => this.props.columns.filter((c, index) => c.locked && this.getFirstFreeColumnIndex(this.props.columns) !== -1 && index >= this.getFirstFreeColumnIndex(this.props.columns))

  getSortedColumns = (columns: List<Column>) => this.props.columnsOrder.map(columnId => columns.find(c => c.id === columnId)).filter(e => e != null)

  rowRenderer = (scrollLeft : number, onScroll : Function) => (param: { key: number, index: number, style: Object }) => {
    let element = this.getElement(param.index)
    let rowStyle = this.props.style.row != null ? this.props.style.row : emptyObject
    let computedStyle = {...param.style, ...rowStyle}
    return <Row
      key={element.key}
      style={computedStyle}
      cellStyle={this.props.style.cell != null ? this.props.style.cell : emptyObject}
      aggregateStyle={this.props.style.aggregate != null ? this.props.style.aggregate : emptyObject}
      groupStyle={this.props.style.group != null ? this.props.style.group : emptyObject}
      groups={this.props.groups}
      leftLockedColumns={this.getSortedColumns(this.getLeftLockedColumns()).filter(c => this.isColumnVisible(c.id))}
      freeColumns={this.getSortedColumns(this.getFreeColumns()).filter(c => this.isColumnVisible(c.id))}
      rightLockedColumns={this.getSortedColumns(this.getRightLockedColumns()).filter(c => this.isColumnVisible(c.id))}
      columnsWidth={this.props.columnsWidth}
      element={element}
      onScroll={onScroll}
      scrollLeft={scrollLeft}
      rowIndex={param.index}
      onClick={(e: Object) => { this.props.onRowClick({
        row: element
      })}}
    />
  }

  getPopperContainer = () => this.state.ref != null ? this.state.ref : document.body

  toggleColumnsMenu = () => {
    this.setState({
      showColumnsMenu: ! this.state.showColumnsMenu
    })
  }

  getColumnsMenu = () => <Manager>
    <Reference>
      {({ ref }) => (
        <div ref={ref} style={{ padding: '5px', cursor: 'pointer', userSelect: 'none', fontSize: '16px' }} onClick={this.toggleColumnsMenu}>&#x22ee;</div>
      )}
    </Reference>
    { this.state.showColumnsMenu && this.renderColumnsMenuPopper(this.getPopperContainer()) }
  </Manager>

  renderColumnsMenuPopper = (popperContainer: ?HTMLElement) => popperContainer != null && ReactDOM.createPortal(
    <Popper placement={'bottom-end'} modifiers={{ preventOverflow: { enabled: false }, hide: { enabled: false }, flip: { enabled: false } }}>
      {({ placement, ref, style }) => (
        <div ref={ref} style={style} data-placement={placement} className={'functional-data-grid__columns-visibility-menu'}>
          <ColumnsMenu
            leftLockedColumns={this.getSortedColumns(this.getLeftLockedColumns())}
            freeColumns={this.getSortedColumns(this.getFreeColumns())}
            rightLockedColumns={this.getSortedColumns(this.getRightLockedColumns())}
            columnGroups={this.props.columnGroups}
            enableColumnsShowAndHide={this.props.enableColumnsShowAndHide}
            enableColumnsSorting={this.props.enableColumnsSorting}
            columnsVisibility={this.props.columnsVisibility}
            onColumnVisibilityChange={this.props.onColumnVisibilityChange}
            onClose={this.toggleColumnsMenu}
            onColumnsOrderChange={this.props.onColumnsOrderChange}
            columnsOrder={this.props.columnsOrder}
          />
        </div>
      )}
    </Popper>,
    popperContainer
  )

  recomputeRowHeights = () => {
    if (this.list != null)
      this.list.recomputeRowHeights()
  }

  getElement = (index : number) => this.getElements().get(index)

  getElements = () => this.props.elements

  getTotalCount = () => this.getElements().size
}
