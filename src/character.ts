document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const characterId: string | null = urlParams.get("id");
  if (characterId) getCharacterDetails(characterId);
});

async function getCharacterDetails(id: string) {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${id}`
    );
    const characterDetails: characterType = await response.json();
    createCharacterDetailsComponent(characterDetails);
    console.log(characterDetails);
    console.log(typeof characterDetails.id);
    characterDetails.episode.forEach((e: string) => {
      getEpisodeInfo(e);
    });
  } catch {
    console.log("Ups... coś poszło nie tak");
  }
}
async function getEpisodeInfo(url: string) {
  try {
    const response = await fetch(`${url}`);
    const episodeInfo = await response.json();
    createEpisodeListComponent(episodeInfo);
  } catch {
    console.log("Ups... coś poszło nie tak");
  }
}
function setImg() {
  console.log("asd");
}

function createCharacterDetailsComponent(character: characterType) {
  const characterDetailsContainer = document.getElementById(
    "character__container"
  ) as HTMLElement;
  const characterDetailsImg = document.createElement("img") as HTMLImageElement;

  if (character.image) {
    characterDetailsImg.src = character.image;
    characterDetailsImg.alt = "img character";
    characterDetailsImg.onerror = function () {
      this.src =
        "https://static.vecteezy.com/system/resources/previews/004/639/366/non_2x/error-404-not-found-text-design-vector.jpg";
      console.log("Img not found");
    };
  } else {
    characterDetailsImg.src =
      "https://static.vecteezy.com/system/resources/previews/004/639/366/non_2x/error-404-not-found-text-design-vector.jpg";
    characterDetailsImg.alt = "img not found";
  }

  characterDetailsImg.classList.add("characterInfo__img");

  characterDetailsContainer.appendChild(characterDetailsImg);

  const characterInfoHTML = `
  <span class="characterInfo__span-name">${character.name}</span>
  <span class="characterInfo__span">Gender: ${character.gender}</span>
  <span class="characterInfo__span">Status: ${character.status}</span>
  <span class="characterInfo__span">Location: ${character.location.name}</span>
  <h3>Episode list:</h3>
`;

  characterDetailsContainer.innerHTML += characterInfoHTML;
  const characterEpisodeContainer = document.createElement(
    "div"
  ) as HTMLElement;
  characterEpisodeContainer.classList.add("chracterEpisode__container");
  characterDetailsContainer.appendChild(characterEpisodeContainer);
}

function createEpisodeListComponent(episode: episodeType) {
  const characterEpisodeContainer = document.querySelector(
    ".chracterEpisode__container"
  ) as HTMLElement;
  const characterEpisodeElem = document.createElement("div") as HTMLElement;
  characterEpisodeElem.classList.add("chracterEpisode__title");
  characterEpisodeElem.innerHTML = `${episode.episode} - ${episode.name}`;
  characterEpisodeContainer.appendChild(characterEpisodeElem);
}

/* TS TYPES */
type episodeType = {
  episode: string[];
  name: string;
};

type characterType = {
  id: number;
  image: string | null | undefined;
  name: string;
  location: { name: string };
  gender: string;
  status: string;
  episode: string[];
};
