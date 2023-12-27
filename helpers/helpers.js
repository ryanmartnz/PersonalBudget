const db = require('../config/db');

const isValidTransaction = async (req, res, next) => {
    let { date, amount, recipient, envelopeId } = req.body;

    if(isNaN(parseInt(envelopeId)) && !isFinite(envelopeId)) {
        return res.status(400).send('Envelope ID must be an integer!');
    }
    envelopeId = parseInt(envelopeId);

    const client = await db.getClient();
    const envelope = await client.query("SELECT * FROM envelopes WHERE id = $1", [envelopeId]);
    client.release();
    if(envelope.rows.length === 0) {
        return res.status(404).send(`Envelope with id ${envelopeId} not found!`);
    }

    if(isNaN(parseFloat(amount)) && !isFinite(amount)) {
        return res.status(400).send('Transaction amount must be a number!');
    }
    amount = parseFloat(amount);

    date = !date ? new Date() : new Date(date);
    if(!(date instanceof Date && isFinite(date))) {
        return res.status(400).send('Date must be a valid date!');
    }
    const formattedDate = new Date(date.getTime()).toISOString().split("T")[0];
    
    req.date = formattedDate;
    req.amount = amount;
    req.recipient = recipient;
    req.envelope = envelope.rows[0];
    req.envelope.budget = parseFloat(req.envelope.budget);
    next();
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

const findEnvelope = async (req, res, next, id) => {
    const envelopeId = Number(id);
    const client = await db.getClient();
    const envelope = await client.query("SELECT * FROM envelopes WHERE id = $1", [envelopeId]);
    client.release();
    if(envelope.rows.length === 0) {
        return res.status(404).send(`Envelope with id ${envelopeId} not found!`);
    }
    req.envelope = envelope.rows[0];
    req.envelope.budget = parseFloat(req.envelope.budget);
    next();
};

const findTransaction = async (req, res, next, id) => {
    const transactionId = Number(id);
    const client = await db.getClient();
    const transaction = await client.query("SELECT * FROM transactions WHERE id = $1", [transactionId]);
    client.release();
    if(transaction.rows.length === 0) {
        return res.status(404).send(`Transaction with id ${transactionId} not found!`);
    }
    req.transaction = transaction.rows[0];
    req.transaction.amount = parseFloat(req.transaction.amount);
    next();
};

const updateEnvelopeBudget = async (envelope, newEnvelopeBudget) => {
    const client = await db.getClient();
    await client.query("UPDATE envelopes SET budget = $1 WHERE id = $2", [newEnvelopeBudget, envelope.id]);
    client.release();
};

const createId = data => {
    let newId;
    if(data.length === 0) {
        newId = 1;
    } else {
        const lastRecord = data[data.length - 1];
        newId = lastRecord.id + 1;
    }
    if(newId === NaN || newId < 0 || newId === undefined) {
        throw new Error("Invalid ID!");
    }
    return newId;
};

const findById = (data, id) => {
    const foundRecord = data.find((item) => {
        return item.id === parseInt(id);
    });
    return foundRecord;
};

module.exports = {
    isValidEnvelope,
    isValidTransaction,
    findEnvelope,
    findTransaction,
    updateEnvelopeBudget,
    createId,
    findById
};