
window.addEventListener('DOMContentLoaded', function () {
  if (typeof restauranteId !== 'undefined' && restauranteId) {
    const socket = io();
    socket.emit('registerRestaurante', restauranteId);

    socket.on('nova-encomenda', function (data) {
      showOrderToast(data.message || 'New order received!');
    });
  }
});

function showOrderToast(message) {
  const oldToast = document.getElementById('orderToast');
  if (oldToast) oldToast.remove();

  const toastHtml = `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <div id="orderToast" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', toastHtml);

  var toastEl = document.getElementById('orderToast');
  var toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
}