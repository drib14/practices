// Array problem
let numbers = [10, 20, 30, 40, 50];

// count how many numbers are greater than 25
let count = 0;
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 25) {
    count++;
  }
}

// Log the result
console.log("Count of numbers greater than 25:", count);

// sum of all even numbers in an array
let sum = 0;
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    sum += numbers[i];
  }
}
console.log("Sum of even numbers:", sum);

// find the largerst number in an array
let largest = numbers[0];
for (let i = 1; i < numbers.length; i++) {
  if (numbers[i] > largest) {
    largest = numbers[i];
  }
}
console.log("Largest number:", largest);

// check if array is sorted in ascending order
let isSorted = true;
for (let i = 1; i < numbers.length; i++) {
  if (numbers[i] < numbers[i - 1]) {
    isSorted = false;
    break;
  }
}
console.log("Is the array sorted in ascending order?", isSorted);

// Check if there's any duplicate in the array
let hasDuplicate = false;
for (let i = 0; i < numbers.length; i++) {
  for (let j = i + 1; j < numbers.length; j++) {
    if (numbers[i] === numbers[j]) {
      hasDuplicate = true;
      break;
    }
  }
  if (hasDuplicate) {
    break;
  }
}
console.log("Does the array have duplicates?", hasDuplicate);

// Check if there's any duplicate in the array (no nested loops)
let numSet = new Set();
let hasDup = false;
for (let i = 0; i < numbers.length; i++) {
  if (numSet.has(numbers[i])) {
    hasDup = true;
    break;
  }
  numSet.add(numbers[i]);
}
console.log("Does the array have duplicates? (using Set)", hasDup);
