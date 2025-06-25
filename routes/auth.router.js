// en este archivo vamos a creaar los servicios para el registro del login
import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const authRouter = express.Router();

// servicio para registro

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.put("/reset-password/:token", resetPassword);

export default authRouter;