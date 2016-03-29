# data-statistics
Computing streaming statistics on data object.
Package is meant to provide simple data statistics and profiling functionality for the objects that are read sequentially one row/elemtnt at a time while providing semi-sorted statistics previews. 
Examples:
- reading file using FS or FileReader() API
- initializing object and feeding log messages to it
- feeding streaming api to the input (i.e. twittter firehose)
- profiling batches of data (i.e. multiple files/sources put in one profile)

## Installation
*npm install data-statistics*

## Sample Usage
Basic usage of the data-statistic package consists of:
 1. initializing the object with default options (only required option is array with the same number of elements as there are elements in the data row)
 ```javascript
 var stats = require("data-statistics");
 stats.DataStatistics({elements: ['name','number']});
 ```
 *hint: you can use data header for initialization*

 2. feeding data into the object one line at a time (row has to have the same number of elements as declared in initialization)
 ```javascript 
 var row = [{"value": "John-123"}, {"value": 11}];
 DS.updateStatistics(row);
 var row = [{"value": "Darcy"}, {"value": 11}];
 DS.updateStatistics(row);
 ```
 Data is always in the format mentioned above. Array of the object with at least "value" attribute. Number of objects and order of objects must correspond to the number of objects set upon the initialization.
 3. Accessing the statistics any time by calling the getter methods
   ```javascript
    DS.getTopFrequencyObject();
    
    [
        {freq: [ { label: "John-123", value: 1 }, { label: "Darcy", value: 1 } ]},
        {freq: [ { label: "11", value: 2} ]}
    ]
    ```
    You can access this object any time, from any other process.


## Core functionality
Library provides multiple out of the box statistics suitable for creating data profiles. Statistics can be used from single package, or separately.

Packages included:
- **NullCheck**: Simple check on null/not-null for every element
- **FrequencyMetrics**: Frequency of occurrences of values for every element
  - Frequency metrics can also be configured to keep sorted object with most used items always available to read
- **Mask Analysis**: Mask analysis on the data elements with frequency of occurences for every mask
- **Distinct/Dupicite/Unique statistics**: checks how many values in the element is distinct/Unique/Duplicate

The Data-metrics provides wrapper around all above mentioned functionality for easier orchestration. Basically executing all the statistics on every new data row/attribute.

### Frequency Metrics
Frequency metrics will compute occurences of the values in the data. It will keep the full list of occurences always accessible along with the list of top N values (those represented in the data with most occurences)
In addition of frequency metrics, this statistics object will also provide distinct/duplicite/unique object.
For example if we are doing frequency analysis on this sample data:
```javascript
  [{"value": "John"}, {"value": 1}],
 [{"value": "John"}, {"value": 2}],
 [{"value": "Darcy"}, {"value": 1}]
```
Then the frequency for the First field in the data would be:

|value | frequency |
| --- | --- |
| John | 2 |
| Darcy | 1 |
And the frequency for the Second field in the data would be:

|value | frequency |
| --- | --- |
| 1 | 2 |
| 2 | 1 |
The full list is always available from the frequency metrics calling `getFreqObject()` on Frequency Metrics object or `getFrequencyObject()` from Data-statistics object
In addition of full list, the list of top N (default 10) occurrences is always accessible by calling `getFreqTopObject()` on Frequency Metrics object or `getTopFrequencyObject()` on Data-statistics object


#### Top List
The list of top occurrences is meant to be used in the situations where "preview" needs to be accessible for the most common values, but sorting the full list takes too much resources. 
Basically when dealing with frequency, most of the time the most interesting values are the ones that has highest occurrences. But reporting this "on the fly" on huge data set (i.e. reporting this every 200ms on 100K+ records) would trigger sort on this huge list every time.
The top list always keeps top N members accessible in the simple array. This is always accessible and it does not sort the full list.

For the situations where this functionality is not needed, it should be turned off via `computeTmp` option of the FrequencyMetrics object.

The same applies for frequencies of Masks in the MaskMetrics object.

### MaskMetrics
MaskMetrics object provides basic mask analysis on on the data object. It is updated for every record fed in the statistics object.
Masks defined are only [*Letter*] (represented by letter *L*) and [*Digit*] (represented by letter *D*)
It converts every input to the mask representation and then do a frequency analysis on the results. It also deals with diacritics.
For example if we are doing frequency analysis on this sample data:
```javascript
  [{"value": "John-123"}, {"value": 11}],
 [{"value": "Jack-123"}, {"value": 211}],
 [{"value": "1Darcy"}, {"value": 11}]
```
Then the frequency for the First field in the data would be:

|value | frequency |
| --- | --- |
| LLLL-DDD | 2 |
| DLLLLL | 1 |
And the frequency for the Second field in the data would be:

|value | frequency |
| --- | --- |
| DD | 2 |
| DDD | 1 |
The full list is always available from the frequency metrics calling `getFreqObject()` on Mask Metrics object or `getFrequencyObject()` from Data-statistics object
In addition of full list, the list of top N (default 10) occurrences is always accessible by calling `getFreqTopObject()` on Mask Metrics object or `getTopFrequencyObject()` on Data-statistics object

## Options
### DataStatistics
The `DataStatistics` object has only one required option that is passed down to statistic sub-objects.

| option | Description |
| --- | ---|
| elements [*array*] | array with the same number of records as the data elements that will be fed to the statistics. Header or first line of data can be used here. |

Non-required options consists of option definition of sub-statistic elements (the same option objects can be used with sub-statistics separately)

| option | Description |
| --- | --- |
| nullMetrics [*object*] | options definition for NullMetrics object (see below). If elements provided for DataStatistics object, elements does not have to be specified here. |
| frequencyMetrics [*object*] | options definition for FrequencyMetrics object (see below). If elements provided for DataStatistics object, elements does not have to be specified here. |
| maskMetrics [*object*] | options definition for MaskMetrics object (see below). If elements provided for DataStatistics object, elements does not have to be specified here. |

### NullMetrics
NullMetrics can be used separately. If used inside DataStatistics object, `elements` option does not have to be declared (it uses the elements from parent object).
Only required option (if not specified in master object) is elements.

| option | Description |
| --- | ---|
| elements [*array*] | array with the same number of records as the data elements that will be fed to the statistics. Header or first line of data can be used here. |

non-required options:

| option | Description |
| --- | --- |
| considerEmpty [*boolean*] default *true*| specifies whether the empty string "" should be considered NULL |

### FrequencyMetrics / MaskMetrics
`FrequencyMetrics` and `MaskMetrics` have identical set of options.
FrequencyMetrics and MaskMetrics can be used separately. If used inside DataStatistics object, `elements` option does not have to be declared (it uses the elements from parent object).
Only required option (if not specified in master object) is `elements`.

| option | Description |
| --- | ---|
| elements [*array*] | array with the same number of records as the data elements that will be fed to the statistics. Header or first line of data can be used here. |

non-required otpions:

| option | Description |
| --- | --- |
| computeTmp [*boolean*] default *true*| whether to keep list of top occurences and maintain it. Consider switching this off when not used, it can speed the performance |
| tmpElements [*integer*] default *10* | how many elements to keep in the list of top occurences. |

### Example config object
Configuration object with full set of options.
```javascript
var options = {elements: ["field1", "field2"], 
                nullMetrics: { considerEmpty: true}, 
                frequencyMetrics: { 
                    computeTmp: true, 
                    tmpElements: 10}, 
                maskMetrics: { 
                    computeTmp: true, 
                    tmpElements: 10}
                }
             }
```

## Methods
### DataStatistics
#### Initialization:
```javascript
var stats = require("data-statistics");
var DS = new stats.DataStatistics({elements: [1,2]});
```
#### updateStatistics([*array*] row)
Adds new row of data and compute all the statistics. Data should be provided in an array with the same number of elements as initialization and same order of elements.
```javascript
DS.updateStatistics([{"value": "Darcy"}, {"value": 11}]);
```
#### getTopFrequencyObject()
Returns frequency object with top occurrences for all the fields.
```javascript
    [
        {freq: [ { label: "John-123", value: 1 }, { label: "Darcy", value: 1 } ]},
        {freq: [ { label: "11", value: 2} ]}
    ]
```
#### getFrequencyObjectForField([*integer*] index)
Returns frequency object for single field defined by index.
```javascript
    {freq: [ { label: "John-123", value: 1 }, { label: "Darcy", value: 1 } ]}
```
#### getFrequencyObject()
Returns frequency object for all the fields.
```javascript
    [
        {freq: [ { label: "John-123", value: 1 }, { label: "Darcy", value: 1 } ]},
        {freq: [ { label: "11", value: 2} ]}
    ]
```
#### getTopFrequencyObjectForField([*integer*] index)
Returns frequency object with top occurrences for single field defined by index.
```javascript
    {freq: [ { label: "John-123", value: 1 }, { label: "Darcy", value: 1 } ]}
```
#### getTopMaskFrequencyObject()
Returns frequency object with top occurrences of masks for all the fields.
```javascript
    [
        {freq: [ { label: "LLL", value: 1 }, { label: "LL-DD", value: 1 } ]},
        {freq: [ { label: "DD", value: 2} ]}
    ]
```
#### getTopMaskFrequencyObjectForField([*integer*] index)
Returns frequency object with top occurrences of Masks for single field defined by index.
```javascript
    {freq: [ { label: "LLL", value: 1 }, { label: "LL-DD", value: 1 } ]}
```
#### getMaskFrequencyObject()
Returns frequency object of masks for all the fields.
```javascript
    [
        {freq: [ { label: "LLL", value: 1 }, { label: "LL-DD", value: 1 } ]},
        {freq: [ { label: "DD", value: 2} ]}
    ]
```
#### getMaskFrequencyObjectForField([*integer*] index)
Returns frequency object of Masks for single field defined by index.
```javascript
    {freq: [ { label: "LLL", value: 1 }, { label: "LL-DD", value: 1 } ]}
```
#### getNullObject()
Returns object with null/nonNull count for all the fields
```javascript
[ 
    { nullCount: { null: 2, nonNull: 13 } },
    { nullCount: { null: 2, nonNull: 13 } } 
]
```
#### getNullObjectForField([*integer*] index)
Returns object with null/nonNull count for the speciffic field
```javascript
    { nullCount: { null: 2, nonNull: 13 } } 
```
#### getDistinctCounts()
Returns object with distinct/unique/duplicate count for all fields
```javascript
[ 
    { nonUnique: 2, unique: 2, duplicate: 11, distinct: 4 },
    { nonUnique: 2, unique: 2, duplicate: 11, distinct: 4 } 
]
```
#### getDistinctCountsForField([*integer*] index)
Returns object with distinct/unique/duplicate count for speciffic field
```javascript
    { nonUnique: 2, unique: 2, duplicate: 11, distinct: 4 } 
```
#### getMasksDistinctCounts()
Returns object with distinct/unique/duplicate count for masks for all fields
```javascript
[ 
    { nonUnique: 2, unique: 2, duplicate: 11, distinct: 4 },
    { nonUnique: 2, unique: 2, duplicate: 11, distinct: 4 } 
]
```
#### getMasksDistinctCountsForField([*integer*] index)
Returns object with distinct/unique/duplicate count for masks for speciffic field
```javascript
    { nonUnique: 2, unique: 2, duplicate: 11, distinct: 4 } 
```
### NullMetrics
NullMetrics can be used separate from main object (i.e. in case you need to only compute this statistic but not others.
#### Initialization:
```javascript
var stats = require("data-statistics");
var NM = new stats.NullMetrics({elements: [1,2]});
```
#### checkNulls([*array*] row)
Adds new row of data and compute null statistics. Data should be provided in an array with the same number of elements as initialization and same order of elements.
```javascript
NM.checkNulls([{"value": "Darcy"}, {"value": 11}]);
```
#### nullObject
you can access `nullObject` attribute directly to read null statistics.
```javascript
var nullO = NM.nullObject;
[ 
    { nullCount: { null: 2, nonNull: 13 } },
    { nullCount: { null: 2, nonNull: 13 } } 
]
```
### FrequencyMetrics / MaskMetrics
You can use frequency or mask metrics separately from the main object in case you only need to compute these statistics.

The methods and options are the same for both objects.

#### Initialization:
```javascript
var stats = require("data-statistics");
var FM = new stats.FrequencyMetrics({elements: [1,2]});
var MM = new stats.MaskMetrics({elements: [1,2]});
```

#### updateFrequencies([*array*] elements)
Adds new row of data and compute frequency/masks statistics. Data should be provided in an array with the same number of elements as initialization and same order of elements.
```javascript
FM.updateFrequencies([{"value": "Darcy"}, {"value": 11}]);
```
#### getFreqObject()
Returns frequency object for all the fields.
```javascript
    [
        {freq: [ { label: "John-123", value: 1 }, { label: "Darcy", value: 1 } ]},
        {freq: [ { label: "11", value: 2} ]}
    ]
```
#### getFreqTopObject()
Returns frequency object with top occurrences for all the fields.
```javascript
    [
        {freq: [ { label: "John-123", value: 1 }, { label: "Darcy", value: 1 } ]},
        {freq: [ { label: "11", value: 2} ]}
    ]
```
#### getDistinctObject()
Returns object with distinct/unique/duplicate count for all fields
```javascript
[ 
    { nonUnique: 2, unique: 2, duplicate: 11, distinct: 4 },
    { nonUnique: 2, unique: 2, duplicate: 11, distinct: 4 } 
]
```