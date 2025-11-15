import express from 'express';
import cors from 'cors';
// import { connectDB } from './config/db/connect';
// import { bovinoRouter } from './ModuleBovino/infrastructure/routes/bovinoRouter';
// import { lpmRouter } from './ModuleBovino/infrastructure/routes/lpmRouter';
// import { locationRouter } from './ModuleBovino/infrastructure/routes/locationRouter';
// import { stephRouter } from './ModuleBovino/infrastructure/routes/stephRouter';
// import { diviceRouter } from './ModuleDivice/infraestructure/routes/diviceRouter';
// import  userRouter  from './ModuleUser/infraestructure/routes/useRoutes'; 
// import {  copiarclabe, init } from './ModuleUser/infraestructure/auth/secure/claves';

const app = express();

app.use(cors());
app.use(express.json());

// copiarclabe();
// init()



// app.use('/api/users', userRouter);
// app.use('/api/bovinos', bovinoRouter);
// app.use('/api/bovinos/lpm', lpmRouter);
// app.use('/api/bovinos/location', locationRouter);
// app.use('/api/bovinos/steph', stephRouter);
// app.use('/api/divices', diviceRouter);
 

// connectDB();
export { app };