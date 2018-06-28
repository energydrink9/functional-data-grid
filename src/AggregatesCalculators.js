// @flow

import { List } from 'immutable'

export default class AggregatesCalculators {

  static count = <T,> (elements: List<T>) : number => elements.size

  static sum = (elements: List<number>) : number =>
    elements.reduce((accumulator: number, element: number) => accumulator + element, 0)

  static average = (elements: List<number>) : number =>
    AggregatesCalculators.sum(elements) / elements.size
}
