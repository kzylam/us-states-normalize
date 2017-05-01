# us-states-normalize
A library to normalize and convert any variations of US state names and abbreviations.

## Installation

```
npm install us-states-normalize --save
```


## Usage

```
var normalize = require('us-states-normalize');

// using original 50 states + D.C.
normalize('Alabama');                                                 // 'AL'
normalize('N.Y.');                                                    // 'NY'
normalize('WashingTON DC');                                           // 'DC'
normalize('Puerto Rico');                                             // null - not a state

// to include territories as well such as Guam
normalize('US Virgin Islands', { region: ['state', 'territory'] });   // 'VI'

// to include everything including freely associated states
normalize('Micronesia', { region: 'all' });                           // 'FM'

// to return full names
normalize('RI', { returnType: 'name' });                              // 'Rhode Island'

// to return customized names
normalize('DC', {                                                     // 'Washington DC'
  returnType: function(states) {
    // states is a key:value store with keys as USPS codes and values as the full names
    states['DC'] = 'Washington DC'; // default was { "DC": "District Of Columbia" }
    return states;
   }
});

// to omit certain states
normalize('DC', { omit: ['DC'] });                                    // null
```

The options along with their defaults:
```
{
  region: [String|Array]('state') - ['state', 'territory', 'associated']
  returnType: [String|Function]('USPS') - ['USPS', 'AP', 'name', function(states) {}]
  omit: [String|Array](null) - list of USPS codes
}
```


## Test

```
npm test
```


## US States and Territories

### States

```
AL - Alabama
AK - Alaska
AZ - Arizona
AR - Arkansas
CA - California
CO - Colorado
CT - Connecticut
DE - Delaware
DC - District Of Columbia
FL - Florida
GA - Georgia
HI - Hawaii
ID - Idaho
IL - Illinois
IN - Indiana
IA - Iowa
KS - Kansas
KY - Kentucky
LA - Louisiana
ME - Maine
MD - Maryland
MA - Massachusetts
MI - Michigan
MN - Minnesota
MS - Mississippi
MO - Missouri
MT - Montana
NE - Nebraska
NV - Nevada
NH - New Hampshire
NJ - New Jersey
NM - New Mexico
NY - New York
NC - North Carolina
ND - North Dakota
OH - Ohio
OK - Oklahoma
OR - Oregon
PA - Pennsylvania
RI - Rhode Island
SC - South Carolina
SD - South Dakota
TN - Tennessee
TX - Texas
UT - Utah
VT - Vermont
VA - Virginia
WA - Washington
WV - West Virginia
WI - Wisconsin
WY - Wyoming
```

### Territories

```
AS - American Samoa
GU - Guam
MP - Northern Mariana Islands
PR - Puerto Rico
VI - Virgin Islands
```

### Freely Associated States
```
FM - Federated States Of Micronesia
MH - Marshall Islands
PW - Palau
```