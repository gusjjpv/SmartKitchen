import express from 'express';
import userRoutes from './routes/UserRoutes.js';
const app = express();

app.use(express.json());
app.use(userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));