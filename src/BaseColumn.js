// @flow

import React from 'react'
import TextBoxFilter from "./TextBoxFilter"

type BaseColumnOptionsType = {
  id : string,
  title? : ?string,
  valueGetter? : ?Function,
  filterable? : ?boolean,
  sortable? : ?boolean,
  hidden? : ?boolean,
  renderer? : ?Function,
  comparator? : ?Function,
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
  valueGetter : Function = e => e;
  filterable : boolean = false;
  sortable : boolean = false;
  hidden : boolean = false;
  renderer : Function = v => v;
  comparator : Function = (a, b) => a === b ? 0 : a < b ? -1 : 1;
  filterRenderer : Function = (onUpdateFilter : Function) => <TextBoxFilter onUpdateFilter={onUpdateFilter} />;  // eslint-disable-line
  headerRenderer : Function = (column : BaseColumn) => this.title;
  locked : boolean = false;
  width : ?number;
  headerStyle : Object = {};
  style : Object = {}

  constructor(options : BaseColumnOptionsType) {
    this.id = options.id
    if (options.title != null)
      this.title = options.title
    if (options.valueGetter != null)
      this.valueGetter = options.valueGetter
    if (options.filterable != null)
      this.filterable = options.filterable
    if (options.sortable != null)
      this.sortable = options.sortable
    if (options.hidden != null)
      this.hidden = options.hidden
    if (options.renderer != null)
      this.renderer = options.renderer
    if (options.comparator != null)
      this.comparator = options.comparator
    if (options.filterRenderer != null)
      this.filterRenderer = options.filterRenderer
    if (options.headerRenderer != null)
      this.headerRenderer = options.headerRenderer
    if (options.headerStyle != null)
      this.headerStyle = options.headerStyle
    if (options.style != null)
      this.style = options.style

    if (options.locked != null)
      this.locked = options.locked
    this.width = options.width
  }
}