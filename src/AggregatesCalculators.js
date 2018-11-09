// @flow

export default class AggregatesCalculators {

  static count = <T,> (elements: Array<T>) : number => elements.length

  static sum = (elements: Array<number>) : number =>
    elements.reduce((accumulator: number, element: number) => accumulator + element, 0)

  static average = (elements: Array<number>) : ?number =>
    elements.length === 0 ? null : AggregatesCalculators.sum(elements) / elements.length
}
