let currentStep = 1;
const steps = document.querySelectorAll(".form-step");
const indicators = document.querySelectorAll(".step-indicator");

function selectUserType(type) {
  document.getElementById("user-type-selection").classList.add("hidden");

  if (type === "restaurant") {
    document.getElementById("restaurant-form").classList.remove("hidden");
    document.getElementById("customer-form").classList.add("hidden");

    showStep(currentStep);
  } else if (type === "customer") {
    document.getElementById("customer-form").classList.remove("hidden");
    document.getElementById("restaurant-form").classList.add("hidden");
  }
}

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

function validateStep(step) {
  let isValid = true;

  if (step === 1) {
    const firstName = document.querySelector("input[name='firstName']");
    const lastName = document.querySelector("input[name='lastName']");
    const email = document.querySelector("input[name='email']");
    const nif = document.querySelector("input[name='nif']");
    const password = document.querySelector("input[name='password']");

    if (!firstName.value.trim()) {
      alert("First Name is required.");
      isValid = false;
    }
    if (!lastName.value.trim()) {
      alert("Last Name is required.");
      isValid = false;
    }
    if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
      alert("A valid Email is required.");
      isValid = false;
    }
    if (!nif.value.trim() || !/^\d{9}$/.test(nif.value)) {
      alert("NIF must be a valid 9-digit number.");
      isValid = false;
    }
    if (!password.value.trim() || password.value.length < 6) {
      alert("Password must be at least 6 characters long.");
      isValid = false;
    }
  } else if (step === 2) {
    const restaurantName = document.querySelector("input[name='restaurantName']");
    const address = document.querySelector("input[name='address']");
    const phone = document.querySelector("input[name='phone']");
    const pricePerPerson = document.querySelector("input[name='pricePerPerson']");
    const image = document.querySelector("input[name='image']");

    if (!restaurantName.value.trim()) {
      alert("Restaurant Name is required.");
      isValid = false;
    }
    if (!address.value.trim()) {
      alert("Address is required.");
      isValid = false;
    }
    if (!phone.value.trim() || !/^\d{9}$/.test(phone.value)) {
      alert("Phone must be a valid 9-digit number.");
      isValid = false;
    }
    if (!pricePerPerson.value.trim() || isNaN(pricePerPerson.value) || pricePerPerson.value <= 0) {
      alert("Price per person must be a valid positive number.");
      isValid = false;
    }
    if (!image.files[0]) {
      alert("Image is required.");
      isValid = false;
    }
  }

  return isValid;
}

function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep < steps.length) {
      currentStep++;
      showStep(currentStep);
    }
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

function updatePriceDisplay(value) {
  const priceDisplay = document.getElementById("price-display");
  priceDisplay.textContent = `Selected Price: €${value}`;
}

function goBackToUserType() {
  document.getElementById("user-type-selection").classList.remove("hidden");
  document.getElementById("restaurant-form").classList.add("hidden");
  document.getElementById("customer-form").classList.add("hidden");
  currentStep = 1;
  showStep(currentStep);
}

document.getElementById("register-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData, 
    });

    if (!response.ok) {
      const data = await response.json();
      if (data.message) {
        alert(data.message);
      }
    } else {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
});