let h1 = document.getElementById("heading")

const greetings = (name) => {
    return `Hi, ${name}`
}

const btnSubmit = () => {
    let inpt = document.getElementById("inpt").value
    h1.style.display="block"
    h1.innerHTML = `<h1>${greetings(inpt)}</h1>`;
}