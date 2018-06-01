// @flow

import BaseColumn from './BaseColumn'
import { List } from 'immutable'

export default class ColumnGroup {
  title : string = '';
  columns : List<BaseColumn>;
  headerRenderer : Function;
  locked: boolean = false

  constructor(title : string = '', columns : List<BaseColumn> = List(), headerRenderer : Function = () => this.title, locked: boolean = false) {
    this.title = title
    this.columns = columns
    this.headerRenderer = headerRenderer
    this.locked = locked
  }
}