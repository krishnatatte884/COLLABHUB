document.addEventListener('DOMContentLoaded', async () => {
  const projectsContainer = document.getElementById('projectsContainer');
  
  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    const profile = JSON.parse(localStorage.getItem('currentProfile'));
    return profile ? profile.id : null;
  };

  // Handle join/leave project
  const handleProjectJoin = async (projectId, button) => {
    const userId = getCurrentUserId();
    if (!userId) {
      alert('Please create a profile first');
      return;
    }

    const isJoined = button.dataset.joined === 'true';
    const action = isJoined ? 'leave' : 'join';
    
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action
        })
      });

      if (response.ok) {
        button.textContent = isJoined ? 'Join Project' : 'Leave Project';
        button.dataset.joined = isJoined ? 'false' : 'true';
        // Refresh project list
        loadProjects();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Action failed. Please try again.');
    }
  };

  // Load and display projects
  const loadProjects = async () => {
    try {
      projectsContainer.innerHTML = `
        <div class="col-span-full flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      `;

      const response = await fetch('/api/profiles/projects');
      const text = await response.text();
      const projects = JSON.parse(text.replace(/}{/g, '},{'));
      
      projectsContainer.innerHTML = projects.map(project => {
        const isMember = project.members && project.members.includes(getCurrentUserId());
        return `
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
            <div class="mt-4">
              <h4 class="text-sm font-semibold text-gray-500 mb-1">Team Members (${project.members?.length || 0})</h4>
              <div class="flex flex-wrap gap-2">
                ${project.members?.length > 0 ? 
                  project.members.map(memberId => `
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
    } catch (error) {
      console.error('Error loading projects:', error);
      projectsContainer.innerHTML = `
        <div class="col-span-full text-center py-12 text-red-500">
          <p class="text-xl">Failed to load projects</p>
          <button onclick="loadProjects()" class="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Retry
          </button>
        </div>
      `;
    }
  };

  // Initialize
  loadProjects();
});

// Make function globally available
window.handleProjectJoin = (projectId, button) => {
  document.dispatchEvent(new CustomEvent('projectJoin', { 
    detail: { projectId, button } 
  }));
};