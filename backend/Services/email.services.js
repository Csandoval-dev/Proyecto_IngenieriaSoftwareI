// email.services.js

const nodemailer = require('nodemailer'); // Asegúrate de tener nodemailer instalado

// Configuración del transporter (ajustar según tu proveedor de correo)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER || 'user@example.com',
        pass: process.env.EMAIL_PASS || 'password'
    }
});

// Enviar credenciales de administrador
const sendAdminCredentials = async (clinicName, email, password) => {
    try {
        await transporter.sendMail({
            from: `"Sistema de Gestión de Clínicas" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Bienvenido al Sistema - Credenciales de Administrador para ${clinicName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Bienvenido al Sistema de Gestión de Clínicas</h2>
                    <p>Estimado/a Administrador de ${clinicName},</p>
                    <p>Su clínica ha sido aprobada en nuestro sistema. A continuación, se detallan sus credenciales de acceso:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                        <p><strong>Usuario:</strong> ${email}</p>
                        <p><strong>Contraseña:</strong> ${password}</p>
                    </div>
                    <p>Por favor, inicie sesión y cambie su contraseña inmediatamente por motivos de seguridad.</p>
                    <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
                    <p>Saludos cordiales,<br>Equipo de Gestión de Clínicas</p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
};

// Enviar notificación de rechazo
const sendRejectionNotification = async (clinicName, email, reason) => {
    try {
        await transporter.sendMail({
            from: `"Sistema de Gestión de Clínicas" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Solicitud de Registro Rechazada - ${clinicName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Notificación de Solicitud Rechazada</h2>
                    <p>Estimado/a representante de ${clinicName},</p>
                    <p>Lamentamos informarle que su solicitud para registrar su clínica en nuestro sistema ha sido rechazada.</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                        <p><strong>Motivo:</strong> ${reason}</p>
                    </div>
                    <p>Si desea más información o considera que ha habido un error, por favor contáctenos.</p>
                    <p>Saludos cordiales,<br>Equipo de Gestión de Clínicas</p>
                </div>
            `
        });
        return true;
    } catch (error) {
          console.error('Error enviando email de rechazo:', error);
        return false;
    }
};