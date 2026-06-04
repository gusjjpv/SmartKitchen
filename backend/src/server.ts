import express from 'express';
import userRoutes from "./routes/UserRoutes.js";
import restauranteRoutes from "./routes/RestauranteRoutes.js";
import horarioFuncionamentoRoutes from "./routes/HorarioFuncionamentoRoutes.js";
import categoriaRoutes from "./routes/CategoriaRoutes.js";
import produtoRoutes from "./routes/ProdutoRoutes.js";
import mesaRoutes from "./routes/MesaRoutes.js";
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.json({ limit: "4mb" }));
app.use(userRoutes);
app.use(restauranteRoutes);
app.use(horarioFuncionamentoRoutes);
app.use(categoriaRoutes);
app.use(produtoRoutes);
app.use(mesaRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));