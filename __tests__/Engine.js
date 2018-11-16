
import Engine from '../src/Engine'
import { List, Map } from 'immutable'
import Sort from '../src/Sort'
import Filter from '../src/Filter';
import Column from '../src/Column'
import Group from '../src/Group';
import AggregatesCalculators from '../src/AggregatesCalculators';

test('elements are sorted correctly', () => {

  let data = List([
    { position: 2 },
    { position: 3 },
    { position: 1 }
  ])
  let sort = List([new Sort(
    'position',
    'asc'
  )])
  let columns = List([new Column(
    new Column({
      id: 'position',
      valueGetter: (e) => e.position
    })
  )])

  let result = Engine.computeElements(data, List(), sort, List(), columns, false, false, null, Map())

  expect(result.get(0).content.position).toBe(1)
  expect(result.get(1).content.position).toBe(2)
  expect(result.get(2).content.position).toBe(3)
})

test('elements are filtered correctly', () => {

  let data = List([
    { name: 'Jack' },
    { name: 'Mark' },
    { name: 'Alice' }
  ])

  let filters = List([new Filter(
    'name',
    (value) => (value == null ? '' : value.toString()).toUpperCase().includes('Ja'.toUpperCase())
  )])

  let columns = List([new Column(
    new Column({
      id: 'name',
      valueGetter: (e) => e.name
    })
  )])

  let result = Engine.computeElements(data, List(), List(), filters, columns, false, false, null, Map())

  expect(result.size).toBe(1)
  expect(result.get(0).content.name).toBe('Jack')
})

test('elements are filtered correctly with two filters', () => {

  let data = List([
    { name: 'Jack' },
    { name: 'Mark' },
    { name: 'Alice' }
  ])

  let filters = List([
    new Filter(
      'name',
      (value) => (value == null ? '' : value.toString()).toUpperCase().includes('a'.toUpperCase())
    ),
    new Filter(
      'name',
      (value) => (value == null ? '' : value.toString()).toUpperCase().includes('k'.toUpperCase())
    ),
  ])

  let columns = List([new Column(
    new Column({
      id: 'name',
      valueGetter: (e) => e.name
    })
  )])

  let result = Engine.computeElements(data, List(), List(), filters, columns, false, false, null, Map())

  expect(result.size).toBe(2)
  expect(result.get(0).content.name).toBe('Jack')
  expect(result.get(1).content.name).toBe('Mark')
})

test('elements are grouped correctly', () => {

  let data = List([
    { name: 'Jack', gender: 'Male' },
    { name: 'Alice', gender: 'Female' },
    { name: 'Mark', gender: 'Male' }
  ])
  
  let groups = List([
    new Group({
      id: 'gender',
      groupingFunction: e => e.gender
    })
  ])

  let columns = List([new Column(
    new Column({
      id: 'name',
      valueGetter: (e) => e.name
    }),
    new Column({
      id: 'gender',
      valueGetter: (e) => e.gender
    })
  )])

  let result = Engine.computeElements(data, groups, List(), List(), columns, false, false, null, Map())

  expect(result.get(0).content.name).toBe('Alice')
  expect(result.get(1).content.name).toBe('Jack')
  expect(result.get(2).content.name).toBe('Mark')
})

test('grouped elements are filtered correctly', () => {

  let data = List([
    { name: 'Jack', gender: 'Male' },
    { name: 'Alice', gender: 'Female' },
    { name: 'Mark', gender: 'Male' }
  ])
  
  let groups = List([
    new Group({
      id: 'gender',
      groupingFunction: e => e.gender
    })
  ])

  let columns = List([new Column(
    new Column({
      id: 'name',
      valueGetter: (e) => e.name
    }),
    new Column({
      id: 'gender',
      valueGetter: (e) => e.gender
    })
  )])

  let filters = List([new Filter(
    'name',
    (value) => (value == null ? '' : value.toString()).toUpperCase().includes('k'.toUpperCase())
  )])

  let result = Engine.computeElements(data, groups, List(), filters, columns, false, false, null, Map())

  expect(result.size).toBe(2)

  expect(result.get(0).content.name).toBe('Jack')
  expect(result.get(1).content.name).toBe('Mark')
})

test('sum aggregates are computed correctly', () => {

  let data = List([
    { name: 'Jack', gender: 'Male', likes: 3 },
    { name: 'Alice', gender: 'Female', likes: 10 },
    { name: 'Mark', gender: 'Male', likes: 1 }
  ])
  
  let groups = List([
    new Group({
      id: 'gender',
      groupingFunction: e => e.gender
    })
  ])

  let columns = List([new Column(
    new Column({
      id: 'name',
      valueGetter: (e) => e.name
    }),
    new Column({
      id: 'gender',
      valueGetter: (e) => e.gender
    })
  )])

  let result = Engine.computeElements(data, groups, List(), List(), columns, false, false, (els) => { return { likes: AggregatesCalculators.sum(els.map(e => e.likes)) } }, Map())

  expect(result.get(0).content.name).toBe('Alice')
  expect(result.get(1).content.content.likes).toBe(10)
  expect(result.get(2).content.name).toBe('Jack')
  expect(result.get(3).content.name).toBe('Mark')
  expect(result.get(4).content.content.likes).toBe(4)
})

test('average aggregates are computed correctly', () => {

  let data = List([
    { name: 'Jack', gender: 'Male', likes: 3 },
    { name: 'Alice', gender: 'Female', likes: 10 },
    { name: 'Mark', gender: 'Male', likes: 1 }
  ])
  
  let groups = List([
    new Group({
      id: 'gender',
      groupingFunction: e => e.gender
    })
  ])

  let columns = List([new Column(
    new Column({
      id: 'name',
      valueGetter: (e) => e.name
    }),
    new Column({
      id: 'gender',
      valueGetter: (e) => e.gender
    })
  )])

  let result = Engine.computeElements(data, groups, List(), List(), columns, false, false, (els) => { return { likes: AggregatesCalculators.average(els.map(e => e.likes)) } }, Map())

  expect(result.get(0).content.name).toBe('Alice')
  expect(result.get(1).content.content.likes).toBeCloseTo(10)
  expect(result.get(2).content.name).toBe('Jack')
  expect(result.get(3).content.name).toBe('Mark')
  expect(result.get(4).content.content.likes).toBeCloseTo(2)
})

test('count aggregates are computed correctly', () => {

  let data = List([
    { name: 'Jack', gender: 'Male', likes: 3 },
    { name: 'Alice', gender: 'Female', likes: 10 },
    { name: 'Mark', gender: 'Male', likes: 1 }
  ])
  
  let groups = List([
    new Group({
      id: 'gender',
      groupingFunction: e => e.gender
    })
  ])

  let columns = List([new Column(
    new Column({
      id: 'name',
      valueGetter: (e) => e.name
    }),
    new Column({
      id: 'gender',
      valueGetter: (e) => e.gender
    })
  )])

  let result = Engine.computeElements(data, groups, List(), List(), columns, false, false, (els) => { return { likes: AggregatesCalculators.count(els) } }, Map())

  expect(result.get(0).content.name).toBe('Alice')
  expect(result.get(1).content.content.likes).toBe(1)
  expect(result.get(2).content.name).toBe('Jack')
  expect(result.get(3).content.name).toBe('Mark')
  expect(result.get(4).content.content.likes).toBe(2)
})