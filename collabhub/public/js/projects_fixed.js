document.addEventListener('DOMContentLoaded', async () => {
  const projectsContainer = document.getElementById('projectsContainer');
  
  // Robust JSON parser that handles malformed responses
  const parseProjects = (text) => {
    try {
      // First try standard JSON parse
      return JSON.parse(text);
    } catch (e) {
      // If fails, try fixing common issues:
      // 1. Add missing commas between key-value pairs
      let fixed = text.replace(/"([^"]+)"([^{"])/g, '"$1":$2');
      // 2. Add commas between objects
      fixed = fixed.replace(/}{/g, '},{');
      // 3. Ensure it's an array
      if (!fixed.startsWith('[')) fixed = `[${fixed}]`;
      return JSON.parse(fixed);
    }
  };

  // Display projects
  const displayProjects = (projects) => {
    projectsContainer.innerHTML = projects.map(project => `
      <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
        <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
          <p class="text-gray-600 mb-4">${project.description}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            ${(project.skills_needed || []).map(skill => `
              <span class="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">${skill}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  };

  // Load and display projects
  try {
    const response = await fetch('/api/profiles/projects');
    const text = await response.text();
    const projects = parseProjects(text);
    displayProjects(projects);
  } catch (error) {
    projectsContainer.innerHTML = `
      <div class="text-center py-12 text-red-500">
        <p>Failed to load projects. Please try again later.</p>
      </div>
    `;
    console.error('Error loading projects:', error);
  }
});