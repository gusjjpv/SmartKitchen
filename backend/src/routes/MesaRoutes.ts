import { Router } from "express";
import { MesaController } from "../controllers/MesaController.js";

const router = Router();
const mesaController = new MesaController();

router.get("/restaurantes/:restaurante_id/mesas", mesaController.index);
router.get("/restaurantes/:restaurante_id/mesas/:id", mesaController.show);
router.post("/restaurantes/:restaurante_id/mesas", mesaController.store);
router.put("/restaurantes/:restaurante_id/mesas/:id", mesaController.update);
router.post("/restaurantes/:restaurante_id/mesas/:id/qrcode", mesaController.regenerarQR);
router.delete("/restaurantes/:restaurante_id/mesas/:id", mesaController.destroy);

export default router;
