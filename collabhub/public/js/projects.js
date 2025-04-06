document.addEventListener('DOMContentLoaded', async () => {
  // Show success message if redirected from project creation
  if (window.location.search.includes('new=true')) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6';
    alertDiv.innerHTML = `
      <p class="font-bold">Success!</p>
      <p>Your project has been created successfully.</p>
    `;
    document.querySelector('.max-w-6xl').prepend(alertDiv);
  }

  // Get current user ID from localStorage
  function getCurrentUserId() {
    const profile = JSON.parse(localStorage.getItem('currentProfile'));
    return profile ? profile.id : 0;
  }

  // Handle join/leave project
  async function handleProjectJoin(projectId, button) {
    const isJoined = button.dataset.joined === 'true';
    const action = isJoined ? 'leave' : 'join';
    
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: getCurrentUserId(),
          action: action
        })
      });

      if (response.ok) {
        button.textContent = isJoined ? 'Join Project' : 'Leave Project';
        button.dataset.joined = isJoined ? 'false' : 'true';
        // Refresh project list
        const projects = await response.json();
        renderProjects(projects);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Action failed. Please try again.');
    }
  }

  const projectsContainer = document.getElementById('projectsContainer');
  const searchInput = document.getElementById('projectSearch');
  let allProjects = [];

  // Load projects from API
  try {
    projectsContainer.innerHTML = `
      <div class="col-span-full flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    `;

    const response = await fetch('/api/profiles/projects');
    allProjects = await response.json();
    renderProjects(allProjects);
  } catch (error) {
    console.error('Error loading projects:', error);
    projectsContainer.innerHTML = `
      <div class="col-span-full text-center py-12 text-red-500">
        <p class="text-xl">Failed to load projects</p>
        <button onclick="window.location.reload()" class="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Retry
        </button>
      </div>
    `;
  }

  // Setup search/filter functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProjects = allProjects.filter(project => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.skills_needed.some(skill => 
        skill.toLowerCase().includes(searchTerm)
      )
    );
    renderProjects(filteredProjects);
  });

  // Render projects to the DOM
  function renderProjects(projects) {
    if (projects.length === 0) {
      projectsContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-xl text-gray-500">No projects found</p>
        </div>
      `;
      return;
    }

    projectsContainer.innerHTML = projects.map(project => {
      const members = project.members || [];
      const isMember = members.includes(getCurrentUserId());
      
      return `
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
          <div class="mt-4">
            <h4 class="text-sm font-semibold text-gray-500 mb-1">Team Members (${members.length})</h4>
            <div class="flex flex-wrap gap-2">
              ${members.length > 0 ? 
                members.map(memberId => `
                  <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Member #${memberId}
                  </span>
                `).join('') : 
                '<span class="text-gray-500 text-sm">No members yet</span>'}
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <span class="text-sm text-gray-500">${project.team_size || 1} team members</span>
            <button onclick="handleProjectJoin(${project.id}, this)" 
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm join-btn"
              data-joined="${isMember}">
              ${isMember ? 'Leave Project' : 'Join Project'}
            </button>
          </div>
        </div>
      </div>
      `;
    }).join('');
  }
});