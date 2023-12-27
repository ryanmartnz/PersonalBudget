const db = require('../config/db');
const { createId, findById } = require('../helpers/helpers');

const getEnvelopes = async (req, res, next) => {
    try {
        const client = await db.getClient();
        const envelopes = await client.query("SELECT * FROM envelopes ORDER BY id ASC");
        client.release();
        return res.status(200).send(envelopes.rows);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const getEnvelopeById = async (req, res, next) => {
    try {
        return res.status(200).send(req.envelope);
    } catch(err) {  
        return res.status(500).send(err.message);
    }
};

const addEnvelope = async (req, res, next) => {
    try {
        const client = await db.getClient();
        const results = await client.query("SELECT * FROM envelopes ORDER BY id");
        const newId = createId(results.rows);
        const newEnvelope = await client.query("INSERT INTO envelopes (id, title, budget) VALUES ($1, $2, $3) RETURNING *", [newId, req.title, req.budget]);
        client.release();
        return res.status(201).send(newEnvelope.rows[0]);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const updateEnvelope = async (req, res, next) => {
    try {
        const client = await db.getClient();
        const updated = await client.query("UPDATE envelopes SET title = $1, budget = $2 WHERE id = $3 RETURNING *", [req.title, req.budget, req.params.id]);
        client.release();
        return res.status(201).send(updated.rows[0]);
    } catch(err) {
        return res.status(404).send(err.message);
    }
};

const deleteEnvelope = async (req, res, next) => {
    try {
        const client = await db.getClient();
        await client.query("DELETE FROM envelopes WHERE id = $1", [req.params.id]);
        client.release();
        return res.status(204).send(`Successfully deleted envelope with id: ${req.params.id}`);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const transfer = async (req, res, next) => {
    try {
        const { fromId, toId } = req.params;
        const { amount } = req.body;
        const client = await db.getClient();
        const envelopes = await client.query("SELECT * FROM envelopes");

        const fromEnvelope = findById(envelopes.rows, fromId);
        const toEnvelope = findById(envelopes.rows, toId);

        if(!fromEnvelope) {
            return res.status(404).send(`Envelope with id ${fromId} not found!`);
        }
        if(!toEnvelope) {
            return res.status(404).send(`Envelope with id ${toId} not found!`);
        }

        if(isNaN(parseFloat(amount)) && !isFinite(amount)) {
            return res.status(400).send('Transfer amount must be a number!');
        }

        const numAmount = parseFloat(amount);
        fromEnvelope.budget = parseFloat(fromEnvelope.budget);
        toEnvelope.budget = parseFloat(toEnvelope.budget);

        if(fromEnvelope.budget < numAmount) {
            return res.status(400).send("Amount to transfer exceeds the original envelope's budget");
        }
        
        fromEnvelope.budget -= numAmount;
        toEnvelope.budget += numAmount;

        console.log(toEnvelope.budget);

        const updatedFromEnvelope = await client.query("UPDATE envelopes SET budget = $1 WHERE id = $2 RETURNING *", [fromEnvelope.budget, fromId]);
        await client.query("UPDATE envelopes SET budget = $1 WHERE id = $2", [toEnvelope.budget, toId]);
        client.release();
        
        return res.status(201).send(updatedFromEnvelope.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

module.exports = {
    getEnvelopes,
    addEnvelope,
    getEnvelopeById,
    updateEnvelope,
    deleteEnvelope,
    transfer
};