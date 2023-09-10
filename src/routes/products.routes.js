import express from "express";
import fs from "fs"; // Importa el módulo fs para leer y escribir archivos

const router = express.Router();

let products = []; // Array para almacenar los productos

// Lee los productos desde el archivo JSON al iniciar la aplicación
fs.readFile("./src/data/products.json", "utf8", (err, data) => {
    if (err) {
        console.error("Error al leer products.json", err);
    } else {
        try {
            products = JSON.parse(data);
        } catch (error) {
            console.error("Error al analizar products.json", error);
        }
    }
});

// Ruta para obtener todos los productos
router.get("/", (req, res) => {
    res.json({ data: products });
});

// Ruta para obtener un producto por ID
router.get("/:pid", (req, res) => {
    const productId = req.params.pid;
    const product = products.find((p) => p.id === productId);
    if (product) {
        res.json({ data: product });
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

// Ruta para agregar un nuevo producto
router.post("/", (req, res) => {
    const newProduct = req.body;
    if (validateProduct(newProduct)) {
        newProduct.id = generateProductId();
        products.push(newProduct);

        // Guardar los productos actualizados en el archivo JSON
        saveProductsToJson();

        res.status(201).json({ message: "Producto creado con éxito", data: newProduct });
    } else {
        res.status(400).json({ error: "Datos de producto inválidos" });
    }
});

// Ruta para actualizar un producto por ID
router.put("/:pid", (req, res) => {
    const productId = req.params.pid;
    const updatedProductData = req.body;
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
        // Verificar cada campo individualmente y actualizar si está presente en la solicitud
        if (updatedProductData.title) {
            products[productIndex].title = updatedProductData.title;
        }
        if (updatedProductData.description) {
            products[productIndex].description = updatedProductData.description;
        }
        if (updatedProductData.code) {
            products[productIndex].code = updatedProductData.code;
        }
        if (updatedProductData.price) {
            products[productIndex].price = updatedProductData.price;
        }
        if (updatedProductData.status !== undefined) {
            products[productIndex].status = updatedProductData.status;
        }
        if (updatedProductData.stock) {
            products[productIndex].stock = updatedProductData.stock;
        }
        if (updatedProductData.category) {
            products[productIndex].category = updatedProductData.category;
        }

        // Guardar los productos actualizados en el archivo JSON
        saveProductsToJson();

        res.json({ message: "Producto actualizado con éxito", data: products[productIndex] });
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

// Ruta para eliminar un producto por ID
router.delete("/:pid", (req, res) => {
    const productId = req.params.pid;
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
        products.splice(productIndex, 1);

        // Guardar los productos actualizados en el archivo JSON
        saveProductsToJson();

        res.json({ message: "Producto eliminado con éxito" });
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

// Función para validar datos de producto
function validateProduct(product) {
    return (
        product &&
        typeof product.title === "string" &&
        typeof product.description === "string" &&
        typeof product.code === "string" &&
        typeof product.price === "number" &&
        typeof product.status === "boolean" &&
        typeof product.stock === "number" &&
        typeof product.category === "string"
    );
}

// Función para generar un ID de producto único
function generateProductId() {
    let newProductId;
    let isUnique = false;

    while (!isUnique) {
        newProductId = (Math.random() * 1000000).toFixed(0);
        isUnique = !products.some((product) => product.id === newProductId);
    }

    return newProductId;
}

// Función para guardar los productos en el archivo JSON
function saveProductsToJson() {
    fs.writeFile("./src/data/products.json", JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error("Error al guardar products.json", err);
        }
    });
}

export { router as productsRouter };
