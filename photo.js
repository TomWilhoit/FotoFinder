class Photos {
  constructor(id, title, caption, file, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file || Blob;
    this.favorite = favorite || false;
  }

  saveToStorage(album) {
    localStorage.setItem('album', JSON.stringify(album));
  }
  
  deleteFromStorage(album, index) {
    album.splice(index, 1);
    this.saveToStorage(album);
  }
  
  updatePhoto(isFavorite, album, title, caption) {
    this.favorite = isFavorite;
    this.title = title;
    this.caption = caption;
    this.saveToStorage(album);
  }
};





