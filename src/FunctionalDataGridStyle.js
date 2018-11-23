// @flow

import DataRow from './DataRow'

export type FunctionalDataGridStyle<T> = {
  grid?: Object,
  header?: Object,
  footer?: Object,
  row?: (DataRow<T>) => Object,
  cell?: Object,
}