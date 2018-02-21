// @flow

export default class Aggregate<T> {

  constructor(key: Object, content: T) {
    this.key = key
    this.content = content
  }

  key: Object
  content: T
}
