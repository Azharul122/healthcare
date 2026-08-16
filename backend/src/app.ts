import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import { indexRouter } from './routes';


const app: Application = express();
app.use(cookieParser());
app.use(express.json());

// app.use(notFoundHandler);       
// app.use(globalErrorHandler);   

app.use(`/api/v1`, indexRouter);

app.get("/", (req: Request, res: express.Response) => {
  res.send("Hello, World!");
});

export default app;
