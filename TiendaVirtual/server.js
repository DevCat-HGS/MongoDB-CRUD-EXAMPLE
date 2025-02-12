const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'frontend')));

// Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/tiendavirtual", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conectado a MongoDB");
});

// Definir modelos
const Cliente = mongoose.model("Cliente", {
  nombres: String,
  dirección: String,
  género: String,
});

const Producto = mongoose.model("Producto", {
  nombres: String,
  descripción: String,
  precio: Number,
});

const Pedido = mongoose.model("Pedido", {
  fecha: Date,
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      cantidad: Number
    }
  ],
  estado: String
});

// Rutas CRUD para Clientes
app.post("/clientes", async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.send(cliente);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).send("Error al crear cliente");
  }
});

app.get("/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.send(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).send("Error al obtener clientes");
  }
});

app.put("/clientes/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(cliente);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).send("Error al actualizar cliente");
  }
});

app.delete("/clientes/:id", async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.send({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).send("Error al eliminar cliente");
  }
});

// Rutas CRUD para Productos
app.post("/productos", async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.send(producto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).send("Error al crear producto");
  }
});

app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.send(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

app.put("/productos/:id", async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).send("Error al actualizar producto");
  }
});

app.delete("/productos/:id", async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.send({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error al eliminar producto");
  }
});

// Rutas CRUD para Pedidos
app.post("/pedidos", async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.send(pedido);
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).send("Error al crear pedido");
  }
});

app.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('cliente').populate('productos.producto');
    res.send(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).send("Error al obtener pedidos");
  }
});

app.put("/pedidos/:id", async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(pedido);
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(500).send("Error al actualizar pedido");
  }
});

app.delete("/pedidos/:id", async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.send({ message: "Pedido eliminado" });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    res.status(500).send("Error al eliminar pedido");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});