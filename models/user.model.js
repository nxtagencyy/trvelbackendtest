// definir el esquema de nuestra coleccion y el modelo
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        // vamos a definir un grupo de roles que puede tener el usuario
        enum: ["user", "admin", "author"],
        default: "user",
    },
    // los siguientes campos vamos a utilzarlos para el reseteo del password
    resetPasswordToken:{
        type: String,
    },
    resetPasswordExpire:{
        type: Date,
    },
    // ////////////
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null,
    }
});

//si quiero listar todos los usuarios que no hayan sido eliminados
// deletedAt = null => verifico esto aplicando un middleware
// cada que haga un find valido que el campo deletedat sea diferente de null

// vamos a implementar un middlewareque se ejecuta antes de la creacion del usuario
// este middleware se va a encargar de hashear la contrasena
userSchema.pre("save", async function (next) {
    // primero obtenemos el usuario que se esta creando 
    const user = this;
    // solo si se modifica el atributo password vamos a hashear la contrasena
    if( user.isModified("password") ){
        try {
            // /vamos a hashear la contrasena
            // generamos una cadena aleatoria que se encarga de hashear la contrasena
            // esta cadena la generamos usando bcrypt
            // esta generacion puede tener varias rondas, mientras mas rondas mas segura es la contrasena
            const salt = await bcrypt.genSalt(10);
            // hasehamos la contrasena con la cadena generada
            user.password = await bcrypt.hash(user.password, salt);
            next();

        } catch (error) {
            next(error)
        }
    }else {
        next();
    }
}) 


// cuando el usario intente hacer login, recibimos el password en texto plano
// comparamos usando el hash
// /vamos a agregar un metodo personaliizado en nuestro schema
// este metodo se encarga de comparar la contrasena en texto plano con la contrasena hasheada
userSchema.methods.comparePassword = async function ( plainPassword  ) {
    // this para utilizaar el usuario actual
    // esto retorna un boleano true si las contrasenas coinciden
    const validationResult = await bcrypt.compare(plainPassword, this.password);
    return validationResult
}

userSchema.methods.generateResetPasswordToken = function () {
    // este metodo se encarga se setear los dos atributos que forman parte del usuario
    // el primer atributo es el token
    // segundo atributo fecha de caducidad del token 
    // para generar este token usamos crypto
    // crypto es una dependencia que se puede usar para hasehar cosas utilizando multiples algoritmos
    // bcrypt es una dependencia enfocada para trabajar con contrasenas 

    // 1- generar el token de reseteo de password => (conjunto de caracteres generado de forma aleatoria)
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenHashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 2- actualizar estos atributos en el usuario
    this.resetPasswordToken = resetTokenHashed;
    this.resetPasswordExpire = Date.now() + 60*60*1000;
    return resetTokenHashed;
}

export const User = mongoose.model("users", userSchema);