// get user data
const name = {
  first: prompt("Enter your first name:"),
  last: prompt("Enter your last name:")
};

const scores = [];

// collect scores
for (let i = 0; i < 5; i++) {
  scores.push(Number(prompt(`Enter score ${i + 1}:`)));
}

// logic function
function calculateResult(scores) {
  const sum = scores.reduce((a, b) => a + b, 0);
  const average = sum / scores.length;

  let bonus = 0;
  if (average < 50) bonus = 25;
  else if (average < 75) bonus = 10;
  else if (average < 90) bonus = 5;

  const totalScore = average + bonus;

  return {
    average,
    bonus,
    totalScore,
    status: totalScore >= 75 ? "PASS" : "FAIL"
  };
}

const result = calculateResult(scores);

// create card
const card = document.createElement("div");

card.style.width = "320px";
card.style.padding = "16px";
card.style.borderRadius = "8px";
card.style.border = "1px solid #ccc";
card.style.fontFamily = "Arial";
card.style.backgroundColor = "#f9f9f9";
card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";

card.innerHTML = `
  <h3 style="margin-top:0;">Score Summary</h3>
  <p><strong>Name:</strong> ${name.first} ${name.last}</p>
  <p><strong>Scores:</strong> ${scores.join(", ")}</p>
  <p><strong>Initial Average:</strong> ${result.average.toFixed(2)}</p>
  <p><strong>Bonus:</strong> ${result.bonus}</p>
  <p>
    <strong>Total:</strong>
    ${result.totalScore.toFixed(2)}
    (${result.average.toFixed(2)} + ${result.bonus} bonus)
  </p>
  <p><strong>Status:</strong> ${result.status}</p>
`;

// render to page
document.body.appendChild(card);
