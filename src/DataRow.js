// @flow

export default class DataRow<T> {

  content: T
  type: 'element' | 'aggregate'
  originalIndex: ?number

  constructor(content : T, type : 'element' | 'aggregate', originalIndex: ?number) {
    this.content = content
    this.type = type
    this.originalIndex = originalIndex
  }
}
