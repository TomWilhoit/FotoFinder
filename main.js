document.querySelector('.add-to-album-btn').addEventListener('click', addPhoto);
document.querySelector('.view-fav-btn').addEventListener('click', filterFavorites)
var album = [];

document.querySelector('.bottom-section').addEventListener('click',function(event) {
    if (event.target.classList.contains('delete-button')) {
        getIdforDeletion(event)
    }else if (event.target.classList.contains('fav-button')){
        favoriteCard(event)
    }
});



window.onload = function() {
    if (localStorage.getItem('album') !==null) {
        loadLocalStorage();
    }
}

function appendCard(photo) {
    var card = document.createElement('article');
    card.classList.add('card');
    card.dataset.name = photo.id;
    card.innerHTML = 
    `<div class="photo-title" dataset-name="${photo.id}">${photo.title}</div>
    <img class="card-image" src="${photo.file}">
    <div class="photo-caption">${photo.caption}</div>
    <div class="card-icons"><button class="delete-button"><button class="fav-button"></div>`
      document.querySelector('.bottom-section').prepend(card);
   
    ;
    }


function addPhoto() {
    var file = document.querySelector('#file').files[0];
    var title = document.querySelector('.title-input-field').value;
    var caption = document.querySelector(".caption-input-field").value;
    var photo1 = new Photos(Date.now(), title, caption, URL.createObjectURL(file), false);
    console.log('yo')
    photo1.saveToStorage();

    appendCard(photo1); 
    album.push(photo1);
    photo1.saveToStorage(album);

}

function loadLocalStorage() {
    album = JSON.parse(localStorage.getItem('album'));
    album = album.map(function(photo) {
        photo = new Photos(photo.id,photo.title, photo.caption, photo.file, photo.favorite); 
        return photo;
    });
    album.forEach(function(photo, index) {
         appendCard(photo);
         favoriteIcon(photo)
        });
}

function getIdforDeletion(event) {
     var cardId = parseInt(event.target.closest('article').dataset.name);
     deleteCard(event, cardId)
     }


function deleteCard(event, cardId) {
    var index = album.findIndex(function(photo) {
        return photo.id === cardId;
    });

    album[index].deleteFromStorage(album, index);
    event.target.closest('article').remove();
} 

function favoriteCard(event) {
    var cardId = parseInt(event.target.closest('article').dataset.name);
    var index = album.findIndex(function(photo) {
        return photo.id === cardId;
    });
    album[index].updatePhoto(!album[index].favorite, album);
    favoriteIcon(album[index]);
}

function favoriteIcon(photo) {
    if (photo.favorite === true) {
    document.querySelector(`.card[data-name="${photo.id}"] .fav-button`).style.backgroundImage = "url('images/favorite-active.svg')";
    } else {
     document.querySelector(`.card[data-name="${photo.id}"] .fav-button`).style.backgroundImage = "url('images/favorite.svg')";
    }
};

function filterFavorites() {
    var favoritePhotos = album.filter(function(photo) {
    return photo.favorite
    });
    document.querySelector(".bottom-section").innerHTML = '';
    favoritePhotos.forEach(function(photo,index) {
        appendCard(photo);
        favoriteIcon(photo);
    });

 }
