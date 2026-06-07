import { Router } from "express";
import { PedidoController } from "../controllers/PedidoController.js";

const router = Router();
const pedidoController = new PedidoController();

router.post("/restaurantes/:restaurante_id/mesas/:mesa_id/pedidos", pedidoController.store);
router.get("/restaurantes/:restaurante_id/pedidos", pedidoController.index);
router.get("/restaurantes/:restaurante_id/pedidos/:id", pedidoController.show);
router.put("/restaurantes/:restaurante_id/pedidos/:id/status", pedidoController.updateStatus);

export default router;
