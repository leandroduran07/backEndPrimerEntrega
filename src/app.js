import express from "express";
import fs from "fs/promises"; // Módulo 'fs' para trabajar con archivos
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";

const port = 8080;
const app = express();

app.listen(port, () => {
    console.log(`Servidor funcionando en puerto: ${port}`);
});

app.use(express.json());

// Rutas para productos y carritos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "¡Algo salió mal!" }); // Error genérico para manejar problemas
});

// Manejo de archivos JSON para persistencia de datos
const productsFilePath = "./data/products.json";
const cartsFilePath = "./data/carts.json";


// Middleware para cargar productos desde el archivo products.json
app.use(async (req, res, next) => {
    try {
        const data = await fs.readFile(productsFilePath, "utf8");
        const products = JSON.parse(data);
        req.products = products;
        next();
    } catch (err) {
        console.error("Error cargando productos:", err); 
        res.status(500).json({ error: "Error al cargar productos" });
    }
});

// Middleware para cargar carritos desde el archivo carts.json
app.use(async (req, res, next) => {
    try {
        const data = await fs.readFile(cartsFilePath, "utf8");
        const carts = JSON.parse(data);
        req.carts = carts;
        next();
    } catch (err) {
        console.error("Error cargando carritos:", err); 
        res.status(500).json({ error: "Error al cargar carritos" });
    }
});

// Middleware para guardar productos en el archivo products.json
app.use(async (req, res, next) => {
    try {
        const productsData = JSON.stringify(req.products, null, 2);
        await fs.writeFile(productsFilePath, productsData, "utf8");
        next();
    } catch (err) {
        console.error("Error guardando productos:", err); 
        res.status(500).json({ error: "Error al guardar productos" });
    }
});

// Middleware para guardar carritos en el archivo carts.json
app.use(async (req, res, next) => {
    try {
        const cartsData = JSON.stringify(req.carts, null, 2);
        await fs.writeFile(cartsFilePath, cartsData, "utf8");
        next();
    } catch (err) {
        console.error("Error guardando carritos:", err); // Posible error al guardar carritos
        res.status(500).json({ error: "Error al guardar carritos" });
    }
});
