// @flow

export default class Sort {
  columnId : string;
  direction : 'asc' | 'desc' = 'asc'

  constructor(columnId: string, direction: 'asc' | 'desc') {

    if (columnId == null)
      throw new Error('Column id is required')

    if (direction == null)
      throw new Error('Direction is required')

    if (direction !== 'asc' && direction !== 'desc')
      throw new Error('Invalid sort direction (must be \'asc\' or \'desc\')')

    this.columnId = columnId
    this.direction = direction
  }
}