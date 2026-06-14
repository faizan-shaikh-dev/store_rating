import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB}  from "./src/config/db.js";
import authRoutes from "./src/routes/authRoute.js";
import userRoute from "./src/routes/userRoute.js";
import adminRoute from "./src/routes/adminRoute.js";
import storeRoute from "./src/routes/storeRoute.js";
import ratingRoute from "./src/routes/ratingRoute.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


app.get("/", (req, res) =>{
    res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/store", storeRoute);
app.use("/api/rating", ratingRoute);

connectDB();

app.listen(process.env.PORT, ()=>{
    console.log(`Server is Running on Port ${process.env.PORT}`);
});