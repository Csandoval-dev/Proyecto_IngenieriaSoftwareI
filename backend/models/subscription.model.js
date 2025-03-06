const db = require('../config/db');

const createSubscription = async (id_clinica, estado) => {
    const result = await db.query(
        'INSERT INTO suscripcion (id_clinica, estado, fecha_inicio) VALUES ($1, $2, NOW()) RETURNING *',
        [id_clinica, estado]
    );
    return result.rows[0];
};

const updateSubscriptionState = async (id_clinica, estado) => {
    const result = await db.query(
        'UPDATE suscripcion SET estado = $1 WHERE id_clinica = $2 RETURNING *',
        [estado, id_clinica]
    );
    return result.rows[0];
};

const getSubscriptionByClinicId = async (id_clinica) => {
    const result = await db.query(
        'SELECT * FROM suscripcion WHERE id_clinica = $1',
        [id_clinica]
    );
    return result.rows[0];
};

module.exports = {
    createSubscription,
    updateSubscriptionState,
    getSubscriptionByClinicId
};