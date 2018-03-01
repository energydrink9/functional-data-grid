// @flow

export default class DataRow<T> {

  content: T
  type: 'element' | 'group-header' | 'aggregate'
  originalIndex: ?number

  constructor(content : T, type : 'element' | 'group-header' | 'aggregate', originalIndex: ?number) {
    this.content = content
    this.type = type
    this.originalIndex = originalIndex
  }
}
