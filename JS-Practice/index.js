// Basic DAtatypr
let name = "John Doe"; // String
// name = 'String'
// name = `String`
let age = 11; // Number
let isStudent = false; // Boolean
let address; // Undefined
let phone = null; // Null

// Complex Data Types
let hobbies = ["reading", "traveling", "swimming"]; // Array

console.log(hobbies[0]);
console.log(hobbies.length);

if(age >= 18) {
    console.log(` is an adult.`);
} else if(age === 18) {
    console.log(`is exactly 18 years old.`);
} else {
    console.log(`${name} is a minor.`);
}

for(let i = 0; i < 1000; i++) {
    console.log(`I love you`);
}

let i = 1;

while(i < 100) {
    console.log("Hello World");
    i++;
}

do {
    console.log(`${i}`);
    i++;
} while(i < 10);

// let person = { // Object
//     name: "Jane Doe",
//     age: 25,
//     isStudent: true.
// }

// console.log("JavaScript Data Types Example");
// console.log("Name:", name);
// console.log("Age:", age);
// console.log("Is Student:", isStudent);
// console.log(`${name} is ${age} years old.`);

// // Create a program that demonstrates the use of different data types in JavaScript.