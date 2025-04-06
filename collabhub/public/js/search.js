document.addEventListener('DOMContentLoaded', () => {
  const searchResults = document.getElementById('searchResults');
  const searchQuery = document.getElementById('searchQuery').querySelector('span');
  
  // Get search results from localStorage
  const results = JSON.parse(localStorage.getItem('searchResults'));
  const query = new URLSearchParams(window.location.search).get('q') || '';

  // Display search query
  searchQuery.textContent = query;

  if (!results || results.length === 0) {
    searchResults.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="text-gray-500 mb-4">
          <i class="fas fa-users-slash text-5xl"></i>
        </div>
        <p class="text-xl mb-4">No matching profiles found</p>
        <a href="index.html" class="text-green-500 hover:text-green-700 font-medium">
          <i class="fas fa-arrow-left mr-1"></i> Try a different search
        </a>
      </div>
    `;
    return;
  }

  // Display search results
  searchResults.innerHTML = results.map(profile => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div class="p-6">
        <div class="flex items-center mb-4">
          <img src="${profile.image}" alt="${profile.name}" class="w-16 h-16 rounded-full object-cover mr-4">
          <div>
            <h3 class="text-lg font-semibold">${profile.name}</h3>
            <p class="text-gray-600 text-sm">${profile.email}</p>
          </div>
        </div>
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-500 mb-2">SKILLS</h4>
          <div class="flex flex-wrap gap-2">
            ${profile.skills.map(skill => `
              <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">${skill}</span>
            `).join('')}
          </div>
        </div>
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-500 mb-2">INTERESTS</h4>
          <div class="flex flex-wrap gap-2">
            ${profile.interests.map(interest => `
              <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${interest}</span>
            `).join('')}
          </div>
        </div>
        <button class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
          <i class="fas fa-envelope mr-2"></i> Contact
        </button>
      </div>
    </div>
  `).join('');
});