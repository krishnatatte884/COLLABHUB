document.addEventListener('DOMContentLoaded', () => {
  // Get profile data from localStorage
  const profileData = JSON.parse(localStorage.getItem('currentProfile'));
  
  if (!profileData) {
    alert('No profile found. Please create a profile first.');
    window.location.href = 'create-profile.html';
    return;
  }

  // Display profile data
  document.getElementById('profileName').textContent = profileData.name;
  document.getElementById('profileEmail').textContent = profileData.email;
  document.getElementById('profileImage').src = profileData.image || 'https://via.placeholder.com/150'; // Fallback image

  // Display skills
  const skillsContainer = document.getElementById('profileSkills');
  skillsContainer.innerHTML = profileData.skills.map(skill => `
    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">
      ${skill}
    </span>
  `).join('');

  // Display interests
  const interestsContainer = document.getElementById('profileInterests');
  interestsContainer.innerHTML = profileData.interests.map(interest => `
    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
      ${interest}
    </span>
  `).join('');

  // Check if this is a new profile creation redirect
  if (window.location.search.includes('new=true')) {
    const successAlert = document.createElement('div');
    successAlert.className = 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6';
    successAlert.innerHTML = `
      <p class="font-bold">Success!</p>
      <p>Your profile has been created successfully.</p>
    `;
    document.querySelector('.p-6').prepend(successAlert);
  }
});