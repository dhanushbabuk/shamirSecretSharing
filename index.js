const fs = require("fs");

// Function to decode the value from the given base
function decodeValue(base, value) {
  const bigBase = BigInt(base);
  const digits = value.toUpperCase().split("");
  const digitMap = {};
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((char, index) => {
    digitMap[char] = BigInt(index);
  });
  let result = 0n;
  for (const digit of digits) {
    const digitValue = digitMap[digit];
    if (digitValue === undefined || digitValue >= bigBase) {
      throw new Error(`Invalid digit '${digit}' for base ${base}`);
    }
    result = result * bigBase + digitValue;
  }
  return result;
}

// Function to compute the greatest common divisor (GCD)
function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Function to simplify fractions
function simplifyFraction(frac) {
  const commonDivisor = gcd(frac.num, frac.den);
  frac.num /= commonDivisor;
  frac.den /= commonDivisor;
  if (frac.den < 0n) {
    frac.num = -frac.num;
    frac.den = -frac.den;
  }
  return frac;
}

// Fraction arithmetic operations
function addFractions(a, b) {
  const num = a.num * b.den + b.num * a.den;
  const den = a.den * b.den;
  return simplifyFraction({ num, den });
}

function multiplyFractions(a, b) {
  const num = a.num * b.num;
  const den = a.den * b.den;
  return simplifyFraction({ num, den });
}

// Lagrange interpolation to find the polynomial value at x = 0
function lagrangeInterpolation(x, y, xValue) {
  let total = { num: 0n, den: 1n };
  const n = x.length;

  for (let i = 0; i < n; i++) {
    const xi = BigInt(x[i]);
    const yi = y[i];
    let li = { num: 1n, den: 1n };

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const xj = BigInt(x[j]);
        const numerator = BigInt(xValue) - xj;
        const denominator = xi - xj;
        li = multiplyFractions(li, { num: numerator, den: denominator });
      }
    }
    const term = multiplyFractions({ num: yi, den: 1n }, li);
    total = addFractions(total, term);
  }
  return simplifyFraction(total);
}

// Main function to execute the program
function main() {
  try {
    const data = JSON.parse(fs.readFileSync("input.json", "utf8"));

    const keys = data.keys;
    const n = keys.n;
    const k = keys.k;

    const x = [];
    const y = [];

    for (const key in data) {
      if (key !== "keys") {
        const point = data[key];
        const base = parseInt(point.base);
        const value = point.value;
        const xValue = parseInt(key);
        const yValue = decodeValue(base, value);
        x.push(xValue);
        y.push(yValue);
      }
    }

    const totalFraction = lagrangeInterpolation(x, y, 0);

    console.log(
      "The constant term c is:",
      totalFraction.num.toString() + "/" + totalFraction.den.toString()
    );

    // Decimal approximation (may lose precision for very large numbers)
    const decimalValue = Number(totalFraction.num) / Number(totalFraction.den);
    console.log("Decimal approximation:", decimalValue);
  } catch (error) {
    console.error(error);
  }
}

main();
