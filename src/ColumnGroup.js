// @flow

type ColumnGroupOptionsType = {
  id: string,
  title: string,
  headerRenderer: Function
};
export default class ColumnGroup {

  id: string
  title: string = ''
  headerRenderer: Function = () => this.title

  constructor(options: ColumnGroupOptionsType) {

    if (options.id == null)
      throw new Error('ColumnGroup id is required')

    this.id = options.id
    if (options.title != null)
      this.title = options.title
    if (options.headerRenderer != null)
      this.headerRenderer = options.headerRenderer
  }
}