const db = require('../config/db');
const { createId, findById, deleteById } = require('../helpers/helpers');

const isValidEnvelope = (req, res, next) => {
    const { title, budget } = req.body;
    if(typeof title !== 'string') {
        return res.status(400).send('Envelope title must be a string!');
    } 
    if(isNaN(parseFloat(budget)) && !isFinite(budget)) {
        return res.status(400).send('Envelope budget must be a number!');
    }
    req.title = title;
    req.budget = parseFloat(budget);
    next();
};

const getEnvelopes = async (req, res, next) => {
    try {
        const envelopes = await db.query("SELECT * FROM envelopes ORDER BY id ASC");
        return res.status(200).send(envelopes.rows);
    } catch(err) {
        return res.status(400).send(err.message);
    }
};

const getEnvelopeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundEnvelope = await db.query("SELECT * FROM envelopes WHERE id = $1", [id]);
        if(foundEnvelope.rows.length === 0) {
            return res.status(404).send("Envelope not found!");
        }
        return res.status(200).send(foundEnvelope.rows[0]);
    } catch(err) {  
        return res.status(500).send(err.message);
    }
};

const addEnvelope = async (req, res, next) => {
    try {
        const results = await db.query("SELECT * FROM envelopes");
        const envelopes = results.rows;
        const newId = createId(envelopes);
        const newEnvelope = await db.query("INSERT INTO envelopes (id, title, budget) VALUES ($1, $2, $3) RETURNING *", [newId, req.title, req.budget]);
        return res.status(201).send(newEnvelope.rows[0]);
    } catch(err) {
        return res.status(400).send(err.message);
    }
};

const updateEnvelope = async (req, res, next) => {
    try {
        const { id } = req.params;
        const oldEnvelope = await db.query("SELECT * FROM envelopes WHERE id = $1", [id]);
        if(oldEnvelope.rows.length === 0) {
            return res.status(404).send("Envelope not found!");
        }
        const updated = await db.query("UPDATE envelopes SET title = $1, budget = $2 WHERE id = $3 RETURNING *", [req.title, req.budget, id]);
        return res.status(201).send(updated.rows[0]);
    } catch(err) {
        return res.status(404).send(err.message);
    }
};

const deleteEnvelope = async (req, res, next) => {
    try {
        const { id } = req.params;
        const envelope = await db.query("SELECT * FROM envelopes WHERE id = $1", [id]);
        if(envelope.rows.length === 0) {
            return res.status(404).send("Envelope not found!");
        }
        await db.query("DELETE FROM envelopes WHERE id = $1", [id]);
        return res.status(204).send(`Successfully deleted envelope with id: ${id}`);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const transfer = async (req, res, next) => {
    try {
        const { fromId, toId } = req.params;
        const { amount } = req.body;
        const envelopes = await db.query("SELECT * FROM envelopes");

        const fromEnvelope = findById(envelopes.rows, fromId);
        const toEnvelope = findById(envelopes.rows, toId);

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

        const updatedFromEnvelope = await db.query("UPDATE envelopes SET budget = $1 WHERE id = $2 RETURNING *", [fromEnvelope.budget, fromId]);
        const updatedToEnvelope = await db.query("UPDATE envelopes SET budget = $1 WHERE id = $2", [toEnvelope.budget, toId]);

        return res.status(201).send(updatedFromEnvelope.rows);
    } catch (err) {
        return res.status(404).send(err.message);
    }
};

module.exports = {
    getEnvelopes,
    isValidEnvelope,
    addEnvelope,
    getEnvelopeById,
    updateEnvelope,
    deleteEnvelope,
    transfer
};