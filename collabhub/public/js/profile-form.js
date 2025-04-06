document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileForm');
  const skillInput = document.getElementById('skillInput');
  const addSkillBtn = document.getElementById('addSkillBtn');
  const skillsContainer = document.getElementById('skillsContainer');
  const previewBtn = document.getElementById('previewBtn');
  const previewImage = document.getElementById('previewImage');
  const imagePreview = document.getElementById('imagePreview');

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

  // Preview profile image
  previewBtn.addEventListener('click', () => {
    const imageUrl = document.getElementById('image').value.trim();
    if (imageUrl) {
      previewImage.src = imageUrl;
      imagePreview.classList.remove('hidden');
    }
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (skills.length < 3) {
      alert('Please add at least 3 skills');
      return;
    }

    const interests = Array.from(document.getElementById('interests').selectedOptions)
      .map(option => option.value);

    const profileData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      image: document.getElementById('image').value,
      skills,
      interests
    };

    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const profile = await response.json();
        // Add ID to profile data before saving to localStorage
        const profileWithId = {
          ...profile,
          id: profile.id || Date.now() // Use server-provided ID or generate a temporary one
        };
        localStorage.setItem('currentProfile', JSON.stringify(profileWithId));
        window.location.href = 'profile.html?new=true';
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to create profile'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create profile. Please try again.');
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