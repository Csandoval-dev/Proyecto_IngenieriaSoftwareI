const nodemailer = require('nodemailer');

// Configuración del transporter para Gmail con mejor manejo de errores
const createTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;
    
    if (!user || !pass) {
        console.warn('ADVERTENCIA: Variables de entorno EMAIL_USER o EMAIL_PASSWORD no configuradas correctamente');
        // Usar valores por defecto solo para desarrollo
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'system@clinicas.com',
                pass: process.env.EMAIL_PASSWORD || 'password_placeholder'
            }
        });
    }
    
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });
};

// Enviar credenciales de administrador
const sendAdminCredentials = async (clinicName, email, password) => {
    const transporter = createTransporter();
    
    try {
        // Verificar conexión antes de enviar
        await transporter.verify();
        
        const info = await transporter.sendMail({
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
        
        console.log('Email enviado: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        throw error; // Re-lanzar el error para manejarlo en el controlador
    } finally {
        transporter.close();
    }
};

// Enviar notificación de rechazo
const sendRejectionNotification = async (clinicName, email, reason) => {
    const transporter = createTransporter();
    
    try {
        // Verificar conexión antes de enviar
        await transporter.verify();
        
        const info = await transporter.sendMail({
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
        
        console.log('Email de rechazo enviado: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error enviando email de rechazo:', error);
        throw error; // Re-lanzar el error para manejarlo en el controlador
    } finally {
        transporter.close();
    }
};

module.exports = {
    sendAdminCredentials,
    sendRejectionNotification
};