const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
let photosArray = [];
let themePhotos = "travel";

// Unsplash API
let count = 4;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
// Normally, don't store API Keys like this, but an exception made here because it is free, and the data is publicly available!
const apiKey = 'jFgS8tteGD425f4oZfygQVaVnD6gt6GucN2yyz3xFek';
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}&query=${themePhotos}`;

// on vérifie si toutes les images sont bien chargées
function imageLoaded() {
  imagesLoaded++;
  console.log("image loaded");
  if (imagesLoaded === totalImages) {
    console.log("ready = true");
    ready = true;
    loader.hidden = true;
    count = 20;
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}&query=${themePhotos}`;
  }
}


// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  }

function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach( (photo) => {

    // Création du lien vers le site unsplash
    const item = document.createElement('a');
    // item.setAttribute('href', photo.links.html);
    // item.setAttribute('target', '_blank');
    setAttributes(item, {
        href: photo.links.html,
        target: '_blank',
      });

    // création de l'image
    const img = document.createElement('img');
    // img.setAttribute('src', photo.urls.regular);
    // img.setAttribute('alt', photo.alt_description);
    // img.setAttribute('title', photo.alt_description);
    setAttributes(img, {
        src: photo.urls.regular,
        alt: photo.alt_description,
        title: photo.alt_description,
      });

    // ajout de l'event listener pour s'assurer que l'image est chargée
    img.addEventListener('load', imageLoaded);
    // on ajoute ces éléments au container
    item.appendChild(img);
    imageContainer.appendChild(item);
    });
}


// Get photos from Unsplash API
async function getPhotos() {
    // loader.hidden = false;
    try {
      const response = await fetch(apiUrl);
      photosArray = await response.json();
      console.log(photosArray);
      displayPhotos();
    } catch (error) {
      // Catch Error Here
      console.log(error);
    }
  }


// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
});

// si sélection d'un thème

function selectionTheme() {
  //changedText.textContent = this.value;
  console.log("Sélection du thème : " + this.value);
  loader.hidden = false;
  while (imageContainer.firstChild) {
    imageContainer.removeChild(imageContainer.firstChild);
  }
  themePhotos = this.value;
  count = 4;
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}&query=${themePhotos}`;
  getPhotos();

}

document.getElementById("slct").onchange = selectionTheme;


  // On Load

  getPhotos();
