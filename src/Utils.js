// @flow

import Column from './Column'
import ComputedColumnGroup from './ComputedColumnGroup'
import { List } from 'immutable'

let addColumnGroup = (accumulator: List<ComputedColumnGroup>, c: Column) => accumulator.push(
  c.columnGroup != null
    ? { columns: List([c]), columnGroup: c.columnGroup }
    : { columns: List([c]), columnGroup: null }
)

let updateColumnGroup = (accumulator: List<ComputedColumnGroup>, c: Column) => {
  let lastElement = accumulator.last()
  return accumulator.pop().push(
    { 
      columns: lastElement.columns.push(c),
      columnGroup: lastElement.columnGroup
    }
  )
}

let getComputedColumnGroups = (columns: List<Column>) => columns
  .reduce((accumulator: List<ComputedColumnGroup>, c: Column) => accumulator.size === 0 || c.columnGroup == null || accumulator.last().columnGroup !== c.columnGroup
    ? addColumnGroup(accumulator, c)
    : updateColumnGroup(accumulator, c), List())

export { getComputedColumnGroups }