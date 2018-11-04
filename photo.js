class Photos {
    constructor(id, title, caption, file, favorite) {
        this.id = id;
        this.title = title;
        this.caption = caption;
        this.file = file || Blob;
        this.favorite = favorite;
    }

    saveToStorage(album) {
        localStorage.setItem('album', JSON.stringify(album));
    }

    deleteFromStorage() {

    }

    updatePhoto() {

    }


}





