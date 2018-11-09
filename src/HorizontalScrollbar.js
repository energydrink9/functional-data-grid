// @flow

import React from 'react'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import Column from "./Column"

type HorizontalScrollbarProps = {
  columns: List<Column | ColumnGroup>,
  scrollLeft: number,
  onScroll: Function,
  columnsWidth : Map<string, number>,
  columnsVisibility: Map<string, boolean>,
  enableColumnsMenu: boolean
}

export default class HorizontalScrollbar extends React.PureComponent<HorizontalScrollbarProps> {

  scrollingDiv : any

  constructor(props : HorizontalScrollbarProps) {
    super(props)
  }

  componentDidMount = () => {
    this.updateScroll()
  }

  componentDidUpdate = (prevProps: HorizontalScrollbarProps) => {
    if (this.props.scrollLeft !== this.scrollingDiv.scrollLeft)
      this.updateScroll()
  }

  updateScroll = () => {
    this.scrollingDiv.scrollLeft = this.props.scrollLeft // eslint-disable-line
  }

  triggerOnScroll = (event : Object) => {
    let scrollEvent = {
      scrollLeft: event.target.scrollLeft
    }
    if (this.props.onScroll != null)
      this.props.onScroll(scrollEvent)
  }

  render = () => {
    let style = { display: 'flex', flexGrow: 0, width: '100%', backgroundColor: 'transparent', position: 'relative', borderBottom: 'solid 1px #ccc' }

    let firstUnlockedColumnIndex = this.props.columns.findIndex((c) => ! c.locked)

    return <div className='functional-data-grid__horizontal-scrollbar' style={{...style}}>
      <div style={{display: 'flex'}}>
        { this.renderColumns(this.props.columns.filter((c, index) => c.locked && index < firstUnlockedColumnIndex)) }
      </div>
      <div style={{display: 'flex', overflow: 'auto', flexGrow: 1}} ref={(el) => this.scrollingDiv = el} onScroll={this.triggerOnScroll}>
        { this.renderColumns(this.props.columns.filter(c => ! c.locked)) }
      </div>
      <div style={{display: 'flex'}}>
        { this.renderColumns(this.props.columns.filter((c, index) => c.locked && index >= firstUnlockedColumnIndex)) }
      </div>
      { this.props.enableColumnsMenu && <div style={{ width: '26px' }}></div> }
    </div>
  }

  renderColumns = (columns : List<Column | ColumnGroup>) => columns
    .map((c, index) => c instanceof ColumnGroup ? this.renderColumnGroup(c, index) : (this.isColumnVisible(c.id) && this.renderColumn(c)))

  renderColumnGroup = (cg : ColumnGroup, index : number) => <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex' }}>
      { cg.columns.filter(c => this.isColumnVisible(c.id)).map(c => this.renderColumn(c)) }
    </div>
  </div>

  getColumnWidth = (c : Column) : number => {
    let columnWidth = this.props.columnsWidth.get(c.id)
    return columnWidth != null
      ? columnWidth
      : c.width != null
        ? c.width
        : 100
  }

  renderColumn = (c : Column) => <div key={c.id} style={{width: `${this.getColumnWidth(c)}px`, flexShrink: 0, minHeight: '1px'}} />

  isColumnVisible = (columnId: string) => this.props.columnsVisibility.get(columnId)

}