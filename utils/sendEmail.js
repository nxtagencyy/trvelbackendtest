// Envio de correos electronicos
// utilizando mailtrap con nodemailer
import nodemailer from "nodemailer";
import configs from "../configs/configs.js";

// en options se envia informacion del correo como destinatario, asunto, cuerpo de correo
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: configs.MAILTRAP_HOST,
    port: configs.MAILTRAP_PORT,
    auth: {
      user: configs.MAILTRAP_USER,
      pass: configs.MAILTRAP_PASSWORD,
    },
  });

  // usando la conexion que vamos creando vamos a enviat el correo
  const mailOptions = {
    from: '"Proyecto Ordenes" <no-reply@demomailtrap.co>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
