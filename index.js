import { getTopKRecommendations } from "./recommendation.js";

const form = document.querySelector("form");
const output = document.querySelector("#recommendations");

const bands = [
  "The Beatles",
  "Led Zeppelin",
  "Pink Floyd",
  "Queen",
  "The Rolling Stones",
  "Nirvana",
  "The Doors",
  "Radiohead",
  "Metallica",
  "U2",
];

const features = [
  "Rock",
  "Metal",
  "Pop",
  "Hard Rock",
  "Grunge",
  "Psicodélico",
  "Alternativo",
  "Indie",
  "Clásico",
];

const band_feats = [
  [1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0],
  [1, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 0, 1],
];

document.addEventListener("DOMContentLoaded", () => {
  for (const band of bands) {
    const div = document.createElement("div");
    div.classList.add("band");
    div.innerHTML = `
            <h6>${band}</h6>
            <div class="d-flex gap-3">
                ${new Array(features.length + 1)
                  .fill()
                  .map((_, index) => {
                    return `
                    <div class="form-check d-flex gap-2">
                        <input class="form-check-input" type="radio" data-value="${
                          index + 1
                        }" name="${band}" class="w-50 d-block" />
                        <label class="form-check-label" for="${band}">${
                      index + 1
                    }</label>
                    </div>`;
                  })
                  .join("")}
            </div>
        `;
    form.appendChild(div);
  }
  form.innerHTML += `<div class="d-flex justify-content-center w-100"><button class="btn btn-primary w-100" type="submit">Enviar</button></div>`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const user_votes = getUserVotes();
  console.log(user_votes);
  const [{ recommendations }] = getTopKRecommendations(
    user_votes,
    band_feats,
    features.length,
    features
  );
  console.log(recommendations);
  renderRecommendations(recommendations);
});

function renderRecommendations(recommendations) {
  const div = document.createElement("ol");
  div.classList.add("recommendations");
  const categories = {
    0: "gold",
    1: "silver",
    2: "bronze",
  };
  let i = 0;
  for (const recommendation of recommendations) {
    const className = "recommendation " + (categories[i] ?? "bg-info-subtle");
    div.innerHTML += `
            <li class="${className} d-flex justify-content-start align-items-center gap-2">
                <p>${i + 1}</p>
                <div class="d-flex w-100 justify-content-between align-items-center">
                  <p>${recommendation.feature}</p>
                  <p>${recommendation.value}</p>
                </div>
            </li>`;
    i += 1;
  }
  output.innerHTML = "";
  document.querySelector(".main-grid").scrollIntoView({ behavior: "smooth" });
  output.appendChild(div);
}

function getUserVotes() {
  const user_votes = [];
  for (const band of bands) {
    const radios = document.querySelectorAll(`input[name="${band}"]`);
    let i = 0;
    let added = false;
    for (const radio of radios) {
      const value = radio.getAttribute("data-value");
      if (radio.checked) {
        user_votes.push(parseInt(value));
        added = true;
      }
    }
    if (!added) user_votes.push(0);
    i++;
  }
  return user_votes;
}
