import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();
connectDB();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "i am coming",
  });
});

app.listen(port, () => {
  console.log(`app is listening at port ${port}`);
});
