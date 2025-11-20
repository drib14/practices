const data = [
    {
        id: 12345,
        img: "https://cdn.vectorstock.com/i/500p/46/00/male-default-placeholder-avatar-profile-gray-vector-31934600.jpg",
        firstName: "Drib",
        lastName: "Ramirez",
        age: 21,
        course: "BSIT",
        year: 3,
        saying: `"Pinaka gwapo sa IT"`
    },
    {
        id: 23456,
        img: "https://cdn.vectorstock.com/i/500p/46/00/male-default-placeholder-avatar-profile-gray-vector-31934600.jpg",
        firstName: "Jevone",
        lastName: "Palautog",
        age: 35,
        course: "BSIT",
        year: 1,
        saying: `"Ako po'y certified palautog since birth"`
    },
    {
        id: 34567,
        img: "https://cdn.vectorstock.com/i/500p/46/00/male-default-placeholder-avatar-profile-gray-vector-31934600.jpg",
        firstName: "Alexander",
        lastName: "Acojedo",
        age: 98,
        course: "BSIT",
        year: 1,
        saying: `"Wa ko kibaw nagunsa ko sa IT"`
    }
]

let strData = JSON.stringify(data)

for(let i in data) {
    console.log(data[i])
}

const container = document.getElementById("card-container");

data.forEach(item => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${item.img}" class="card-img">
    <p> <b>Student ID:</b> ${item.id}<p/>
    <h2>${item.firstName} ${item.lastName}</h2>
    <h4><b>Course:</b> ${item.course}</h4>
    <p> <b>Year:</b> ${item.year}</p>
    <p class="saying">${item.saying}<p/>
  `;

  container.appendChild(card);
});

console.log(data)