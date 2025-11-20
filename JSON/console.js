// JSON

let data = [
    {
        id: 1,
        fName: "Drib",
        lName: "Ramirez"
    },
    {
        id: 2,
        fName: "Jefferson",
        lName: "Ramirez"
    },
    {
        id: 3,
        fName: "Jayson",
        lName: "Ramirez"
    },
    {
        id: 4,
        fName: "Jaymar",
        lName: "Ramirez"
    },
    {
        id: 5,
        fName: "Sheikha",
        lName: "Ramirez"
    }
]

// display all JSON data in Object
for (i in data) {
    console.log(data[i])
}

// display all JSON in strings
let strJSON = JSON.stringify(data)
console.log(strJSON)

let obj = {
    tool1: "paper",
    tool2: "pen",
    tool3: "bag"
}

// displays both keys and values
for(let j in obj) {
    console.log(`${j}:${obj[j]}`)
}

let keys = Object.keys(obj)

// displays all keys
for(let k in keys) {
    console.log(keys[k])
}

// initializing objects
let grade = {
    pe: 90,
    math: 85,
    hist: 70,
    comp: 97
}

let ave = 0

// displaying objects and calculating average
for(dispGrade in grade) {
    console.log(`${dispGrade}: ${grade[dispGrade]}`)
    ave += grade[dispGrade]
}

ave /= Object.keys(grade).length

console.log(`Average: ${ave}`)