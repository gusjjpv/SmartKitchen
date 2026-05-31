import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController.js";

const router = Router();
const produtoController = new ProdutoController();

router.get("/restaurantes/:restaurante_id/produtos", produtoController.index);
router.get("/restaurantes/:restaurante_id/produtos/:id", produtoController.show);
router.get(
  "/restaurantes/:restaurante_id/categorias/:categoria_id/produtos",
  produtoController.listarPorCategoria
);
router.post("/restaurantes/:restaurante_id/produtos", produtoController.store);
router.put("/restaurantes/:restaurante_id/produtos/:id", produtoController.update);
router.delete("/restaurantes/:restaurante_id/produtos/:id", produtoController.destroy);

export default router;
