// Add a test message
fetch('/api/DIYHomes/forum', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userId: 1,
        userName: "Test User",
        content: "This is a test message for the forum!"
    })
})
.then(response => response.json())
.then(data => console.log('Message created:', data))
.catch(error => console.error('Error:', error));

// Add a reply to the message
fetch('/api/DIYHomes/forum/reply', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        messageId: 1,
        userId: 2,
        userName: "Admin User",
        content: "This is a test reply from the admin!"
    })
})
.then(response => response.json())
.then(data => console.log('Reply created:', data))
.catch(error => console.error('Error:', error));