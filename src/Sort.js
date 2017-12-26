// @flow

export default class Sort {
  columnId : string;
  direction : 'asc' | 'desc' = 'asc'

  constructor(columnId: string, direction: 'asc' | 'desc') {
    this.columnId = columnId
    this.direction = direction
  }
}