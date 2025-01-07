const editButtons = document.querySelectorAll(".edit");

editButtons.forEach(button => button.addEventListener("click", editClick));

async function editClick(click) {
  console.log("Edit click worked!")
  const editButton = click.target;
  console.log('edit clicked');
  const moodEntry = editButton.closest(".mood");
 
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

var trash = document.querySelectorAll("deleteClick");

Array.from(document.querySelectorAll('.deleteClick')).forEach(button => {
  button.addEventListener('click', function(event) {
      event.preventDefault(); 

      // Confirm before deletion
      if (confirm('Are you sure you want to delete this mood?')) {
          const form = button.closest('form');
          const url = form.action; // Get the form action URL (includes _method=DELETE)
          fetch(url, {
              method: 'POST', // This method is overridden by the method-override middleware
          })
          .then(response => response.json()) 
          .then(data => {
              console.log(data.message); 
              window.location.reload(); 
          })
          .catch(error => {
              console.error('Error:', error);
          });
      }
  });
});
