document.querySelector('.add-to-album-btn').addEventListener('click', addPhoto);

var album = [];

window.onload = function() {
    if (localStorage.getItem('album') !==null) {
        loadLocalStorage();
    }
}

function appendCard(photo) {
    var card = document.createElement('article');
    card.classList.add('card')
    card.innerHTML = 
    `<div>${photo.title}</div>
    <img class="card-image" src="${photo.file}">
    <div>${photo.caption}</div>
    <div>trash heart</div>`
      document.querySelector('.bottom-section').prepend(card);
    }

function addPhoto() {
    var file = document.querySelector('#file').files[0];
    var title = document.querySelector('.title-input-field').value;
    var caption = document.querySelector(".caption-input-field").value;
    var photo1 = new Photos(Date.now(), title, caption, URL.createObjectURL(file), false);
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
    album.forEach(function(photo) {
         appendCard(photo);
        });
    }