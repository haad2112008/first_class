const dataContainer = document.getElementById('dataContainer');
const searchBar = document.getElementById('searchBar');
let allPosts = []; // Local storage for API data

// 1. Make API call to server
async function fetchData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        allPosts = await response.json();
        
        // Initial render (Mapping over all data)
        displayData(allPosts);
    } catch (error) {
        dataContainer.innerHTML = '<p style="color:red">Error loading data.</p>';
        console.error("Fetch error:", error);
    }
}

// 2. Map over data and display on webpage
function displayData(posts) {
    // Clear current content
    dataContainer.innerHTML = '';

    if (posts.length === 0) {
        dataContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    // Creating HTML elements for each post
    posts.map(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post-card');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        `;
        dataContainer.appendChild(postElement);
    });
}

// 3. Filter Functionality
searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    const filteredPosts = allPosts.filter((post) => {
        return post.title.toLowerCase().includes(searchString);
    });

    displayData(filteredPosts);
});

// Initialize
fetchData();