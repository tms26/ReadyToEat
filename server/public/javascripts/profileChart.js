document.addEventListener("DOMContentLoaded", async () => {
  // Chart dos pratos mais pedidos pelo utilizador
  try {
    const response = await fetch("/users/profile/chart", {
      method: "POST",
      credentials: "same-origin"
    });
    if (response.ok) {
      const data = await response.json();

      if (data.length === 0) {
        console.error("No data available for the chart.");
        return;
      }

      new Chart(document.getElementById("mostOrderedDishesChart"), {
        type: "bar",
        data: {
          labels: data.map((dish) => dish.name),
          datasets: [
            {
              label: "Orders (Website)",
              data: data.map((dish) => dish.count),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error("Failed to load chart data.");
    }
  } catch (error) {
    console.error("Error loading chart:", error);
  }

  // Chart dos pratos mais pedidos ao restaurante logado
  try {
    const response = await fetch("/users/profile/chart/restaurant", {
      method: "POST",
      credentials: "same-origin"
    });
    if (response.ok) {
      const data = await response.json();

      if (data.length === 0) {
        console.error("No data available for the restaurant chart.");
        return;
      }

      new Chart(document.getElementById("mostOrderedDishesRestaurantChart"), {
        type: "bar",
        data: {
          labels: data.map((dish) => dish.name),
          datasets: [
            {
              label: "Orders (Restaurant)",
              data: data.map((dish) => dish.count),
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error("Failed to load restaurant chart data.");
    }
  } catch (error) {
    console.error("Error loading restaurant chart:", error);
  }
});