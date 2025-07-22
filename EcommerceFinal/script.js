// --- Configuración ---
const API_URL = 'https://fakestoreapi.com/products';
const productosLista = document.getElementById('productos-lista');
const carritoLista = document.getElementById('carrito-lista');
const carritoTotal = document.getElementById('carrito-total');
const cartCount = document.getElementById('cart-count');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// --- Renderizar productos ---
async function cargarProductos() {
  try {
    const res = await fetch(API_URL);
    const productos = await res.json();
    productosLista.innerHTML = '';
    productos.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'card p-2 col-12 col-md-6 col-lg-4';
      card.innerHTML = `
        <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
        <div class="card-body">
          <h5 class="card-title">${producto.title}</h5>
          <p class="card-text">$${producto.price.toFixed(2)}</p>
          <button class="btn btn-success agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      `;
      productosLista.appendChild(card);
    });
  } catch (e) {
    productosLista.innerHTML = '<p>Error al cargar productos.</p>';
  }
}

// --- Carrito ---
function actualizarCarrito() {
  carritoLista.innerHTML = '';
  if (carrito.length === 0) {
    carritoLista.innerHTML = '<p>El carrito está vacío.</p>';
    carritoTotal.textContent = '0.00';
    cartCount.textContent = '0';
    return;
  }
  let total = 0;
  carrito.forEach(item => {
    total += item.price * item.cantidad;
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center justify-content-between mb-2 p-2 border rounded';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="40" height="40" style="object-fit:contain;">
      <span class="flex-grow-1 ms-2">${item.title}</span>
      <span class="me-2">$${item.price.toFixed(2)}</span>
      <input type="number" min="1" value="${item.cantidad}" class="form-control form-control-sm cantidad-input" data-id="${item.id}" style="width:60px;">
      <button class="btn btn-danger btn-sm ms-2 eliminar-item" data-id="${item.id}">Eliminar</button>
    `;
    carritoLista.appendChild(div);
  });
  carritoTotal.textContent = total.toFixed(2);
  cartCount.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// --- Agregar al carrito ---
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('agregar-carrito')) {
    const id = +e.target.dataset.id;
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(producto => {
        const existe = carrito.find(item => item.id === producto.id);
        if (existe) {
          existe.cantidad++;
        } else {
          carrito.push({
            id: producto.id,
            title: producto.title,
            price: producto.price,
            image: producto.image,
            cantidad: 1
          });
        }
        actualizarCarrito();
      });
  }
  // Eliminar producto
  if (e.target.classList.contains('eliminar-item')) {
    const id = +e.target.dataset.id;
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
  }
});

// --- Editar cantidad ---
carritoLista.addEventListener('input', function(e) {
  if (e.target.classList.contains('cantidad-input')) {
    const id = +e.target.dataset.id;
    const nuevaCantidad = Math.max(1, +e.target.value);
    const item = carrito.find(item => item.id === id);
    if (item) {
      item.cantidad = nuevaCantidad;
      actualizarCarrito();
    }
  }
});

// --- Validación de formulario ---
const form = document.getElementById('form-contacto');
const formMensaje = document.getElementById('form-mensaje');
if (form) {
  form.addEventListener('submit', function(e) {
    let valido = true;
    formMensaje.textContent = '';
    // Nombre
    if (!form.nombre.value.trim()) {
      form.nombre.classList.add('is-invalid');
      valido = false;
    } else {
      form.nombre.classList.remove('is-invalid');
    }
    // Email
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value);
    if (!emailValido) {
      form.email.classList.add('is-invalid');
      valido = false;
    } else {
      form.email.classList.remove('is-invalid');
    }
    // Mensaje
    if (!form.mensaje.value.trim()) {
      form.mensaje.classList.add('is-invalid');
      valido = false;
    } else {
      form.mensaje.classList.remove('is-invalid');
    }
    if (!valido) {
      e.preventDefault();
      formMensaje.textContent = 'Por favor completa todos los campos correctamente.';
      formMensaje.style.color = 'red';
    } else {
      formMensaje.textContent = 'Enviando...';
      formMensaje.style.color = 'green';
    }
  });
}

// --- Navegación accesible ---
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      link.click();
    }
  });
});

// --- Inicialización ---
cargarProductos();
actualizarCarrito(); 