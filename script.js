const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const scrollToTopButton = document.getElementById('scrollToTop');
const oupsError = document.getElementById('oups-error');
let photosArray = [];
let themePhotos = "";

// Unsplash API
let count = 4;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
const proxyUrl = 'https://obscure-harbor-43761.herokuapp.com/';
// Exception -- avoid storing API Key here
const apiKey = 'jFgS8tteGD425f4oZfygQVaVnD6gt6GucN2yyz3xFek';
let apiUrl = "";

function setApiUrl() {
  apiUrl = `${proxyUrl}https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}&query=${themePhotos}`; 
  console.log("utilisation fonction setApiUrl avec l'adresse : " + apiUrl) ;
}

// on vérifie si toutes les images sont bien chargées
function imageLoaded() {
  imagesLoaded++;
  console.log("image loaded");
  if (imagesLoaded === totalImages) {
    console.log("ready = true");
    ready = true;
    loader.hidden = true;
    imageContainer.hidden = false;
    count = 20;
    setApiUrl();
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
    const itemImage = document.createElement('div');
    itemImage.classList.add('item-image'); 
    itemImage.classList.add('hvr-grow');

    const linkedImage = document.createElement('a');

    setAttributes(linkedImage, {
        href: photo.links.html,
        target: '_blank',
      });
    linkedImage.classList.add('linked-image');

    // création de l'image
    const img = document.createElement('img');

    setAttributes(img, {
        src: photo.urls.regular,
        alt: photo.alt_description,
        title: photo.alt_description,
      });
    // ajout de l'event listener pour s'assurer que l'image est chargée
    img.addEventListener('load', imageLoaded);

    // creation d'un descriptif
    const descriptionImage = document.createElement('div');
    descriptionImage.classList.add('description-image');
    let titrePhoto = "";
    if (!photo.location.name) {
      titrePhoto = document.createTextNode("@" + photo.user.username + " - Unknown location");
    } else {
      titrePhoto = document.createTextNode("@" + photo.user.username + " - " + photo.location.name);  
    }
   
    // on ajoute ces éléments au container
    descriptionImage.appendChild(titrePhoto);
    linkedImage.appendChild(img);
    itemImage.appendChild(linkedImage);
    itemImage.appendChild(descriptionImage);
    imageContainer.appendChild(itemImage);
    });
}


// Get photos from Unsplash API
async function getPhotos() {
    
    // on enlève l'eventuelle erreur de chargement qui aurait pu être là précédemment
    oupsError.hidden = true;

    try {
      const response = await fetch(apiUrl);
      photosArray = await response.json();
      console.log(photosArray);
      displayPhotos();
    } catch (error) {
      // Catch Error Here
      console.log(error);
      // on commence par retirer tous les éléments du container, en cas de nouvelle erreur
      while (oupsError.firstChild) {
        oupsError.removeChild(oupsError.firstChild);
      }
      // on créé les éléments à ajouter au container
      const iconError = document.createElement('i');
      iconError.classList.add('fas' , 'fa-exclamation-circle' , 'fa-5x');
      const h2Error = document.createElement('h2');
      const textError = document.createTextNode("Oups... Something went wrong... we've probably asked too much to the API, please try again later ;-)");
      h2Error.appendChild(textError);
      oupsError.appendChild(iconError);
      oupsError.appendChild(h2Error);
      loader.hidden = true;
      oupsError.hidden = false;
    }
  }


// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }

  // check if we have move to the bottom, and show to 'scrool to the top' button

  if (window.scrollY >= 500) {
    scrollToTopButton.hidden = false;
  } else {
    scrollToTopButton.hidden = true;
  }


});


// si sélection d'un thème

function selectionTheme() {
  console.log("Sélection du thème : " + this.value);
  loader.hidden = false;
  imageContainer.hidden = true;
  while (imageContainer.firstChild) {
    imageContainer.removeChild(imageContainer.firstChild);
  }
  themePhotos = this.value;
  count = 4;
  setApiUrl();
  getPhotos();

}

document.getElementById("slct").onchange = selectionTheme;


  // On Load
  imageContainer.hidden = true;
  setApiUrl();
  getPhotos();
