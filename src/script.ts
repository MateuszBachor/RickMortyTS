type stateType = {
  currentPage: number;
  query: string;
  params: string;
};
type charactersType = {
  id: string;
  image: string;
  name: string;
  species: string;
};

let state: stateType = {
  currentPage: 1,
  query: "",
  params: "",
};
const setState = (newState: stateType): void => {
  state = { ...state, ...newState };
  onStateChange();
};

const onStateChange = (): void => {
  getCharacter();
  updateURL();
};
getCharacter();

async function getCharacter(): Promise<void> {
  const { currentPage, query, params } = state;
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${currentPage}${query}${params}`
    );
    const characters = await response.json();
    console.log(characters);
    createCharacterComponent(characters.results);
    pagination(characters.info.pages);
  } catch (error) {
    console.log(`Ups coś poszło nie tak: ${error}`);
  }
}

const createCharacterComponent = (characterArray: []): void => {
  const charactersContainer = document.getElementById(
    "charactersContainer"
  ) as HTMLElement;
  charactersContainer.innerHTML = "";
  characterArray.forEach((character: charactersType) => {
    const characterTile = document.createElement("a") as HTMLElement;
    characterTile.setAttribute("href", `character.html?id=${character.id}`);
    characterTile.classList.add("character__Tile");
    characterTile.innerHTML = `
      <div class="character__ImgContainer">
        <img class="character__Image" src="${character.image}" alt="character image" />
      </div>
      <span class="character__Title">${character.name}</span>
      <span class="character__Species">${character.species}</span>
      `;

    charactersContainer.appendChild(characterTile);
  });
};
function updateURL(): void {
  const { currentPage, query, params } = state;
  const url = new URL(window.location.href);
  url.searchParams.set("page", currentPage.toString());
  if (query) url.searchParams.set("query", query);
  if (params) url.searchParams.set("params", params);
  window.history.pushState({}, "", url);
}

const pagination = (countPage: number): void => {
  const { currentPage, query, params } = state;
  const paginationContainer = document.getElementById(
    "pagination__Container"
  ) as HTMLElement;
  const maxVisiblePages: number = 6;
  paginationContainer.innerHTML = "";

  const startPage: number = Math.max(
    1,
    currentPage - Math.floor(maxVisiblePages / 2)
  );
  const endPage: number = Math.min(countPage, startPage + maxVisiblePages - 1);

  const renderPagination = (): void => {
    // Prev Button
    if (currentPage > 1) {
      const prevBtn = document.createElement("div");
      prevBtn.innerHTML = `<span class="pagination_NavBtn">Previous</span>`;
      paginationContainer.appendChild(prevBtn);
      prevBtn.addEventListener("click", function () {
        setState({ query, params, currentPage: currentPage - 1 });
      });
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageElem = document.createElement("div") as HTMLElement;
      pageElem.innerHTML = `<span class="pagination__Btn">${i}</span>`;
      const paginationBtn = pageElem.querySelector("span") as HTMLElement;
      if (i === currentPage) {
        paginationBtn.classList.add("active");
      }
      paginationBtn.addEventListener("click", function () {
        setState({ query, params, currentPage: i });
      });
      paginationContainer.appendChild(paginationBtn);
    }

    // Next Button
    if (currentPage < countPage) {
      const nextBtn = document.createElement("div");
      nextBtn.innerHTML = `<span class="pagination_NavBtn">Next</span>`;
      paginationContainer.appendChild(nextBtn);
      nextBtn.addEventListener("click", function () {
        setState({ query, params, currentPage: currentPage + 1 });
      });
    }
  };
  renderPagination();
};

async function searchCharacter(event: Event): Promise<void> {
  event.preventDefault();
  const searchString = document.querySelector(
    ".SearchBar__input"
  ) as HTMLInputElement;
  setState({
    currentPage: 1,
    query: "&name=",
    params: searchString.value,
  });
}
