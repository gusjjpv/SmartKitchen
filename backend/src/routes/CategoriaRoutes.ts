import { Router } from "express";
import { CategoriaController } from "../controllers/CategoriaController.js";

const router = Router();
const categoriaController = new CategoriaController();

router.get("/restaurantes/:restaurante_id/categorias", categoriaController.index);
router.get("/restaurantes/:restaurante_id/categorias/:id", categoriaController.show);
router.post("/restaurantes/:restaurante_id/categorias", categoriaController.store);
router.put("/restaurantes/:restaurante_id/categorias/:id", categoriaController.update);
router.delete("/restaurantes/:restaurante_id/categorias/:id", categoriaController.destroy);

export default router;
