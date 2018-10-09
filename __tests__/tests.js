
import Engine from '../src/Engine'
import { List } from 'immutable';
import Sort from '../src/Sort';
import BaseColumn from '../src/BaseColumn';

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
  let columns = List([new BaseColumn(
    new BaseColumn({
      id: 'position',
      valueGetter: (e) => e.position
    })
  )])

  let result = Engine.computeElements(data, List(), sort, List(), columns, false)

  expect(result.get(0).content.position).toBe(1)
  expect(result.get(1).content.position).toBe(2)
  expect(result.get(2).content.position).toBe(3)
})
// test('elements are filtered correctly', () => {

// })
// test('elements are grouped correctly', () => {

// })
