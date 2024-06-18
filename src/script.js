"use strict";
let state = {
    currentPage: 1,
    query: "",
    params: "",
};
const setState = (newState) => {
    state = { ...state, ...newState };
    onStateChange();
};
const onStateChange = () => {
    getCharacter();
    updateURL();
};
getCharacter();
async function getCharacter() {
    const { currentPage, query, params } = state;
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${currentPage}${query}${params}`);
        const characters = await response.json();
        console.log(characters);
        createCharacterComponent(characters.results);
        pagination(characters.info.pages);
    }
    catch (error) {
        console.log(`Ups coś poszło nie tak: ${error}`);
    }
}
const createCharacterComponent = (characterArray) => {
    const charactersContainer = document.getElementById("charactersContainer");
    charactersContainer.innerHTML = "";
    characterArray.forEach((character) => {
        const characterTile = document.createElement("a");
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
function updateURL() {
    const { currentPage, query, params } = state;
    const url = new URL(window.location.href);
    url.searchParams.set("page", currentPage.toString());
    if (query)
        url.searchParams.set("query", query);
    if (params)
        url.searchParams.set("params", params);
    window.history.pushState({}, "", url);
}
const pagination = (countPage) => {
    const { currentPage, query, params } = state;
    const paginationContainer = document.getElementById("pagination__Container");
    const maxVisiblePages = 6;
    paginationContainer.innerHTML = "";
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(countPage, startPage + maxVisiblePages - 1);
    const renderPagination = () => {
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
            const pageElem = document.createElement("div");
            pageElem.innerHTML = `<span class="pagination__Btn">${i}</span>`;
            const paginationBtn = pageElem.querySelector("span");
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
async function searchCharacter(event) {
    event.preventDefault();
    const searchString = document.querySelector(".SearchBar__input");
    setState({
        currentPage: 1,
        query: "&name=",
        params: searchString.value,
    });
}
