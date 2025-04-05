function isMobile() {
    return window.matchMedia("(max-width: 912px)").matches;
}

function toggleDropdown(event) {
    if (isMobile()) {
        event.preventDefault(); 

        const dropdown = event.target.closest('.dropdown');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        // Close all other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(menu => {
            if (menu !== dropdownContent) {
                menu.style.display = "none";
            }
        });

        // Toggle the current dropdown
        dropdownContent.style.display = 
            dropdownContent.style.display === "block" ? "none" : "block";
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (isMobile() && !event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(menu => {
            menu.style.display = "none";
        });
    }
});

// Attach event listener to "Our Services"
document.addEventListener("DOMContentLoaded", function() {
    const dropdownBtn = document.querySelector(".dropbtn");
    if (dropdownBtn) {
        dropdownBtn.addEventListener("click", toggleDropdown);
    }

    // Call API to fetch posts
    fetchPosts();
});

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Star Forum
function setRating(rating) {
    document.getElementById("selected-rating").innerText = "Selected Rating: " + rating + " Stars";
}

// Fetch Posts from API
async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');  // Assuming your API is located at /api/posts
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();

        // Render posts (assuming you want to display them in a container with id "posts-container")
        const postsContainer = document.getElementById("posts-container");
        if (postsContainer) {
            postsContainer.innerHTML = '';  // Clear any existing posts
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                `;
                postsContainer.appendChild(postElement);
            });
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function fetchUsers() {
    try {
        const response = await fetch('../../../users');
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        console.log("Users:", users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Call the function to test
fetchUsers();

document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    let errorMessage = '';

    if (!validateUsername(username)) {
        errorMessage += 'Username must be at least 3 characters long.<br>';
    }
    if (!validatePassword(password)) {
        errorMessage += 'Password must contain lowercase, uppercase, numbers, and special characters.<br>';
    }

    if (errorMessage) {
        showPopup(errorMessage);
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        showPopup("Username already exists!");
        return;
    }

    // Add new user
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));  // Save to localStorage

    showPopup("Sign up successful!", () => {
        window.location.href = "../../../log in page/index.html";  // Redirect to login page
    });
});

function validateUsername(username) {
    return username.length >= 3;
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    return regex.test(password);
}

function showPopup(message, callback) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.innerHTML = message;
    popup.style.display = 'block';

    if (callback) {
        setTimeout(() => {
            popup.style.display = 'none';
            callback();
        }, 1500);  // Close popup after 1.5 seconds
    } else {
        setTimeout(() => {
            popup.style.display = 'none';
        }, 1500);  // Close popup after 1.5 seconds for error messages
    }
}

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if username and password match
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Successful login, save to sessionStorage or localStorage for logged-in state
        sessionStorage.setItem("loggedInUser", username);  // Store the logged-in user
        
        showPopup("Login successful!", () => {
            window.location.href = "../../../../index.html";  // Redirect after successful login
        });
    } else {
        let errorMessage = '';
        if (!users.some(u => u.username === username)) {
            errorMessage = "Username not found!";
        } else {
            errorMessage = "Incorrect password!";
        }
        showPopup(errorMessage);
    }
});

function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

document.getElementById('submit-feedback').addEventListener('click', function(e) {
    // Prevent default form submission
    e.preventDefault();

    // Get the input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    // Check if all fields are filled
    if (name && email && feedback) {
        // Create an object to store feedback data
        const feedbackData = {
            name: name,
            email: email,
            feedback: feedback
        };

        // Save the feedback to localStorage
        let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || []; // Get existing feedback list or an empty array
        feedbackList.push(feedbackData); // Add the new feedback to the list
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList)); // Save it back to localStorage

        // Redirect to feedback.html after saving the data
        window.location.href = "feedback.html";
    } else {
        alert("Please fill in all fields.");
    }
});