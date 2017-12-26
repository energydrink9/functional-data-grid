// @flow

export default class Filter {
  columnId : string;
  matcher : Function;

  constructor(columnId: string, matcher: Function) {
    this.columnId = columnId
    this.matcher = matcher
  }
}