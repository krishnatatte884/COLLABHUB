document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('projectForm');
  const skillInput = document.getElementById('skillInput');
  const addSkillBtn = document.getElementById('addSkillBtn');
  const skillsContainer = document.getElementById('skillsContainer');

  let skills = [];

  // Add skill to list
  addSkillBtn.addEventListener('click', () => {
    const skill = skillInput.value.trim();
    if (skill && !skills.includes(skill)) {
      skills.push(skill);
      renderSkills();
      skillInput.value = '';
    }
  });

  // Remove skill from list
  skillsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-skill')) {
      const skillToRemove = e.target.dataset.skill;
      skills = skills.filter(skill => skill !== skillToRemove);
      renderSkills();
    }
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (skills.length < 2) {
      alert('Please add at least 2 required skills');
      return;
    }

    const projectData = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      image: document.getElementById('image').value,
      skills_needed: skills
    };

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        window.location.href = 'projects.html?new=true';
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to create project'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create project. Please try again.');
    }
  });

  // Render skills as tags
  function renderSkills() {
    skillsContainer.innerHTML = skills.map(skill => `
      <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
        ${skill}
        <button type="button" class="remove-skill ml-1 text-green-600 hover:text-green-800" data-skill="${skill}">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }
});