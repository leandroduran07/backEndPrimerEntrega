import express from "express";
import fs from "fs"; 

const router = express.Router();
let carts = []; // Array para almacenar los carritos


// Ruta para obtener todos los carritos desde carts.json
router.get("/", (req, res) => {
    fs.readFile("./src/data/carts.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener carritos" });
            return;
        }

        const carts = JSON.parse(data); // Parsea los datos de carts.json
        res.json({ data: carts });
    });
});

// Ruta para crear un nuevo carrito y guardarlo en carts.json
router.post("/", (req, res) => {
    fs.readFile("./src/data/carts.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener carritos" });
            return;
        }

        const carts = JSON.parse(data); // Parsea los datos de carts.json
        const newCart = {
            id: generateCartId(),
            products: [],
        };
        carts.push(newCart);

        // Guarda los carritos actualizados en carts.json
        fs.writeFile("./src/data/carts.json", JSON.stringify(carts), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Error al guardar el carrito" });
                return;
            }

            res.status(201).json({ message: "Carrito creado con éxito", data: newCart });
        });
    });
});

// Ruta para listar los productos de un carrito por su ID
router.get("/:cid", (req, res) => {
    const cartId = req.params.cid;

    fs.readFile("./src/data/carts.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener carritos" });
            return;
        }

        const carts = JSON.parse(data); // Parsea los datos de carts.json
        const cart = carts.find((c) => c.id === cartId);

        if (cart) {
            res.json({ data: cart.products });
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    });
});

// Ruta para agregar un producto a un carrito por su ID de carrito y producto
router.post("/:cid/product/:pid", (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    fs.readFile("./src/data/carts.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener carritos" });
            return;
        }

        const carts = JSON.parse(data); // Parsea los datos de carts.json
        const cart = carts.find((c) => c.id === cartId);

        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }

        // Verifica si el producto ya existe en el carrito
        const productIndex = cart.products.findIndex((p) => p.id === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }

        // Guarda los carritos actualizados en carts.json
        fs.writeFile("./src/data/carts.json", JSON.stringify(carts), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Error al guardar el carrito" });
                return;
            }

            res.json({ message: "Producto agregado al carrito con éxito", data: cart.products });
        });
    });
});

// Ruta para eliminar un producto de un carrito por su ID de carrito y producto
router.delete("/:cid/product/:pid", (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    fs.readFile("./src/data/carts.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener carritos" });
            return;
        }

        const carts = JSON.parse(data); // Parsea los datos de carts.json
        const cart = carts.find((c) => c.id === cartId);

        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }

        // Buscar el producto en el carrito por su ID
        const productIndex = cart.products.findIndex((p) => p.id === productId);

        if (productIndex !== -1) {
            // Eliminar el producto del carrito
            cart.products.splice(productIndex, 1);

            // Guarda los carritos actualizados en carts.json
            fs.writeFile("./src/data/carts.json", JSON.stringify(carts), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Error al guardar el carrito" });
                    return;
                }

                res.json({ message: "Producto eliminado del carrito con éxito" });
            });
        } else {
            res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }
    });
});

// Función para generar un ID de carrito único
function generateCartId() {
    let newCartId;
    let isUnique = false;

    while (!isUnique) {
        newCartId = (Math.random() * 1000000).toFixed(0);
        isUnique = !carts.some((cart) => cart.id === newCartId);
    }

    return newCartId;
}

export { router as cartsRouter };
