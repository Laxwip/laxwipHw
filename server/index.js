import express from "express";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const indice = process.env.NOTION_DATABASE_ID_1;
const ventas = process.env.NOTION_DATABASE_ID_2;

// Habilitar CORS para todas las solicitudes
app.use(cors());

app.use(express.json());

// Obtener todos los productos
app.get("/allIndice", async (req, res) => {
  try {
    const response = await notion.databases.query({ database_id: indice });
    res.json(response.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los productos formateados
app.get("/allIndiceFormat", async (req, res) => {
  try {
    const response = await notion.databases.query({ database_id: indice });

    const productos = response.results.map((page) => {
      const props = page.properties;

      return {
        id: page.id,
        nombre: props["Nombre"]?.title?.[0]?.plain_text || "",
        disponibilidad: props["Disponibilidad"]?.select?.name || "",
        numeroDoble: props["##"]?.rich_text?.[0]?.plain_text || "",
        numero: props["#"]?.rich_text?.[0]?.plain_text || "",
        serie: props["Serie"]?.rich_text?.[0]?.plain_text || "",
        edicion: props["Edicion"]?.select?.name || "",
        lote: props["Lote"]?.multi_select?.map((item) => item.name) || [],
        tema: props["Tema"]?.rich_text?.[0]?.plain_text || "",
        rareza: props["Rareza"]?.select?.name || "",
        venta: props["Venta"]?.number || 0,
        archivos: props["Archivos y multimedia"]?.files || [],
        tematico: props["Tematico"]?.checkbox || false,
      };
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Crear un nuevo producto
app.post("/createProducto", async (req, res) => {
  try {
    const {
      nombre,
      disponibilidad,
      numeroDoble,
      numero,
      serie,
      edicion,
      lote,
      tema,
      rareza,
      venta,
      tematico,
    } = req.body;

    const response = await notion.pages.create({
      parent: { database_id: indice },
      properties: {
        Nombre: {
          title: [{ text: { content: nombre } }],
        },
        Disponibilidad: {
          select: { name: disponibilidad },
        },
        "##": {
          rich_text: [{ text: { content: numeroDoble } }],
        },
        "#": {
          rich_text: [{ text: { content: numero } }],
        },
        Serie: {
          rich_text: [{ text: { content: serie } }],
        },
        Edicion: {
          select: { name: edicion },
        },
        Lote: {
          multi_select: lote.map((l) => ({ name: l })),
        },
        Tema: {
          rich_text: [{ text: { content: tema } }],
        },
        Rareza: {
          select: { name: rareza },
        },
        Venta: {
          number: venta,
        },
        Tematico: {
          checkbox: tematico,
        },
      },
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Editar un producto
app.patch("/editProducto/:id", async (req, res) => {
  try {
    const pageId = req.params.id;
    const {
      nombre,
      disponibilidad,
      numeroDoble,
      numero,
      serie,
      edicion,
      lote,
      tema,
      rareza,
      venta,
      tematico,
    } = req.body;

    const response = await notion.pages.update({
      page_id: pageId,
      properties: {
        Nombre: nombre && {
          title: [{ text: { content: nombre } }],
        },
        Disponibilidad: disponibilidad && {
          select: { name: disponibilidad },
        },
        "##": numeroDoble && {
          rich_text: [{ text: { content: numeroDoble } }],
        },
        "#": numero && {
          rich_text: [{ text: { content: numero } }],
        },
        Serie: serie && {
          rich_text: [{ text: { content: serie } }],
        },
        Edicion: edicion && {
          select: { name: edicion },
        },
        Lote: lote && {
          multi_select: lote.map((l) => ({ name: l })),
        },
        Tema: tema && {
          rich_text: [{ text: { content: tema } }],
        },
        Rareza: rareza && {
          select: { name: rareza },
        },
        Venta: venta !== undefined && {
          number: venta,
        },
        Tematico: typeof tematico === "boolean" && {
          checkbox: tematico,
        },
      },
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Eliminar un producto
app.delete("/deleteProducto/:id", async (req, res) => {
  try {
    const pageId = req.params.id;

    const response = await notion.pages.update({
      page_id: pageId,
      archived: true,
    });

    res.json({ success: true, message: "Producto archivado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Obtener los productos que contengan los caracteres
app.get("/buscarProducto", async (req, res) => {
  const { texto } = req.query;
  if (!texto || texto.trim() === "") {
    return res.json([]); // si no hay texto, devolvemos un array vacío
  }

  try {
    const response = await notion.databases.query({
      database_id: indice,
    });

    const productos = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        nombre: props["Nombre"]?.title?.[0]?.plain_text || "",
        disponibilidad: props["Disponibilidad"]?.select?.name || "",
        numeroDoble: props["##"]?.rich_text?.[0]?.plain_text || "",
        numero: props["#"]?.rich_text?.[0]?.plain_text || "",
        serie: props["Serie"]?.rich_text?.[0]?.plain_text || "",
        edicion: props["Edicion"]?.select?.name || "",
        lote: props["Lote"]?.multi_select?.map((item) => item.name) || [],
        tema: props["Tema"]?.rich_text?.[0]?.plain_text || "",
        rareza: props["Rareza"]?.select?.name || "",
        venta: props["Venta"]?.number || 0,
        archivos: props["Archivos y multimedia"]?.files || [],
        tematico: props["Tematico"]?.checkbox || false,
      };
    });

    const textoLower = texto.toLowerCase();
    const coincidencias = productos.filter((prod) =>
      prod.nombre.toLowerCase().includes(textoLower) ||
      prod.serie.toLowerCase().includes(textoLower) ||
      prod.edicion.toLowerCase().includes(textoLower) ||
      prod.tema.toLowerCase().includes(textoLower)
    );

    res.json(coincidencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Obtener el producto por ID
app.get("/producto/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await notion.pages.retrieve({ page_id: id });
    const props = response.properties;

    const producto = {
      id: response.id,
      nombre: props["Nombre"]?.title?.[0]?.plain_text || "",
      disponibilidad: props["Disponibilidad"]?.select?.name || "",
      numeroDoble: props["##"]?.rich_text?.[0]?.plain_text || "",
      numero: props["#"]?.rich_text?.[0]?.plain_text || "",
      serie: props["Serie"]?.rich_text?.[0]?.plain_text || "",
      edicion: props["Edicion"]?.select?.name || "",
      lote: props["Lote"]?.multi_select?.map((item) => item.name) || [],
      tema: props["Tema"]?.rich_text?.[0]?.plain_text || "",
      rareza: props["Rareza"]?.select?.name || "",
      venta: props["Venta"]?.number || 0,
      archivos: props["Archivos y multimedia"]?.files || [],
      tematico: props["Tematico"]?.checkbox || false,
    };

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




//Obtener todas las ventas 
app.get("/allVentas", async (req, res) => {
  try {
    const response = await notion.databases.query({ database_id: ventas });
    res.json(response.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Obtener todas las ventas formateadas
app.get("/allVentasFormat", async (req, res) => {
  try {
    const response = await notion.databases.query({ database_id: ventas });

    const ventasFormateadas = response.results.map((page) => {
      const props = page.properties;

      return {
        id: page.id,
        nombre: props["Nombre"]?.title?.[0]?.plain_text || "", // puede estar vacío
        mercado: props["Mercado"]?.select?.name || "",
        costo: props["Costo"]?.number || 0,
        ventaBruto: props["Venta bruto"]?.number || 0,
        venta: props["Venta"]?.number || 0,
        indiceId: props["Indice"]?.relation?.[0]?.id || null,
      };
    });

    res.json(ventasFormateadas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Crear una venta
app.post("/crearVenta", async (req, res) => {
  try {
    const {
      indiceId,       // ID del producto del índice (se selecciona en el front)
      mercado,
      costo,
      ventaBruto,
      venta
    } = req.body;

    // Consulta el producto relacionado para sacar su nombre
    const productoRelacionado = await notion.pages.retrieve({ page_id: indiceId });
    const nombre = productoRelacionado.properties["Nombre"]?.title?.[0]?.plain_text || "Sin nombre";

    const response = await notion.pages.create({
      parent: { database_id: ventas },
      properties: {
        Nombre: {
          title: [{ text: { content: nombre } }],
        },
        Mercado: {
          select: { name: mercado },
        },
        Costo: {
          number: costo,
        },
        "Venta bruto": {
          number: ventaBruto,
        },
        Venta: {
          number: venta,
        },
        Indice: {
          relation: [{ id: indiceId }],
        },
      },
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Editar una venta
app.patch("/editarVenta/:id", async (req, res) => {
  try {
    const ventaId = req.params.id;
    const {
      mercado,
      costo,
      ventaBruto,
      venta
    } = req.body;

    const response = await notion.pages.update({
      page_id: ventaId,
      properties: {
        Mercado: mercado && { select: { name: mercado } },
        Costo: costo !== undefined && { number: costo },
        "Venta bruto": ventaBruto !== undefined && { number: ventaBruto },
        Venta: venta !== undefined && { number: venta },
      },
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Eliminar una venta
app.delete("/eliminarVenta/:id", async (req, res) => {
  try {
    const ventaId = req.params.id;

    const response = await notion.pages.update({
      page_id: ventaId,
      archived: true,
    });

    res.json({ success: true, message: "Venta archivada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Buscar una venta
app.get("/buscarVentas", async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || "";

    const response = await notion.databases.query({ database_id: ventas });

    const ventasFiltradas = response.results
      .map((page) => {
        const props = page.properties;

        return {
          id: page.id,
          nombre: props["Nombre"]?.title?.[0]?.plain_text || "",
          mercado: props["Mercado"]?.select?.name || "",
          costo: props["Costo"]?.number || 0,
          ventaBruto: props["Venta bruto"]?.number || 0,
          venta: props["Venta"]?.number || 0,
          indiceId: props["Indice"]?.relation?.[0]?.id || null,
        };
      })
      .filter((venta) =>
        venta.nombre.toLowerCase().includes(query) ||
        venta.mercado.toLowerCase().includes(query)
      );

    res.json(ventasFiltradas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
 