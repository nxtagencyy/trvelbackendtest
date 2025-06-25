
const authorizationMiddleware = (roles) => (req, res, next) => {
    // validar que el usuario tenga el role asignado
    if ( !req.user || !req.user.role) {
        return res.status(403).json({ message: "Access denied, No role provided" })
    }

    // validar que el rol que tiene el usuario se encuentra dentro de los roless permitidos para este servicio
    if ( !roles.includes(req.user.role) ) {
        return res.status(403).json({ message: "Access denied, No role provided" })
    }

    next();
}

export default authorizationMiddleware;