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
        const response = await fetch('/api/DIYHomes/forum');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const posts = data.posts;

        // Render posts
        const postsContainer = document.getElementById("posts-container");
        if (postsContainer) {
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.userName}</h3>
                    <p>${post.content}</p>
                    <small>${new Date(post.createdAt).toLocaleString()}</small>
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
        const response = await fetch('http://localhost:3000/api/users');
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
        window.location.href = "login.html";  // Redirect to login page
    });
});

function validateUsername(username) {
    return username.length >= 3;
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    return regex.test(password);
}

// Handle Forum Form Submission
document.getElementById('forum-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;

    try {
        const response = await fetch('/api/DIYHomes/forum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `Rating: ${rating} stars\nFeedback: ${feedback}`,
                userId: email, // Using email as userId for now
                userName: name
            })
        });

        if (!response.ok) {
            throw new Error('Failed to submit post');
        }

        const data = await response.json();
        showPopup('Post submitted successfully!');
        
        // Clear form
        document.getElementById('forum-form').reset();
        document.getElementById('selected-rating').innerText = 'Selected Rating: 0 Stars';
        
        // Refresh posts
        fetchPosts();
    } catch (error) {
        console.error('Error submitting post:', error);
        showPopup('Failed to submit post. Please try again.');
    }
});

// Popup functions
function showPopup(message, callback) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.innerHTML = message;
    popup.style.display = 'block';
    
    if (callback) {
        setTimeout(callback, 2000);
    }
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}