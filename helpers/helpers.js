const db = require('../config/db');

const isValidTransaction = async (req, res, next) => {
    let { date, amount, recipient, envelopeId } = req.body;

    if(isNaN(parseInt(envelopeId)) && !isFinite(envelopeId)) {
        return res.status(400).send('Envelope ID must be an integer!');
    }
    envelopeId = parseInt(envelopeId);

    const envelope = await db.query("SELECT * FROM envelopes WHERE id = $1", [envelopeId]);
    if(envelope.rows.length === 0) {
        return res.status(400).send('Envelope not found!');
    }

    if(isNaN(parseFloat(amount)) && !isFinite(amount)) {
        return res.status(400).send('Transaction amount must be a number!');
    }

    date = !date ? new Date() : new Date(date);
    if(!(date instanceof Date && isFinite(date))) {
        return res.status(400).send('Date must be a valid date!');
    }
    const formattedDate = new Date(date.getTime()).toISOString().split("T")[0];
    
    req.date = formattedDate;
    req.amount = parseFloat(amount);
    req.recipient = recipient;
    req.envelopeId = envelopeId;
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

const findEnvelope = async (req, res, next) => {
    const { id } = req.params;
    const envelope = await db.query("SELECT * FROM envelopes WHERE id = $1", [id]);
    if(envelope.rows.length === 0) {
        return res.status(404).send("Envelope not found!");
    }
    req.envelope = envelope.rows[0];
    next();
};

const findTransaction = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
    if(transaction.rows.length === 0) {
        return res.status(404).send(`Transaction with id ${id} not found!`);
    }
    req.transaction = transaction.rows[0];
    next();
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
    if(!foundRecord) {
        throw new Error(`Envelope with id ${id} not found!`);
    }
    return foundRecord;
};

module.exports = {
    isValidEnvelope,
    isValidTransaction,
    findEnvelope,
    findTransaction,
    createId,
    findById
};