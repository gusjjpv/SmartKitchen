import { Router } from "express";
import { RestauranteController } from "../controllers/RestauranteController.js";

const router = Router();
const restauranteController = new RestauranteController();

router.get("/restaurantes", restauranteController.index);
router.get("/restaurantes/:id", restauranteController.show);
router.get("/restaurantes/slug/:slug", restauranteController.showBySlug);
router.post("/restaurantes", restauranteController.store);
router.put("/restaurantes/:id", restauranteController.update);
router.delete("/restaurantes/:id", restauranteController.destroy);

export default router;
