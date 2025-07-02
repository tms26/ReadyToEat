document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1;
  const steps = document.querySelectorAll(".form-step");
  const indicators = document.querySelectorAll(".step-indicator");

  function showStep(step) {
    steps.forEach((stepElement, index) => {
      if (index + 1 === step) {
        stepElement.classList.remove("hidden");
      } else {
        stepElement.classList.add("hidden");
      }
    });

    indicators.forEach((indicator, index) => {
      if (index + 1 === step) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  }

  window.nextStep = function () {
    if (currentStep < steps.length) {
      currentStep++;
      showStep(currentStep);
    }
  };

  window.previousStep = function () {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  };

  showStep(currentStep);

  const fileInput = document.getElementById("image");
  const previewImage = document.getElementById("previewImage");
  const previewText = document.getElementById("previewText");
  const browseButton = document.querySelector(".browse");

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    handleFile(file);
  });

  browseButton.addEventListener("click", () => {
    fileInput.click();
  });

  function handleFile(file) {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.classList.remove("hidden");
        previewText.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (PNG or JPG).");
    }
  }
});

function toggleNewCategoryInput() {
  const categorySelect = document.getElementById("category");
  const newCategoryGroup = document.getElementById("newCategoryGroup");
  if (categorySelect.value === "new") {
    newCategoryGroup.classList.remove("hidden");
    document.getElementById("newCategory").setAttribute("required", "required");
  } else {
    newCategoryGroup.classList.add("hidden");
    document.getElementById("newCategory").removeAttribute("required");
  }
}

  function goBackToDishes() {
    var menuId = document.querySelector('input[name="menuId"]').value;
    if (menuId) {
      window.location.href = '/menus/dishes?menuId=' + menuId;
    } else {
      window.history.back();
    }
  }
