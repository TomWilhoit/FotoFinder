var album = [];

document.querySelector('.top-section').addEventListener('input', disableAddButton);

document.querySelector('.bottom-section').addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && event.target.closest('.card') !== null) {
    saveCardEdit(event);
  }
});

document.querySelector('.search-input').addEventListener('keyup', search);

document.querySelector('.add-to-album-btn').addEventListener('click', addPhoto);

document.querySelector('.view').addEventListener('click', function(event) {
  if (event.target.classList.contains('view-all-btn')) {
    showAll();
    updateFavCounter();
  } else if (event.target.classList.contains('view-fav-btn')) {
    filterFavorites();
  }
});

document.querySelector('.show').addEventListener('click', function(event) {
  if (event.target.classList.contains('show-more')) {
    showMore(event);
  } else if (event.target.classList.contains('show-less')) {
    showTen(event);
  } 
});

document.querySelector('.bottom-section').addEventListener('click',function(event) {
  if (event.target.classList.contains('delete-button')) {
    getIdforDeletion(event);
  } else if (event.target.classList.contains('fav-button')) {
    favoriteCard(event);
  } else if (event.target.closest('.card')!==null) {
    event.target.onblur = saveCardEdit;
  }
});

window.onload = function() {
  addPhotoMessage();
  if (localStorage.getItem('album') !==null) {
    loadLocalStorage();
    disableAddButton();
  }
}

function appendCard(photo) {
  var card = document.createElement('article');
  card.classList.add('card');
  card.dataset.name = photo.id;
  card.innerHTML = 
    `<div class="photo-title" contenteditable="true">${photo.title}</div>
    <img class="card-image" src="${photo.file}">
    <div class="photo-caption" contenteditable="true">${photo.caption}</div>
    <div class="card-icons"><button class="delete-button"><button class="fav-button"></div>`;
  document.querySelector('.bottom-section').prepend(card);
  addPhotoMessage();
}

function addPhoto() {
  var file = document.querySelector('#file').files[0];
  var title = document.querySelector('.title-input-field').value;
  var caption = document.querySelector(".caption-input-field").value;
  var photo1 = new Photos(Date.now(), title, caption, URL.createObjectURL(file), false);
  appendCard(photo1); 
  album.push(photo1);
  photo1.saveToStorage(album);
  document.querySelector(".caption-input-field").value = '';
  document.querySelector(".title-input-field").value = '';
  document.querySelector('#file').value = '';
  disableAddButton();
}

function loadLocalStorage() {
  album = JSON.parse(localStorage.getItem('album'));
  album = album.map(function(photo) {
    photo = new Photos(photo.id,photo.title, photo.caption, photo.file, photo.favorite); 
    return photo;
  });
  album.forEach(function(photo, index) {
    if (index >= album.length - 10) {
      appendCard(photo);
      favoriteIcon(photo);
    }
  });
}

function getIdforDeletion(event) {
  var cardId = parseInt(event.target.closest('article').dataset.name);
  deleteCard(event, cardId);
}

function deleteCard(event, cardId) {
  var index = album.findIndex(function(photo) {
    return photo.id === cardId;
  }); 
  album[index].deleteFromStorage(album, index);
  event.target.closest('article').remove();
  updateFavCounter();
  addPhotoMessage();
} 

function favoriteCard(event) {
  var cardId = parseInt(event.target.closest('article').dataset.name);
  var index = album.findIndex(function(photo) {
    return photo.id === cardId;
  });
  album[index].updatePhoto(!album[index].favorite, album, album[index].title, album[index].caption);
  favoriteIcon(album[index]);
  updateFavCounter();
}

function favoriteIcon(photo) {
  if (photo.favorite === true) {
    document.querySelector(`.card[data-name="${photo.id}"] .fav-button`).style.backgroundImage = "url('images/favorite-active.svg')";
  } else {
    document.querySelector(`.card[data-name="${photo.id}"] .fav-button`).style.backgroundImage = "url('images/favorite.svg')";
  }
}

function updateFavCounter() {
  var favoritePhotos = album.filter(function(photo) {
    return photo.favorite;
  });
  var favCount = favoritePhotos.length;
  document.querySelector(".view-fav-btn").innerText = `View ${favCount} favorites`;
}

function filterFavorites() {
  var favoritePhotos = album.filter(function(photo) {
    return photo.favorite;
  });
  document.querySelector(".bottom-section").innerHTML = '';
  favoritePhotos.forEach(function(photo) {
    appendCard(photo);
    favoriteIcon(photo);
  });
}

function showAllButton() {
  document.querySelector(".view-fav-btn").innerText = 'View all';
  document.querySelector(".view-fav-btn").classList.replace('view-fav-btn','view-all-btn');
}

function showAll() {
  document.querySelector(".view-all-btn").classList.replace('view-all-btn','view-fav-btn');
  document.querySelector(".bottom-section").innerHTML = '';
  album.forEach(function(photo) {
    appendCard(photo);
    favoriteIcon(photo)
  });
}

function search(event) {
  event.preventDefault();
  if (document.querySelector(".view-fav-btn") === null) {
    var searchedAlbum = album.filter(function(photo) {
      return photo.favorite;
    });
  } else {
    var searchedAlbum = album;
  }
  var searchInput = document.querySelector('.search-input').value.toUpperCase();
  var filteredPhotos = searchedAlbum.filter(function(photo) {
    var upperCaseTitle = photo.title.toUpperCase();
    var upperCaseCaption = photo.caption.toUpperCase();
    return upperCaseTitle.includes(searchInput) || upperCaseCaption.includes(searchInput);
  });
  document.querySelector('.bottom-section').innerHTML = '';
  filteredPhotos.forEach(function(eachPhoto) {
    appendCard(eachPhoto);
    favoriteIcon(eachPhoto);
  });
}

function saveCardEdit(event) {
  var cardId = parseInt(event.target.closest('article').dataset.name);
  var index = album.findIndex(function(photo) {
    return photo.id === cardId;
  });
  var title = document.querySelector(`.card[data-name="${album[index].id}"] .photo-title`).innerText;
  var caption = document.querySelector(`.card[data-name="${album[index].id}"] .photo-caption`).innerText;
  album[index].updatePhoto(album[index].favorite, album, title, caption);
}

function disableAddButton() {
  if (document.querySelector(".caption-input-field").value === '' || document.querySelector('.title-input-field').value === '' || document.querySelector('#file').files.length === 0) {
    document.querySelector('.add-to-album-btn').disabled = true;
  } else {
    document.querySelector('.add-to-album-btn').disabled = false;
  }
}

function addPhotoMessage() {
  if (localStorage.getItem('album') === null || localStorage.getItem('album') === '[]') {
    var photoMessage = document.createElement('h2');
    photoMessage.classList.add('h2');
    photoMessage.innerText = "Share a photo with friends!";
    document.querySelector('.bottom-section').prepend(photoMessage);
  } else if (document.querySelector('.h2')!==null) { 
    document.querySelector('.h2').remove();
  }
}

function showMore (event) {
  if (document.querySelector('.view-fav-btn') === null) {
    currentArray = album.filter(function(photo) {
      return (photo.favorite === true);
    });
  } else {
    currentArray = album;
  }
  document.querySelector('.bottom-section').innerHTML = '';
  currentArray.forEach(function(photo) {
    appendCard(photo);
    favoriteIcon(photo);
  });
  event.target.innerText = 'Show Less';
  event.target.classList.replace('show-more','show-less');
}

function showTen(event) {
  if (document.querySelector('.view-fav-btn') === null) {
    currentArray = album.filter(function(photo) {
    return (photo.favorite === true);
    });
  } else {
    currentArray = album;
  }
  document.querySelector('.bottom-section').innerHTML = '';
  currentArray.forEach(function(photo, index) {
    if (index >= currentArray.length - 10) {
      appendCard(photo);
      favoriteIcon(photo);
    }
  });
  event.target.innerText = 'Show More';
  event.target.classList.replace('show-less','show-more');
}