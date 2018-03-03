# Functional Data Grid

[![npm version](https://badge.fury.io/js/functional-data-grid.svg)](https://badge.fury.io/js/functional-data-grid)

This is a library made with React and React-Virtualized for creating rich data grids with filtering, sorting, grouping and aggregates.
It supports virtualization, and so it can handle very large amounts of data. It features also locked columns custom renderers and columns resize.
Filtering, sorting, grouping and aggregates computation are done client-side.

Functional Data Grid is written in ES2016 and in functional programming style.


# Installation

You can install the library with NPM:

```bash
npm install –-save functional-data-grid
```

or with YARN:

```bash
yarn add functional-data-grid
```


# Usage

To use Functional Data Grid, you have to import the library and its base types you intend to use, for example:

```javascript
import FunctionalDataGrid, { BaseColumn, Group } from ‘functional-data-grid’
```

then you can use it inside your component. For example:

```javascript
import React from 'react'
import FunctionalDataGrid, { BaseColumn } from 'functional-data-grid'
import { List } from 'immutable'


let columns = List([
  new BaseColumn({
    id : 'name',
    title: 'Name',
    width: 120
  },
  new BaseColumn({
    id : 'surname',
    title: 'Surname',
    width: 120
  })
])

let data = List([
  {
    'name': 'Donald',
    'surname': 'Duck'
  },
  {
    'name': 'Mickey',
    'surname': 'Mouse'
  }
])

class MyGrid extends React.Component {

  render = () => <FunctionalDataGrid columns={columns} data={data} />

}
```


# Component Props

The FunctionalDataGrid component accepts the following props:

|Prop|Required / optional|Default|Description|
|---|---|---|---|
|columns|required| |An array of BaseColumn with columns definitions|
|data|required| |An array of elements to show in the grid, one per row|
|initialFilter|optional|No filters|An array of Filter to filter the elements|
|initialSort|optional|No sorting|An array of Sort to sort the elements|
|groups|optional|No grouping|An array of Group to specify grouping of the elements|
|aggregatesCalculator|optional|No aggregates|A function to compute the aggregates from an array of elements|
|additionalStyle|optional|{}|Allows to specify additional styles for the grid|
|showGroupHeaders|optional|true|Set to false to hide the headers for groups|
|onColumnResize|optional| |Allows to specify an event handler for column resizing|


# Columns definition

Columns are defined by creating an instance of the class BaseColumn.
BaseColumn constructor accepts an object with the following keys:

|Key      |Required / optional|Default|Description               |
|---|---|---|---|
|id|required| |A unique id for the column|
|title|optional|empty|The title shown on the column header|
|filterable|optional|false|Enables filtering on this column|
|sortable|optional|false|Enables sorting on this column|
|resizable|optional|true|Enables resizing for this column|
|locked|optional|false|Locks the column so that it doesn’t disappear on scrolling|
|hidden|optional|false|Hides the column|
|width|optional| |The width of the column|
|valueGetter|required| |Specifies how to get the value to show in the column from the original row element|
|aggregateValueGetter|optional| |Specifies how to get the value to show in the column from the aggregate row element|
|renderer|optional|v => v|Specifies how to render the column value|
|aggregateRenderer|optional|= renderer|Specifies how to render the aggregate column value|
|filterRenderer|optional||Specifies how to render the filter in the header|
|headerRenderer|optional|(column) => column.title|Specifies how to render the header|
|headerStyle|optional|{}|Allows to specify additional styles for the column header|
|style|optional|{}|Allows to specify additional styles for the column|
|comparator|optional|(a, b) => a === b ? 0 : a < b ? -1 : 1|Specifies a comparator for the sorting function|


# Groups definition

Groups are defined by creating an instance of the class Group.
Group constructor accepts an object with the following keys:

|Key      |Required / optional|Default|Description               |
|---|---|---|---|
|id|required| |A unique id for the column|
|title|optional|empty|The title shown on the group header|
|groupingFunction|required| |A function that compute the takes an element and compute the corresponding key|
|renderer|optional|v => v|The title shown on the group header|
|comparator|optional|(a: K, b: K) => a === b ? 0 : (a: any) < (b: any) ? -1 : 1|The comparator used to sort the groups|


# Demo

Check the examples here: https://energydrink9.github.io/functional-data-grid-examples


# Conclusion

Pull requests are welcome, enjoy your functional data grids!

