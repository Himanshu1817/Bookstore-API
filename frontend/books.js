// Wait for the DOM (HTML) to load before executing the code inside this function
document.addEventListener('DOMContentLoaded', async () => {
    // Get the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');
  
    // Check if the access token does not exist
    if (!accessToken) {
      // If the access token does not exist, redirect the user to the login page
      window.location.href = 'login.html';
    } else {
      // If the access token exists, try to fetch the book data from the API
      try {
        // Send a GET request to the /api/books endpoint with the access token in the Authorization header
        const response = await fetch('http://localhost:3000/books/books', {
          headers: { Authorization: `${accessToken}` },
        });
  
        // Parse the response body as JSON
        const books = await response.json();
  
        // Get the table body element with the ID "bookList" to insert the book data
        const bookList = document.getElementById('bookList');
  
        // Loop through each book in the "books" array and create a table row with the book details
        books.forEach((book) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.price}</td>
            <td>${book.stock}</td>
          `;
          bookList.appendChild(row);
        });
      } catch (error) {
        // If an error occurs during the fetch or parsing the response, handle it here
        console.error('Error:', error);
        alert('An error occurred while fetching books. Please try again.');
      }
    }
  });
  