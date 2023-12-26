const dbEnvelopes = require('../config/db');
const { createId, findById, deleteById } = require('../helpers/helpers');

const getEnvelopes = async (req, res, next) => {
    try {
        const envelopes = await dbEnvelopes;
        res.status(200).send(envelopes);
    } catch(err) {
        res.status(400).send(err.message);
    }
};

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

const addEnvelope = async (req, res, next) => {
    try {
        const envelopes = await dbEnvelopes;
        const newId = createId(envelopes);
        const newEnvelope = {
            id: newId,
            title: req.title,
            budget: req.budget
        };
        envelopes.push(newEnvelope);
        res.status(201).send(newEnvelope);
    } catch(err) {
        res.status(400).send(err.message);
    }
};

const getEnvelopeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const envelopes = await dbEnvelopes;
        const enve = findById(envelopes, id);
        res.status(200).send(enve);
    } catch(err) {  
        res.status(404).send(err.message);
    }
};

const updateEnvelope = async (req, res, next) => {
    try {
        const { id } = req.params;
        const envelopes = await dbEnvelopes;
        const oldEnvelope = findById(envelopes, id);
        oldEnvelope.title = req.title;
        oldEnvelope.budget = req.budget;
        res.status(201).send(envelopes);
    } catch(err) {
        res.status(404).send(err.message);
    }
};

const deleteEnvelope = async (req, res, next) => {
    try {
        const { id } = req.params;
        const envelopes = await dbEnvelopes;
        const updatedEnvelopes = deleteById(envelopes, id);
        res.status(204).send(updatedEnvelopes);
    } catch(err) {
        res.status(404).send(err.message);
    }
};

const transfer = async (req, res, next) => {
    try {
        const { fromId, toId } = req.params;
        const { amount } = req.body;
        const envelopes = await dbEnvelopes;

        const fromEnvelope = findById(envelopes, fromId);
        const toEnvelope = findById(envelopes, toId);

        if(isNaN(parseFloat(amount)) && !isFinite(amount)) {
            return res.status(400).send('Transfer amount must be a number!');
        }

        const numAmount = parseFloat(amount);

        if(fromEnvelope.budget < numAmount) {
            return res.status(400).send("Amount to transfer exceeds the original envelope's budget");
        }
        
        fromEnvelope.budget -= numAmount;
        toEnvelope.budget += numAmount;
        res.status(201).send(fromEnvelope);
    } catch (err) {
        res.status(404).send(err.message);
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