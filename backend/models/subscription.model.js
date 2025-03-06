// subscription.model.js

const db = require('../config/db');

const createSubscription = async (id_clinica, estado = 'pendiente') => {
    const result = await db.query(
        'INSERT INTO suscripcion (id_clinica, fecha_inicio, estado) VALUES ($1, CURRENT_DATE, $2) RETURNING *',
        [id_clinica, estado]
    );
    return result.rows[0];
};

const getSubscriptionByClinicId = async (id_clinica) => {
    const result = await db.query('SELECT * FROM suscripcion WHERE id_clinica = $1', [id_clinica]);
    return result.rows[0];
};

const updateSubscriptionState = async (id_suscripcion, estado) => {
    const result = await db.query(
        'UPDATE suscripcion SET estado = $1 WHERE id_suscripcion = $2 RETURNING *',
        [estado, id_suscripcion]
    );
    return result.rows[0];
};

const deleteSubscription = async (id_suscripcion) => {
    const result = await db.query('DELETE FROM suscripcion WHERE id_suscripcion = $1 RETURNING *', [id_suscripcion]);
    return result.rows[0];
};

module.exports = { 
    createSubscription, 
    getSubscriptionByClinicId, 
    updateSubscriptionState, 
    deleteSubscription 
};