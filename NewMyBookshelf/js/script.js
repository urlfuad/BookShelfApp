const books = [];
const RENDER_EVENT = 'render-book';
const SAVE_EVENT = 'save-book';
const BOOKSTORAGE = 'BOOKAPPS';


document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();

    });
    if (isStorage()) {
        loadDataStorage();
    }
});

function saveData() {
    if (isStorage()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(BOOKSTORAGE, parsed);
        document.dispatchEvent(new Event(SAVE_EVENT));
    }

}
function isStorage() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}
document.addEventListener(SAVE_EVENT, function () {
    console.log(localStorage.getItem(BOOKSTORAGE));

});
function loadDataStorage() {
    const serializedData = localStorage.getItem(BOOKSTORAGE);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// cari buku
document.getElementById('searchSubmit').addEventListener("click", function (event) {
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.inner > h2');
    for (const books of bookList) {
        if (searchBook !== books.innerText.toLowerCase()) {
            books.parentElement.parentElement.style.display = "none";
        } else {
            books.parentElement.parentElement.style.display = "block";
        }
    }
    // alert('oke');

});
// const cariBuku = document.getElementById('searchSubmit').value.toLowerCase();
// cariBuku.addEventListener('click', function (event) {
//     event.preventDefault();
//     const cariJudul = document.getElementById('searchBookTitle');
//     const judulTarget = document.querySelectorAll('h2');
//     // const cariJudul = e.target.value.toLowerCase();
//     for (const judulTarget of books) {
//         if (judulTarget.includes !== cariJudul) {
//             alert('oke');
//         }
//     }
//     return null;

// });

//fungsi addBook
function addBook() {
    const textTitle = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const timestamp = document.getElementById('date').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    if (isComplete == true) {
        addBookFromCompleted();
    } else {
        undoBookFromCompleted();
    }


    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, timestamp, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();


}

function generateId() {
    return +new Date();
}

function generateBookObject(id, judul, penulis, timestamp, isCompleted) {
    return {
        id,
        judul,
        penulis,
        timestamp,
        isCompleted
    }
}

//fungsi Dom makeBook
function makeBook(bookObject) {
    const textJudul = document.createElement('h2');
    textJudul.innerText = bookObject.judul;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = bookObject.penulis

    const textTahun = document.createElement('p');
    textTahun.innerText = bookObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textJudul, textPenulis, textTahun);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);


    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            let konfirmasi = confirm('yakin ingin menghapus buku ???');
            if (konfirmasi) {
                removeBookFromCompleted(bookObject.id);
            }
        });
        container.append(undoButton, trashButton);

    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function () {
            addBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            let konfirmasi = confirm('yakin ingin menghapus buku ???');
            if (konfirmasi) {
                removeBookFromCompleted(bookObject.id);
            }

        });
        container.append(checkButton, trashButton);
    }

    return container;
}

function addBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}
function removeBookFromCompleted(bookId) {

    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id == bookId) {
            return bookItem;
        }
    }
    return null;
}
function findBookIndex(bookId) {
    for (const indexItem in books) {
        if (books[indexItem].id === bookId) {
            return indexItem;
        }
    }
    return -1;
}

document.addEventListener(RENDER_EVENT, function () {
    // console.log(books);
    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('complete-books');
    completedBOOKList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});

