const editButtons = document.querySelectorAll(".edit");

editButtons.forEach(button => button.addEventListener("click", editClick));

async function editClick(click) {
  console.log("Edit click worked!")
  const editButton = click.target;
  console.log('edit clicked');
  const moodEntry = editButton.closest(".mood");
  // const moodID = moodEntry.getAttribute("data-id");
  const updateButton = moodEntry.querySelector('.update')

  const moodField = moodEntry.querySelector(".moodSelection");
  const dateField = moodEntry.querySelector(".dateSelection");
  const mood = moodField.innerText;
  const date = dateField.innerText;

  moodField.innerHTML = `<input class="edit-input" type="text" name="mood" value="${mood}">`;
  dateField.innerHTML = `<input class="edit-input" type="date" name="date" value="${date}">`;
  
  updateButton.classList.toggle('hidden'); 
  editButton.classList.toggle('hidden');

}

















// Modal creation- read and watched videos online

/*
// Get the modal
const modal = document.getElementById("moodModal");

// Get the button that opens the modal
const openModalBtn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
const closeBtn = document.getElementsByClassName("close-btn")[0];

// When the user clicks the button, open the modal
openModalBtn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// Handle the form submission (PUT request)
document.getElementById("update-mood-form").addEventListener("submit", function(e) {
  e.preventDefault(); // Prevent the form from submitting the default way

  // Collect form data
  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  console.log('Form data:', data);

  // Get the mood ID from the hidden input field (inside the modal)
  const moodId = document.getElementById('mood-id').value;
  console.log('Mood ID:', moodId); // Log the mood ID

  // Send the PUT request using fetch
  fetch(`/api/user/mood/${moodId}`, { // Use backticks for string interpolation
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Response data:', data); // Log the response from the server
    if (data.message === "Mood updated successfully.") {
      alert("Your mood has been updated successfully!");
      document.getElementById("moodModal").style.display = "none"; // Close the modal
    } else {
      alert("Error: " + data.message);
    }
  })
  .catch(error => {
    console.error('Error updating mood:', error);
    alert("Error: Could not update mood.");
  });
});

*/











// OUTDATED WAY
// Array.from(editBtn).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const website = this.parentNode.parentNode.childNodes[1].innerText
//     const username = this.parentNode.parentNode.childNodes[1].innerText
//     const password = this.parentNode.parentNode.childNodes[1].innerText
//     const id = this.dataset.id;//breakdown: this:button being clicked | dataset: objc containing all data | id: specify to get the id from the click of the button. the id is sent to the server so it knows what to update. without dataset.id the serve doesnt know what to update bcs of the specific id it doesn't have. the id is provided by mongo (_id)

//   //prompt is outdated?
//     const newWebsite = prompt("Enter new website", website);
//     const newUsername = prompt("Enter new username", username);
//     const newPassword = prompt("Enter new password", password);

//     fetch('/passwords/edit', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         id: id,
//         website: newWebsite,
//         username: newUsername,
//         password: newPassword
//       })
//     })
//     .then(response => response.json())
//     .then(data => window.location.reload());
//   });
// });