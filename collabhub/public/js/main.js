// Load featured projects on homepage
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/profiles/projects');
    const projects = await response.json();
    displayProjects(projects.slice(0, 3)); // Show first 3 projects as featured
  } catch (error) {
    console.error('Error loading projects:', error);
  }

  // Setup search form
  const searchForm = document.querySelector('form');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  }
});

function displayProjects(projects) {
  const container = document.getElementById('featured-projects');
  if (!container) return;

  container.innerHTML = projects.map(project => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
      <div class="p-6">
        <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
        <p class="text-gray-600 mb-4">${project.description}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${project.skills_needed.map(skill => `
            <span class="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">${skill}</span>
          `).join('')}
        </div>
        <a href="projects.html" class="text-green-500 hover:text-green-700 font-medium">
          View Project <i class="fas fa-arrow-right ml-1"></i>
        </a>
      </div>
    </div>
  `).join('');
}

async function handleSearch(e) {
  e.preventDefault();
  const searchInput = document.querySelector('input[type="text"]');
  const skill = searchInput.value.trim();
  
  if (skill) {
    try {
      const response = await fetch(`/api/profiles/search?skill=${encodeURIComponent(skill)}`);
      const results = await response.json();
      localStorage.setItem('searchResults', JSON.stringify(results));
      window.location.href = 'search.html';
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    }
  }
}