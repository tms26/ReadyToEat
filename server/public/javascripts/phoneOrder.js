  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.order-status-select').forEach(function(select) {
      select.addEventListener('change', function() {
        const orderId = this.dataset.orderId;
        const newStatus = this.value;
        fetch('/order/update-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ orderId, status: newStatus })
        })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
        })
        .catch(() => alert('Error updating order status'));
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function () {

  const customerSelect = document.getElementById('customerId');
  if (customerSelect) {
    const allOptions = Array.from(customerSelect.options);
    
    const customerSearchInput = document.createElement('input');
    customerSearchInput.type = 'text';
    customerSearchInput.className = 'form-control mb-2';
    customerSearchInput.placeholder = 'Search customer by name or NIF...';
    customerSearchInput.id = 'customerSearch';
    
    customerSelect.parentNode.insertBefore(customerSearchInput, customerSelect);
    
    customerSearchInput.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();

      while (customerSelect.firstChild) {
        customerSelect.removeChild(customerSelect.firstChild);
      }

      allOptions.forEach(option => {
        if (option.text.toLowerCase().includes(query)) {
          const clonedOption = option.cloneNode(true);
          customerSelect.appendChild(clonedOption);
        }
      });
      
      if (customerSelect.options.length === 0) {
        allOptions.forEach(option => {
          const clonedOption = option.cloneNode(true);
          customerSelect.appendChild(clonedOption);
        });
      }
    });
    
    const phoneOrderModal = document.getElementById('phoneOrderModal');
    if (phoneOrderModal) {
      phoneOrderModal.addEventListener('hidden.bs.modal', function () {
        customerSearchInput.value = '';
        
        while (customerSelect.firstChild) {
          customerSelect.removeChild(customerSelect.firstChild);
        }
        
        allOptions.forEach(option => {
          const clonedOption = option.cloneNode(true);
          customerSelect.appendChild(clonedOption);
        });
        
        document.querySelectorAll('input[name="selectedDishes"]').forEach(checkbox => {
          checkbox.checked = false;
        });
      });
    }
  }
});
