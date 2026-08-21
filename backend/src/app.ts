import cookieParser from "cookie-parser";
import express, { Application, Request } from "express";
import { indexRouter } from './routes';
;
import notFoundHandler from "./middlewares/notFoundHandler";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import path from "path";
import { corsOptions } from "./configs/cors";


const app: Application = express();

app.use(cookieParser());
app.use(express.json());

app.use(corsOptions);
app.use(express.urlencoded({ extended: true }))
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  console.log("webhook", req.body);
  res.status(200).send("ok");
})
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/templetes`))

app.use("/api/auth", toNodeHandler(auth))

app.use(`/api/v1`, indexRouter);

app.get("/", (req: Request, res: express.Response) => {
  res.send("Hello, World!");
});

app.use(notFoundHandler);
app.use(globalErrorHandler);



export default app;
