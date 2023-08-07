// main.js

// Get a reference to the login form element with the ID "loginForm"
const loginForm = document.getElementById('loginForm');

// Event listener for form submission
loginForm.addEventListener('submit', async (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the values of the username and password input fields from the form
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Send a POST request to the login API endpoint
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the request header to specify JSON content
      },
      body: JSON.stringify({ username, password }), // Convert the data to JSON and include it in the request body
    });

    // Parse the response body as JSON
    const data = await response.json();

    // If login is successful (response.ok is true), store the access token in localStorage
    if (response.ok) {
      // Extract the access token from the response data
      const accessToken = data.token;

      // Store the access token in localStorage for future use
      localStorage.setItem('accessToken', accessToken);

      // Redirect the user to the book listing page 
      window.location.href = 'books.html';
    } else {
      // If login fails, display an alert with the error message received from the server
      alert(data.error);
    }
  } catch (error) {
    // If an error occurs during the fetch or parsing the response, handle it here
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});
