// 1) Importar la clase
import ShoppingCart from './ShoppingCart.mjs';

// 2) Crear (o cargar) un carrito
const cart = new ShoppingCart(); // por defecto usa key='carrito' y 21 % de IVA

let productoPendienteEliminar = null;

// 3) Función que refresca el carrito
function renderCart() {
  document.querySelector('#cant').textContent = cart.totalQty;
  
  document.querySelector('#tot').textContent = cart.total.toFixed(2);


  const lista = document.querySelector('#lista');
  lista.innerHTML = '';

  for (const [name, { qty, price }] of cart.cart) {
    lista.appendChild(generateCartLiText(name, qty, price));
  }
}

// 4) Plantilla para cada línea del carrito
function generateCartLiText(name, qty, price) {
  return htmlToElement(`
    <li class="mb-2 d-flex justify-content-between align-items-center">
      <div>
        <strong>${name}</strong><br>
        <small>${(qty * price).toFixed(2)} €</small>
      </div>
      <div class="d-flex align-items-center">
        <button class="btn btn-outline-secondary px-3 btn-sub-line" data-name="${name}" aria-label="Restar uno">−</button>
        <input type="text" value="${qty}" readonly class="form-control mx-2" style="width: 60px; text-align: center;" />
        <button class="btn btn-outline-secondary px-3 btn-add-line" data-name="${name}" data-price="${price}" aria-label="Sumar uno">+</button>
      </div>
    </li>
  `);
}

// Utilidad para convertir string a elemento HTML
function htmlToElement(html) {
  const template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

document.addEventListener("DOMContentLoaded", () => {

  renderCart();

  // Añadir al carrito desde fichas o catálogo
  document.querySelectorAll('.catalogo').forEach(a => {
    a.addEventListener('click', (e) => {
      if (!e.target.matches('.btn-add')) return;
      const card = e.target.closest('.producto');
      const name = card.dataset.name;
      const price = Number(card.dataset.price);
      const img = card.dataset.img;
      const qtyInput = card.querySelector('#quantity');
      const qty = qtyInput ? parseInt(qtyInput.value) : 1;

      cart.add(name, price, { img }, qty);
      renderCart();

      // Animación del botón del carrito
      const iconoCarrito = document.getElementById("btn-carrito");
      if (iconoCarrito) {
        iconoCarrito.classList.add("animate");
        setTimeout(() => iconoCarrito.classList.remove("animate"), 600);
      }
    });
  });

  // Sumar, restar, eliminar con confirmación dentro del carrito
  document.querySelector('#lista').addEventListener('click', (e) => {
    const btn = e.target;
    const name = btn.dataset.name;

    if (btn.matches('.btn-add-line')) {
      const price = Number(btn.dataset.price);
      cart.add(name, price);
      renderCart();
    } else if (btn.matches('.btn-sub-line')) {
      cart.reduce(name);
      renderCart();
    } else if (btn.matches('.btn-del-line')) {
      productoPendienteEliminar = name;
      const modal = new bootstrap.Modal(document.getElementById('confirmarEliminarModal'));
      modal.show();
    }
  });

  // Confirmar eliminación (modal)
  const btnConfirmar = document.getElementById("confirmarEliminarBtn");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
      if (productoPendienteEliminar) {
        cart.remove(productoPendienteEliminar);
        renderCart();
        productoPendienteEliminar = null;
        const modal = bootstrap.Modal.getInstance(document.getElementById("confirmarEliminarModal"));
        modal.hide();
      }
    });
  }

  // Botón "Vaciar carrito"
  const btnVaciar = document.getElementById("vaciar");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      cart.clear();
      renderCart();
    });
  }

  // Subir al top con la tecla T
  document.addEventListener("keydown", (e) => {
    if (e.key === "t" || e.key === "T") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Botón "subir arriba"
  const btnSubir = document.getElementById("btn-subir");
  if (btnSubir) {
    window.addEventListener("scroll", () => {
      btnSubir.style.display = window.scrollY > 100 ? "block" : "none";
    });
    btnSubir.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Botones + y − en ficha de producto (si existen)
  const qtyInput = document.getElementById("quantity");
  const increaseBtn = document.getElementById("increase-button");
  const decreaseBtn = document.getElementById("decrease-button");

  if (qtyInput && increaseBtn && decreaseBtn) {
    increaseBtn.addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });

    decreaseBtn.addEventListener("click", () => {
      const current = parseInt(qtyInput.value);
      if (current > 1) {
        qtyInput.value = current - 1;
      }
    });
  }

  // Mostrar/Ocultar carrito al hacer clic
  const btnCarrito = document.getElementById('btn-carrito');
  const carrito = document.getElementById('carrito');

  if (btnCarrito && carrito) {
    btnCarrito.addEventListener('click', (e) => {
      e.stopPropagation();
      carrito.style.display = carrito.style.display === 'block' ? 'none' : 'block';
    });

    // Cierra si haces clic fuera del carrito
    document.addEventListener('click', (e) => {
      const clickDentroDeCarrito = carrito.contains(e.target);
      const clickEnElBoton = btnCarrito.contains(e.target);
      if (!clickDentroDeCarrito && !clickEnElBoton) {
        carrito.style.display = 'none';
      }
    });

    // Evita que clics dentro del carrito lo cierren
    carrito.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
});
