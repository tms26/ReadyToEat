document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-button");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const menuId = event.target.dataset.id;
      try {
        const response = await fetch(`/menus/${menuId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          event.target.closest(".menu-card-container").remove();
        } else {
          alert("Failed to delete the menu. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting menu:", error);
        alert("An error occurred. Please try again.");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".edit-button").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.getElementById("editMenuId").value = this.dataset.id;
      document.getElementById("editMenuName").value = this.dataset.name;
    });
  });
  document
    .getElementById("editMenuForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      fetch("/menus/edit", {
        method: "POST",
        body: formData,
      })
        .then((res) =>
          res.ok ? location.reload() : alert("Error updating menu")
        )
        .catch(() => alert("Error updating menu"));
    });
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('createMenuForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/menus/new', {
      method: 'POST',
      body: formData
    })
    .then(res => res.ok ? location.reload() : alert('Error creating menu'))
    .catch(() => alert('Error creating menu'));
  });
});