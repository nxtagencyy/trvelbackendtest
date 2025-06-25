// esta capa se encarga de definir el grupo de rutas asociadas al usuario y los llamados a la capa de controladores
import express from "express";
import { saveUser, getAllUsers, deleteUser, updateUser } from "../controllers/user.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import authorizationMiddleware from "../middlewares/authorization.middleware.js";

const userRouter = express.Router();

userRouter.use(authenticationMiddleware);

// CRUD de servicios para administrar el usario
userRouter.post("/", saveUser);  // saveUser viene de la capa de controlador
// userRouter.post("/", authenticationMiddleware ,saveUser);  // saveUser viene de la capa de controlador
// este servicio de obtencion de usuarios soolo este disponible para el role admin o definier vaiors roles ["admin", "sup", ]
userRouter.get("/", authorizationMiddleware(["admin"]) ,getAllUsers);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:id", updateUser);

export default userRouter;