import configs from "../configs/configs.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

const register = async(req, res) => {
    try {
        // vamos a obtner los campos del usuario que esta enviando el cliente
        // username, password, email => en el cuerpo de la peticion
        const { username, password, email } = req.body;
        const user = new User({username, password, email});
        await user.save(); 
        res.status(201).json(user);   
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const login = async(req, res) => {
    try {
        // username, password
        // 1- validar que el usuario exista en la base de datos, buscamos el usuario de acuerdo al username
        const { username, password } = req.body;
        // buscamos el usuario por usernme
        const user = await User.findOne({"username": username});

        if ( !user ) {
            return res.status(401).json({message: "Invalid Credentials"});
        }

        // comparar las contrasenas 
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({message: "Invalid Credentials"})
        }

        // vamos a generar un token de acceso JWT (JASON WEB TOKEN);
        // este token es como la cedula de identidad del usuario
        // para generar el jwt vamos a usar una dependencia llamada jsonwebtoken
        // el metodo sign recibe los siguientes parametros
        // 1)recibe el payload (los datos que quiero guardar)
        // en nuestro caso el payload es un objeto con los datos del usuario (id del usuario)
        // 2) Clave secreta para firmar nuestro token
        // la firma es util para garantizar que nuestro token no ha sido alterado
        // jwt => HEADER.PAYLOAD.SIGNATURE
        // header: { alg:"HS256", typ: "JWT" } => base64
        // PAYLOAD: { userId: "asdasd" } => base64
        // 3) pasar el tiempo de expiracion del token
        const token = jwt.sign({ userId: user._id, role: user.role }, configs.JWT_SECRET, { expiresIn: "1h" })

        res.json({message: "Logged in", token: token});

    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
}

const forgotPassword = async(req, res) => {
    // en este servicio el frontend esta enviando el correo
    try {
        const { email } = req.body;
        // con el email vamos a validarlo si esata asociado a la base de datos
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        // el siguiente paso es generar el token de recuperacion de password
        // este token va a ser enviado al correo electronico del usuario
        // vamos a definir el tiempo de expiracion de este token
        const resetToken = user.generateResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // crear el enlace para resetear la contrasena
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`
        const message = `Hola para retear tu contrasena accede al siguiente enlace ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Recuperacion de contrasena",
                message: message
            });
            
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(500).json({message: "Ocurrio un error al enviar el correo"})
        }

        res.json({message: "el link ha sido enviado a tu correro electronico"})

    } catch (error) {
        
        res.status(500).json({message: error.message})

    }
}

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        // validar si el token no ha expirado y si esta asociado a algun usuario

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: {
                $gt: Date.now(),
            } 
        });
        
        // si no encontramos el usuario isgnifa que el token no es valido o expiro
        if ( !user ) {
            return res.status(400).json({message: "Invalid token or expired"})
        }
        
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.json({message: "Lacontrasena ha sido actualizada"})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export { register, login, forgotPassword, resetPassword }