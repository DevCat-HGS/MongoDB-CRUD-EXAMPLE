const API_URL = "http://localhost:3000";

// Obtener elementos del DOM
const formCliente = document.getElementById("formCliente");
const listaClientes = document.getElementById("listaClientes");
const formProducto = document.getElementById("formProducto");
const listaProductos = document.getElementById("listaProductos");
const formPedido = document.getElementById("formPedido");
const listaPedidos = document.getElementById("listaPedidos");

// Función para cargar y mostrar clientes
async function cargarClientes() {
  const response = await fetch(`${API_URL}/clientes`);
  const clientes = await response.json();

  listaClientes.innerHTML = ""; // Limpiar lista
  clientes.forEach((cliente) => {
    const li = document.createElement("li");
    li.textContent = `${cliente.nombres} - ${cliente.dirección} (${cliente.género})`;
    li.appendChild(crearBotones(cliente._id, 'clientes'));
    listaClientes.appendChild(li);
  });

  // Agregar opciones de clientes al formulario de pedidos
  const selectCliente = document.getElementById("clientePedido");
  selectCliente.innerHTML = '<option value="" disabled selected>Seleccione un cliente</option>';
  clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente._id;
    option.textContent = cliente.nombres;
    selectCliente.appendChild(option);
  });
}

// Agregar un nuevo cliente
formCliente.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoCliente = {
    nombres: document.getElementById("nombres").value,
    dirección: document.getElementById("direccion").value,
    género: document.getElementById("genero").value,
  };

  await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoCliente),
  });

  // Limpiar el formulario y recargar la lista
  formCliente.reset();
  cargarClientes();
});

// Función para cargar y mostrar productos
async function cargarProductos() {
  const response = await fetch(`${API_URL}/productos`);
  const productos = await response.json();

  listaProductos.innerHTML = ""; // Limpiar lista
  productos.forEach((producto) => {
    const li = document.createElement("li");
    li.textContent = `${producto.nombres} - ${producto.descripción} ($${producto.precio})`;
    li.appendChild(crearBotones(producto._id, 'productos'));
    listaProductos.appendChild(li);
  });

  // Agregar opciones de productos al formulario de pedidos
  const selectProducto = document.getElementById("productoPedido");
  selectProducto.innerHTML = '<option value="" disabled selected>Seleccione un producto</option>';
  productos.forEach((producto) => {
    const option = document.createElement("option");
    option.value = producto._id;
    option.textContent = producto.nombres;
    selectProducto.appendChild(option);
  });
}

// Función para cargar y mostrar pedidos
async function cargarPedidos() {
  const response = await fetch(`${API_URL}/pedidos`);
  const pedidos = await response.json();

  listaPedidos.innerHTML = ""; // Limpiar lista
  pedidos.forEach((pedido) => {
    const clienteNombre = pedido.cliente ? pedido.cliente.nombres : "Cliente no encontrado";
    const productosInfo = pedido.productos.map(p => p.producto ? `${p.producto.nombres} (Cantidad: ${p.cantidad})` : "Producto no encontrado").join(', ');
    const li = document.createElement("li");
    li.textContent = `Fecha: ${pedido.fecha} - Cliente: ${clienteNombre} - Productos: ${productosInfo}`;
    li.appendChild(crearBotones(pedido._id, 'pedidos'));
    listaPedidos.appendChild(li);
  });
}

// Agregar un nuevo pedido
formPedido.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoPedido = {
    fecha: document.getElementById("fechaPedido").value,
    cliente: document.getElementById("clientePedido").value,
    productos: [
      {
        producto: document.getElementById("productoPedido").value,
        cantidad: document.getElementById("cantidadPedido").value
      }
    ],
    estado: "Pendiente"
  };

  await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoPedido),
  });

  // Limpiar el formulario y recargar la lista
  formPedido.reset();
  cargarPedidos();
});

// Función para crear botones de editar y eliminar
function crearBotones(id, tipo) {
  const div = document.createElement("div");

  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.onclick = () => editarItem(id, tipo);
  div.appendChild(btnEditar);

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.onclick = () => eliminarItem(id, tipo);
  div.appendChild(btnEliminar);

  return div;
}

// Función para editar un item
async function editarItem(id, tipo) {
  const nuevoValor = prompt("Ingrese el nuevo valor:");
  if (nuevoValor) {
    const data = { nombres: nuevoValor }; // Ajustar según el tipo de item
    await fetch(`${API_URL}/${tipo}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    cargarDatos(tipo);
  }
}

// Función para eliminar un item
async function eliminarItem(id, tipo) {
  await fetch(`${API_URL}/${tipo}/${id}`, {
    method: "DELETE",
  });
  cargarDatos(tipo);
}

// Función para cargar datos según el tipo
function cargarDatos(tipo) {
  if (tipo === 'clientes') {
    cargarClientes();
  } else if (tipo === 'productos') {
    cargarProductos();
  } else if (tipo === 'pedidos') {
    cargarPedidos();
  }
}

// Cargar datos al iniciar
cargarClientes();
cargarProductos();
cargarPedidos();