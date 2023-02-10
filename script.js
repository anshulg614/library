window.onload = function () {
  class Book {
    constructor(name, author, numPages, isRead) {
      this.title = name;
      this.author = author;
      this.numPages = numPages;
      this.isRead = isRead;
    }
  }

  class Library {
    constructor() {
      this.books = [];
    }

    addBooks(bookie) {
      if (!this.books.some((book) => book.title == bookie.title)) {
        this.books.push(bookie);
      } else {
        console.log("You stupid bruh");
      }
    }

    removeBook(title) {
      this.books = this.books.filter((book) => title !== book.title);
    }

    getBook(title) {
      return this.books.find((book) => book.title === title);
    }

    isInLibrary(newBook) {
      return this.books.some((book) => book.title === newBook.title);
    }
  }
  const library = new Library();

  const addBook = document.getElementById("addBook");
  const bookModal = document.getElementById("bookModal");
  const userDataModal = document.getElementById("dataModal");
  const overlay = document.getElementById("overlay");
  const errorMsg = document.getElementById("errorMsg");
  const addBookForm = document.getElementById("addBookForm");
  const booksGrid = document.getElementById("booksGrid");
  const userData = document.getElementById("user-data");

  const getUserData = () => {
    let totalBooks = library.books.filter(function (Book) {
      return Book.isRead;
    }).length;
    let totalPages = library.books.reduce((total, book) => {
      return total + parseInt(book.numPages);
    }, 0);
    userDataModal.innerHTML = `
    <h3>User Data</h3>
    <p>Total Books Read: ${totalBooks}</p>
    <p>Total Pages Read: ${totalPages}</p>`;
    userDataModal.classList.add("active");
    overlay.classList.add("active");
  };

  const openAddBookModal = () => {
    addBookForm.reset();
    bookModal.classList.add("active");
    overlay.classList.add("active");
  };

  const closeAllModals = () => {
    closeAddBookModal();
    closeUserDataModal();
  };

  const closeAddBookModal = () => {
    bookModal.classList.remove("active");
    overlay.classList.remove("active");
    errorMsg.classList.remove("active");
    errorMsg.textContent = "";
  };

  const closeUserDataModal = () => {
    userDataModal.classList.remove("active");
    overlay.classList.remove("active");
  };

  const handleKeyboardInput = (e) => {
    if (e.key === "Escape") closeAllModals();
  };

  const updateBooksGrid = () => {
    restoreLocal();
    resetBooksGrid();
    for (let book of library.books) {
      createBookCard(book);
    }
  };

  const resetBooksGrid = () => {
    booksGrid.innerHTML = "";
  };

  const createBookCard = (book) => {
    console.log("dn");
    const bookCard = document.createElement("div");
    const title = document.createElement("p");
    const author = document.createElement("p");
    const pages = document.createElement("p");
    const buttonGroup = document.createElement("div");
    const readBtn = document.createElement("button");
    const removeBtn = document.createElement("button");

    bookCard.classList.add("book-card");
    buttonGroup.classList.add("button-group");
    readBtn.classList.add("buttons");
    removeBtn.classList.add("buttons");
    readBtn.onclick = toggleRead;
    removeBtn.onclick = removeBook;

    title.textContent = `"${book.title}"`;
    author.textContent = book.author;
    pages.textContent = `${book.numPages} pages`;
    removeBtn.textContent = "Remove";

    if (book.isRead) {
      readBtn.textContent = "Read";
      readBtn.classList.add("btn-light-green");
    } else {
      readBtn.textContent = "Not read";
      readBtn.classList.add("btn-light-red");
    }

    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    buttonGroup.appendChild(readBtn);
    buttonGroup.appendChild(removeBtn);
    bookCard.appendChild(buttonGroup);
    booksGrid.appendChild(bookCard);
  };

  const getBookFromInput = () => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const isRead = document.getElementById("isRead").checked;
    return new Book(title, author, pages, isRead);
  };

  const addTheBook = (e) => {
    e.preventDefault();
    const newBook = getBookFromInput();

    if (library.isInLibrary(newBook)) {
      errorMsg.textContent = "This book already exists in your library";
      errorMsg.classList.add("active");
      return;
    }
    library.addBooks(newBook);
    saveLocal();
    updateBooksGrid();
    closeAddBookModal();
  };

  const removeBook = (e) => {
    const title =
      e.target.parentNode.parentNode.firstChild.innerHTML.replaceAll('"', "");

    library.removeBook(title);
    saveLocal();
    updateBooksGrid();
  };

  const toggleRead = (e) => {
    const title =
      e.target.parentNode.parentNode.firstChild.innerHTML.replaceAll('"', "");
    const book = library.getBook(title);

    book.isRead = !book.isRead;
    saveLocal();
    updateBooksGrid();
  };

  addBook.addEventListener("click", openAddBookModal);
  overlay.addEventListener("click", closeAllModals);
  addBookForm.addEventListener("submit", addTheBook);
  window.addEventListener("keydown", handleKeyboardInput);
  userData.addEventListener("click", getUserData);

  const saveLocal = () => {
    localStorage.setItem("library", JSON.stringify(library.books));
  };

  const restoreLocal = () => {
    const books = JSON.parse(localStorage.getItem("library"));
    if (books) {
      library.books = books.map((book) => JSONToBook(book));
    } else {
      library.books = [];
    }
  };

  const JSONToBook = (book) => {
    return new Book(book.title, book.author, book.numPages, book.isRead);
  };
  updateBooksGrid();
};
