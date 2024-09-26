// Import required modules
const fs = require('fs');
const BigNumber = require('bignumber.js');

// Read the input.json file
const data = fs.readFileSync('input.json', 'utf8');
const jsonData = JSON.parse(data);

// Get k value
const k = parseInt(jsonData['keys']['k']);

// Extract x and y values
let xList = [];
let yList = [];

// Iterate over the keys to get x and y values
for (let key in jsonData) {
    if (key === 'keys') continue;

    const x = new BigNumber(key);
    const base = parseInt(jsonData[key]['base']);
    const value = jsonData[key]['value'];

    // Decode y value
    const y = new BigNumber(value, base);

    xList.push(x);
    yList.push(y);
}

// Use only the first k data points
xList = xList.slice(0, k);
yList = yList.slice(0, k);

// Compute c using Lagrange interpolation at x=0
let c = new BigNumber(0);

for (let i = 0; i < k; i++) {
    let numerator = new BigNumber(1);
    let denominator = new BigNumber(1);

    for (let j = 0; j < k; j++) {
        if (j !== i) {
            numerator = numerator.times(xList[j].negated());
            denominator = denominator.times(xList[i].minus(xList[j]));
        }
    }

    const Li0 = numerator.dividedBy(denominator);
    const term = yList[i].times(Li0);
    c = c.plus(term);
}

// Output the constant term c
console.log(c.toFixed(0));
