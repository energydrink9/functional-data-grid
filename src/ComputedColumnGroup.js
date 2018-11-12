// @flow

import { List } from 'immutable'
import Column from './Column'

export type ComputedColumnGroup = {
  columns: List<Column>,
  columnGroup: ?string
}