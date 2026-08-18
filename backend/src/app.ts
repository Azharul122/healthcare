import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import { indexRouter } from './routes';
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";


const app: Application = express();
app.use(cookieParser());
app.use(express.json());

 

app.use(`/api/v1`, indexRouter);

app.get("/", (req: Request, res: express.Response) => {
  res.send("Hello, World!");
});

app.use(notFoundHandler);       
app.use(globalErrorHandler);  


export default app;
