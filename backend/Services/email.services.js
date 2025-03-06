const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar el transporter con tus credenciales
const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio de correo que uses
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Función para enviar correo con credenciales de administrador
const sendAdminCredentials = async (clinicName, adminEmail, password) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `Credenciales de Administrador para ${clinicName}`,
      html: `
        <h2>¡Bienvenido al sistema de gestión de clínicas!</h2>
        <p>Su clínica <strong>${clinicName}</strong> ha sido aprobada.</p>
        <p>Puede acceder al sistema con las siguientes credenciales:</p>
        <ul>
          <li><strong>Usuario:</strong> ${adminEmail}</li>
          <li><strong>Contraseña:</strong> ${password}</li>
        </ul>
        <p>Le recomendamos cambiar su contraseña después del primer inicio de sesión por motivos de seguridad.</p>
        <p>Atentamente,<br>El equipo de administración</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return false;
  }
};

module.exports = {
  sendAdminCredentials
};