import express from 'express';
import userRoutes from './routes/UserRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use(userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));