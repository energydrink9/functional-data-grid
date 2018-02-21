// @flow

export default class Filter {
  columnId : string;
  matcher : (any) => boolean;

  constructor(columnId: string, matcher: (any) => boolean) {
    this.columnId = columnId
    this.matcher = matcher
  }
}