// @flow

import BaseColumn from './BaseColumn'
import { List } from 'immutable'

export default class ColumnGroup {
  title : string = '';
  columns : List<BaseColumn>;
  headerRenderer : Function;

  constructor(title : string = '', columns : List<BaseColumn> = List(), headerRenderer : Function = () => this.title) {
    this.title = title
    this.columns = columns
    this.headerRenderer = headerRenderer
  }
}