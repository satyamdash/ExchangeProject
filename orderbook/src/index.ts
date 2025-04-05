import express from "express";
import cors from "cors";
import {userRouter} from "./router/user";
import { orderRouter } from "./router/order";

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/v1/user",userRouter);

app.use("/api/v1/order",orderRouter);

app.listen(3000);