let data;
const getData = async () => {
  const response = await fetch("https://ekrldev.github.io/Data/data.json");
  data = await response.json();
};
getData();

let myFavorites = {};
let foundItemsInSearch = [];

const favorites = localStorage.getItem("myFavorites");
if (favorites) {
  myFavorites = JSON.parse(favorites);
}
let isToggled = false;

//////////// ELEMENT SELECTORS ////////////
const main = document.querySelector("main");
const collageContainer = document.querySelector("#collage-container");
const toggleIcon = document.querySelector("#toggle-icon");
const homeIcon = document.querySelector("#home-icon");
const peopleBtn = document.querySelector("#people");
const navPeopleBtn = document.querySelector("#nav-people");
const speciesBtn = document.querySelector("#species");
const navSpeciesBtn = document.querySelector("#nav-species");
const starshipsBtn = document.querySelector("#starships");
const navStarshipsBtn = document.querySelector("#nav-starships");
const vehiclesBtn = document.querySelector("#vehicles");
const navVehiclesBtn = document.querySelector("#nav-vehicles");
const favoritesBtn = document.querySelector("#favorites");
const navFavoritesBtn = document.querySelector("#nav-favorites");
const bar = document.querySelectorAll("span");
const searchInput = document.getElementById("search-input");
const fullPageImg = document.getElementById("fullPageImg");
const goToTopButton = document.getElementById("goToTopButton");

//////////// HELPER FUNCTIONS ////////////
const renderHomePage = () => {
  collageContainer.className = "collage-container";
  const collectionSection = document.querySelector("#collection-container");
  if (collectionSection) {
    collectionSection.className = "collection-container-hidden";
  }
  isToggled && toggleHandler();
  clearSearchInput();
};

//Go to Top Button
const goToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const showGoToTopButton = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    goToTopButton.style.display = "block";
  } else {
    goToTopButton.style.display = "none";
  }
};

//Abort Navigation Menu
const screenTouchToggle = (e) => {
  if (e.target.id === "toggle-navigation") {
  } else if (e.target.id === "toggle-navigation-list") {
  } else if (e.target.id === "toggle-container") {
  } else if (e.target.id === "toggle-icon") {
  } else if (e.target.className === "bar") {
  } else if (e.target.className === "list-item") {
  } else {
    isToggled && toggleHandler();
  }
};

document.addEventListener("click", screenTouchToggle);

//Show Image Full Screen
const showImgFullPage = (e) => {
  let fullPageImg = e.target.parentElement.parentElement.lastChild;
  fullPageImg.className = "full-page";
  fullPageImg.style.backgroundImage = "url(" + e.target.src + ")";
  fullPageImg.style.display = "block";
};

const abortFullPageImg = (e) => {
  e.target.style.display = "none";
};

//Clear Search Input
const clearSearchInput = () => {
  searchInput.value = "";
  isToggled && toggleHandler();
  isToggled = false;
};

//Add to / Remove from Favorites
const addToFavorites = (e) => {
  const name = e.target.parentElement.lastChild.textContent;
  const collection = e.target.parentNode.parentNode.dataset.key;
  Object.keys(data).forEach((key) => {
    data[key].forEach((item) => {
      if (name === item.name) {
        if (myFavorites[key]) {
          myFavorites[key].push({ name: item.name, src: item.src });
        } else {
          myFavorites[key] = [{ name: item.name, src: item.src }];
        }
      }
    });
  });
  localStorage.setItem("myFavorites", JSON.stringify(myFavorites));
  collectionRender(collection);
};

const deleteFromFavorites = (e) => {
  const name = e.target.parentElement.lastChild.textContent;
  const collection = e.target.parentNode.parentNode.dataset.key;
  Object.keys(myFavorites).forEach((key) => {
    myFavorites[key].forEach((item) => {
      if (myFavorites[key] && item.name === name) {
        myFavorites[key] = myFavorites[key].filter(
          (item) => item.name !== name
        );
        if (myFavorites[key].length === 0) {
          delete myFavorites[key];
        }
      }
    });
  });
  localStorage.setItem("myFavorites", JSON.stringify(myFavorites));
  collectionRender(collection);
};

// Create Card
const createCard = (collectionItem) => {
  const newDiv = document.createElement("div");
  newDiv.className = "card";
  const newImg = document.createElement("img");
  newImg.src = collectionItem.src;
  newImg.alt = `${collectionItem.name} photo`;
  newDiv.appendChild(newImg);
  newImg.addEventListener("click", showImgFullPage);
  const newIcon = document.createElement("i");
  newIcon.className = "fa fa-heart-o icon";
  newIcon.addEventListener("click", addToFavorites);
  newIcon.title = "Add to Favorites";
  Object.keys(myFavorites).forEach((key) => {
    myFavorites[key].forEach((item) => {
      if (item.name === collectionItem.name) {
        newIcon.className = "fa fa-heart inFav";
        newIcon.removeEventListener("click", addToFavorites);
        newIcon.addEventListener("click", deleteFromFavorites);
        newIcon.title = "Remove";
      }
    });
  });
  newDiv.appendChild(newIcon);
  const newP = document.createElement("p");
  const newText = document.createTextNode(collectionItem.name);
  newP.appendChild(newText);
  newDiv.appendChild(newP);
  return newDiv;
};

//Render Collection Section
const collectionRender = (collection) => {
  collageContainer.className = "collage-container-hidden";
  const collectionSection = document.querySelector("#collection-container");
  if (collectionSection) {
    collectionSection.remove();
  }
  const fullPageImg = document.createElement("div");
  fullPageImg.id = "fullPageImg";
  fullPageImg.className = "full-page";
  fullPageImg.addEventListener("click", abortFullPageImg);
  const newSection = document.createElement("section");
  newSection.id = "collection-container";
  newSection.className = "collection-container";
  newSection.setAttribute("data-key", collection);
  if (collection === "favorites") {
    Object.keys(myFavorites).forEach((key) => {
      myFavorites[key].forEach((item) => {
        const newDiv = createCard(item);
        newSection.appendChild(newDiv);
      });
    });
  } else if (collection === "searchSection") {
    foundItemsInSearch.map((item) => {
      const newDiv = createCard(item);
      newSection.appendChild(newDiv);
    });
  } else {
    data[collection].map((item) => {
      const newDiv = createCard(item);
      newSection.appendChild(newDiv);
    });
  }
  newSection.appendChild(fullPageImg);
  main.appendChild(newSection);
  isToggled && toggleHandler();
};

//////////// EVENT HANDLERS /////////////////////
const collectionRenderHandler = (e) => {
  let collection = e.target.dataset.key;
  toggleHandler();
  clearSearchInput();
  collectionRender(collection);
};

const searchHandler = (e) => {
  const searchText = e.target.value.toLowerCase();
  foundItemsInSearch = [];
  Object.keys(data).map((key) => {
    data[key].map((item) => {
      if (searchText && item.name.toLowerCase().includes(searchText)) {
        foundItemsInSearch.push(item);
      }
    });
  });
  collectionRender("searchSection");
};

const toggleHandler = () => {
  if (!isToggled) {
    document.querySelector("#toggle-container").className =
      "toggle-pushed-container";
    document.querySelector("#toggle-navigation").className =
      "toggle-pushed-navigation";
    isToggled = true;
  } else {
    isToggled = false;
    document.querySelector("#toggle-container").className = "toggle-container";
    document.querySelector("#toggle-navigation").className =
      "toggle-navigation";
  }
};

////////////// EVENT LISTENERS //////////
window.addEventListener("scroll", showGoToTopButton);
homeIcon.addEventListener("click", renderHomePage);
searchInput.addEventListener("input", searchHandler);
peopleBtn.addEventListener("click", collectionRenderHandler);
speciesBtn.addEventListener("click", collectionRenderHandler);
starshipsBtn.addEventListener("click", collectionRenderHandler);
vehiclesBtn.addEventListener("click", collectionRenderHandler);
favoritesBtn.addEventListener("click", collectionRenderHandler);
toggleIcon.addEventListener("click", toggleHandler);
navPeopleBtn.addEventListener("click", collectionRenderHandler);
navSpeciesBtn.addEventListener("click", collectionRenderHandler);
navStarshipsBtn.addEventListener("click", collectionRenderHandler);
navVehiclesBtn.addEventListener("click", collectionRenderHandler);
navFavoritesBtn.addEventListener("click", collectionRenderHandler);
goToTopButton.addEventListener("click", goToTop);
