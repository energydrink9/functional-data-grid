// @flow

import { List } from 'immutable'

export default class AggregatesCalculators {
  static sumCalculator = <T,> (elements: List<T>, valueGetter: (T) => number) : number =>
    elements.reduce((accumulator: number, element: T) => accumulator + valueGetter(element), 0)

  static averageCalculator = <T,> (elements: List<T>, valueGetter: (T) => number) : number =>
    AggregatesCalculators.sumCalculator(elements, valueGetter) / elements.size
}