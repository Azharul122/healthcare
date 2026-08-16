import { speciality } from './genereted/prisma/browser';
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";

import cors from "cors";
import { specialityRouter } from './modules/speciality/speciality.route';
import { indexRouter } from './routes';

const app: Application = express();
app.use(cookieParser());
app.use(express.json());


const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  }),
);

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}`, indexRouter);


app.get("/", (req: Request, res: express.Response) => {
  res.send("Hello, World!");
});

export default app;
