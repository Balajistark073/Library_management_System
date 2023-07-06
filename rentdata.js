const searchInput = document.getElementById('searchInput');
const suggestionList = document.getElementById('suggestionList');

searchInput.addEventListener('input', function() {
  const searchTerm = searchInput.value.trim();

  fetchBookSuggestions(searchTerm)
    .then(suggestions => {
      suggestionList.innerHTML = ''; // Clear previous suggestions

      suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        suggestionList.appendChild(option);
      });
    })
    .catch(error => {
      console.error(error);
    });
});

function fetchBookSuggestions(searchTerm) {
  return new Promise((resolve, reject) => {
    // Replace this code with your own implementation to fetch book suggestions based on the search term
    // You can make an API call or use a local data source
    const suggestions = ['Book 1', 'Book 2', 'Book 3']; // Example suggestions

    resolve(suggestions);
  });
}

// Function to truncate the description text to a specified number of lines
function truncateDescription(description, lineLimit) {
  const lines = description.split('\n').filter(line => line.trim() !== ''); // Split description by line breaks and remove empty lines
  const truncatedLines = lines.slice(0, lineLimit); // Select the specified number of lines
  const truncatedDescription = truncatedLines.join('\n'); // Join the truncated lines

  // Add ellipsis if the original description exceeds the line limit
  if (lines.length > lineLimit) {
    return truncatedDescription.trim() + '...';
  }

  return truncatedDescription.trim(); // Trim whitespace
}

// Function to fetch books from the Google Books API based on user input
function fetchBooks(query, startIndex) {
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=10`)
    .then(response => response.json())
    .then(data => {
      const bookListElement = document.getElementById('bookList');

      // Iterate over the book data and generate HTML elements to display the book information
      data.items.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');

        // Extract relevant book details from the data
        const title = book.volumeInfo.title;
        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
        const description = book.volumeInfo.description ? book.volumeInfo.description : 'No description available';
        const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';

        // Truncate the description to 2 lines
        const truncatedDescription = truncateDescription(description, 2);

        // Create HTML structure to display the book information with the truncated description
        bookElement.innerHTML = `
          <img src="${imageUrl}" alt="${title}">
          <h3>${title}</h3>
          <p>Author: ${author}</p>
          <p>${truncatedDescription}</p>
          <button class="rentButton" onclick="addToCart('${title}', '${imageUrl}')">Rent</button>
        `;

        bookListElement.appendChild(bookElement);
      });
      function addToCart(title, imageUrl) {
        // Create an object with the book information
        const book = {
          title: title,
          imageUrl: imageUrl
        };
      
        // Add the book to the cartItems array
        cartItems.push(book);
      
        // Display a success message
        alert(`${title} has been added to the cart!`);
      
        // Optional: Update the UI to reflect the added book in the cart
        // You can implement this based on your UI design
      
        // Optional: Clear the search input and suggestion list
        searchInput.value = '';
        suggestionList.innerHTML = '';
      }
      

      // Check if there are more books to load
      if (startIndex + data.items.length < data.totalItems) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.classList.add('loadMoreButton');
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.addEventListener('click', function() {
          loadMoreBooks(query, startIndex + 10);
        });
        bookListElement.appendChild(loadMoreButton);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

// Function to load more books from the Google Books API
function loadMoreBooks(query, startIndex) {
  const loadMoreButton = document.querySelector('.loadMoreButton');
  loadMoreButton.textContent = 'Loading...';
  loadMoreButton.disabled = true;

  fetchBooks(query, startIndex);
}

// Function to add the selected book to the cart
function addToCart(title, imageUrl) {
  // Get the cart data from local storage or initialize an empty array
  const cartData = JSON.parse(localStorage.getItem('cart')) || [];

  // Create an object with the book information
  const book = {
    title: title,
    imageUrl: imageUrl
  };

  // Add the book to the cart data
  cartData.push(book);

  // Store the updated cart data in local storage
  localStorage.setItem('cart', JSON.stringify(cartData));

  // Redirect to the cart.html page
  window.location.href = 'cart.html';
}

// Event listener for search button click
document.getElementById('searchButton').addEventListener('click', function() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.trim();

  if (query !== '') {
    const bookListElement = document.getElementById('bookList');
    bookListElement.innerHTML = ''; // Clear previous book results

    fetchBooks(query, 0);
  }
});

// Event listener for enter key press in the search input field
document.getElementById('searchInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (query !== '') {
      const bookListElement = document.getElementById('bookList');
      bookListElement.innerHTML = ''; // Clear previous book results

      fetchBooks(query, 0);
    }
  }
});
