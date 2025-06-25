// este middleware debe validar lo siguiente
// 1.- Que en el request el frontend haya enviado el token de acceso
// 2.- Debe validar que el jwt sea valido (estructura correcta y que no hay expirado)
// 3.- Obtener la info que este dentro del JWT

import jwt from "jsonwebtoken";
import configs from "../configs/configs.js";

const authenticationMiddleware = (req, res, next) => {
    // el JWT llega en el header del request
    const authHeader = req.header("Authorization");
    
    // 1.-Que en el request el frontend haya enviado el token de acceso
    if ( !authHeader || !authHeader.startsWith("Bearer ") ) {
        return res
            .status(401)
            .json({ message: "Access Denied, no token provided" })
    } 

    try {

        // 2- validar que el jwt sea valido (estructura correcta y no que haya expirado)
        // 3- obtener la info dentro de JWT
        // Necesitamos el token
        // Bearer asdasdergsdg
        const token = authHeader.split(" ")[1];

        // verificar el token, 
        // este metodo tambien retorna el payload guardado en l token
        const decoded = jwt.verify(token, configs.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" })
    }

}

export default authenticationMiddleware