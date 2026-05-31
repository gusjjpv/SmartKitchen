import express from 'express';
import userRoutes from "./routes/UserRoutes.js";
import restauranteRoutes from "./routes/RestauranteRoutes.js";
import horarioFuncionamentoRoutes from "./routes/HorarioFuncionamentoRoutes.js";
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.json({ limit: "4mb" }));
app.use(userRoutes);
app.use(restauranteRoutes);
app.use(horarioFuncionamentoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));