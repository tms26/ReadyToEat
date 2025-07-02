const pratosLista = document.getElementById("pratos-lista");
const menuId = pratosLista.dataset.menuId;
const sortSelect = document.getElementById("sort");
const categorySelect = document.getElementById("category");

function loadDishes(sort, category) {
  let url = `/dishes?menuId=${menuId}`;
  if (sort) url += `&sort=${sort}`;
  if (category) url += `&category=${category}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      pratosLista.innerHTML = ""; 
      data.pratos.forEach((prato) => {
        const listItem = document.createElement("li");
        listItem.className = "prato-item";
        listItem.innerHTML = `
            <a href="/dishes/dish?dishId=${prato._id}">
              <img src="${prato.imagem}" alt="${
          prato.nome
        }" class="prato-imagem">
            </a>
            <a href="/dishes/dish?dishId=${prato._id}">
              <h2>${prato.nome}</h2>
            </a>
            <p><strong>Descrição:</strong> ${prato.descricao}</p>
            <p><strong>Preço:</strong> ${prato.preco.toFixed(2)} €</p>
            <a href="/dishes/edit?dishId=${
              prato._id
            }" class="btn-editar">Edit</a>
            <form
              action="/dishes/${prato._id}/delete?menuId=${menuId}"
              method="POST"
              style="display: inline"
            >
              <button type="submit" class="btn-editar">Delete</button>
            </form>
          `;
        pratosLista.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Fetch error:", error));
}

sortSelect.addEventListener("change", () => {
  loadDishes(sortSelect.value, categorySelect.value);
});

categorySelect.addEventListener("change", () => {
  loadDishes(sortSelect.value, categorySelect.value);
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      if (!confirm("Are you sure you want to delete this dish?")) {
        return;
      }
      const dishId = event.target.dataset.id;
      const menuId = event.target.dataset.menuId;

      try {
        const response = await fetch(
          `/dishes/${dishId}/delete?menuId=${menuId}`,
          { method: "DELETE" }
        );
        const data = await response.json();

        if (response.ok) {
          event.target.closest(".prato-item").remove();
        } else {
          alert(data.error || "Failed to delete the dish. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting dish:", error);
        alert("An error occurred. Please try again.");
      }
    });
  });
});
