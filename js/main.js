import ShoppingCart from "./ShoppingCart.js";
/* ======================================================
   Cargar HEADER y FOOTER automáticamente
   ====================================================== */
export async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (!element) return;

  try {
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
  } catch (error) {
    console.error("Error cargando " + file, error);
  }
}

loadComponent("header", "header.html");
loadComponent("footer", "footer.html");


/* ======================================================
   Botón SUBIR ARRIBA
   ====================================================== */
const btnSubir = document.getElementById("btn-subir");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    btnSubir.style.display = "block";
  } else {
    btnSubir.style.display = "none";
  }
});

btnSubir.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});


/* ======================================================
   Selector de IDIOMA (si existe)
   ====================================================== */
const selector = document.getElementById("idioma");

if (selector) {
  selector.addEventListener("change", () => {
    const idioma = selector.value;

    document.querySelectorAll("[data-es]").forEach((el) => {
      const nuevoTexto = el.getAttribute(`data-${idioma}`);

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = nuevoTexto;
      } else {
        el.textContent = nuevoTexto;
      }
    });
  });
}


/* ======================================================
   Hover suave para imágenes y tarjetas
   ====================================================== */
document.querySelectorAll(".hover-effect").forEach((elemento) => {
  elemento.addEventListener("mouseover", () => {
    elemento.style.transform = "scale(1.05)";
  });

  elemento.addEventListener("mouseout", () => {
    elemento.style.transform = "scale(1)";
  });
});


/* ======================================================
   Carrito de compra
   ====================================================== */
const cart = new ShoppingCart("carrito", 0.21);

// Referencias al DOM
const lista   = document.getElementById("lista");
const cant    = document.getElementById("cant");
const iva     = document.getElementById("iva");
const tot     = document.getElementById("tot");
const vaciar  = document.getElementById("vaciar");

// Renderizar carrito
function renderCart() {
  lista.innerHTML = "";
  for (const [name, item] of cart.cart.entries()) {
  if (!item || typeof item.qty !== "number") continue; // evita errores

  const li = document.createElement("li");
  li.textContent = `${item.qty} × ${name} — ${(item.price * item.qty).toFixed(2)} €`;
  lista.appendChild(li);
}

  cant.textContent = cart.totalQty;
  iva.textContent  = cart.tax.toFixed(2).replace(".", ",");
  tot.textContent  = cart.total.toFixed(2).replace(".", ",");
}

// Inicializa vista
renderCart();

// Botones "Añadir al carrito"
document.querySelectorAll(".btn-add").forEach((btn) => {
  btn.addEventListener("click", () => {
    const producto = btn.closest(".producto");
    const name  = producto.dataset.name;
    const price = parseFloat(producto.dataset.price);
    const img   = producto.dataset.img;

    cart.add(name, price, { img });
    renderCart();
  });
});

// Botón "Vaciar carrito"
if (vaciar) {
  vaciar.addEventListener("click", () => {
    cart.clear();
    renderCart();
  });
}
