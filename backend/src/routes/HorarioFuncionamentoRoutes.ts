import { Router } from "express";
import { HorarioFuncionamentoController } from "../controllers/HorarioFuncionamentoController.js";

const router = Router();
const horarioController = new HorarioFuncionamentoController();

router.get(
  "/restaurantes/:restaurante_id/horarios",
  horarioController.index
);
router.get(
  "/restaurantes/:restaurante_id/horarios/:dia_semana",
  horarioController.show
);
router.post(
  "/restaurantes/:restaurante_id/horarios",
  horarioController.store
);
router.put(
  "/restaurantes/:restaurante_id/horarios/:dia_semana",
  horarioController.update
);
router.delete(
  "/restaurantes/:restaurante_id/horarios/:dia_semana",
  horarioController.destroy
);

export default router;
