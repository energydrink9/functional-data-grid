// @flow

import React from 'react'
import TextBoxFilter from "./TextBoxFilter"

type BaseColumnOptionsType = {
  id : string,
  title? : ?string,
  valueGetter? : ?Function,
  filterable? : ?boolean,
  sortable? : ?boolean,
  resizable? : ?boolean,
  hidden? : ?boolean,
  aggregateValueGetter? : ?Function,
  renderer? : ?Function,
  aggregateRenderer? : ?Function,
  comparator? : ?(any, any) => number,
  filterRenderer? : ?Function,
  headerRenderer? : ?Function,
  locked? : ?boolean,
  width? : ?number,
  headerStyle? : ?Object,
  style? : ?Object
};

export default class BaseColumn {
  id : string;
  title : string = '';
  valueGetter : Function;
  filterable : boolean = false;
  sortable : boolean = false;
  resizable : boolean = true;
  hidden : boolean = false;
  renderer : Function = v => v;
  aggregateRenderer : Function;
  aggregateValueGetter : Function;  // eslint-disable-line
  comparator : (any, any) => number = (a, b) => a === b ? 0 : a < b ? -1 : 1;
  filterRenderer : Function = (onUpdateFilter : Function) => <TextBoxFilter onUpdateFilter={onUpdateFilter} />;  // eslint-disable-line
  headerRenderer : (BaseColumn) => any = (column : BaseColumn) => column.title;
  locked : boolean = false;
  width : ?number;
  headerStyle : Object = {};
  style : Object = {}

  constructor(options : BaseColumnOptionsType) {

    if (options.id == null)
      throw new Error('Column id is required')

    if (options.valueGetter == null)
      throw new Error('Column value getter is required')

    this.id = options.id
    if (options.title != null)
      this.title = options.title
    if (options.valueGetter != null)
      this.valueGetter = options.valueGetter
    if (options.filterable != null)
      this.filterable = options.filterable
    if (options.sortable != null)
      this.sortable = options.sortable
    if (options.resizable != null)
      this.resizable = options.resizable
    if (options.hidden != null)
      this.hidden = options.hidden
    if (options.renderer != null)
      this.renderer = options.renderer
    if (options.aggregateRenderer == null)
      this.aggregateRenderer = this.renderer
    else
      this.aggregateRenderer = options.aggregateRenderer
    if (options.comparator != null)
      this.comparator = options.comparator
    if (options.aggregateValueGetter != null)
      this.aggregateValueGetter = options.aggregateValueGetter
    if (options.filterRenderer != null)
      this.filterRenderer = options.filterRenderer
    if (options.headerRenderer != null)
      this.headerRenderer = options.headerRenderer
    if (options.headerStyle != null)
      this.headerStyle = options.headerStyle
    if (options.style != null)
      this.style = options.style

    this.locked = options.locked != null && options.locked
    this.width = options.width
  }
}
