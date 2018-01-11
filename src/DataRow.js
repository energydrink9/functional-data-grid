// @flow

export default class DataRow<T> {
  content : T;
  type : 'element' | 'aggregate'

  constructor(content : T, type : 'element' | 'aggregate') {
    this.content = content
    this.type = type
  }
}
