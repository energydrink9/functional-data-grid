// @flow

import uuidv4 from 'uuid/v4'

export default class DataRow<T> {

  content: T
  type: 'element' | 'group-header' | 'aggregate'
  originalIndex: ?number
  key: string

  constructor(content : T, type : 'element' | 'group-header' | 'aggregate', originalIndex: ?number) {
    this.content = content
    this.type = type
    this.originalIndex = originalIndex
    this.key = uuidv4()
  }
}
