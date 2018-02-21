// @flow

import { List } from 'immutable'

export default class AggregatesCalculators {

  static count = <T,> (elements: List<T>) : number => elements.size

  static sum = <T,> (elements: List<T>, valueGetter: (T) => number) : number =>
    elements.reduce((accumulator: number, element: T) => accumulator + valueGetter(element), 0)

  static average = <T,> (elements: List<T>, valueGetter: (T) => number) : number =>
    AggregatesCalculators.sum(elements, valueGetter) / elements.size
}
