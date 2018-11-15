// @flow

import DataRow from './DataRow'

export type FunctionalDataGridStyle = {
  grid?: Object,
  header?: Object,
  footer?: Object,
  row?: (DataRow<any>) => Object,
  cell?: Object,
}