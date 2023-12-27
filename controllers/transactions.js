const db = require('../config/db');
const { createId } = require('../helpers/helpers');

const getTransactions = async (req, res, next) => {
    try {
        const transactions = await db.query("SELECT * FROM transactions ORDER BY date");
        return res.status(200).send(transactions.rows);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const getTransactionById = async (req, res, next) => {
    try {
        return res.status(200).send(req.transaction);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const newTransaction = async (req, res, next) => {
    try {
        const results = await db.query("SELECT * FROM transactions ORDER BY id");
        const newId = createId(results.rows);
        const newTransaction = await db.query("INSERT INTO transactions (id, date, amount, recipient, envelope_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
                                                [newId, req.date, req.amount, req.recipient, req.envelopeId]);
        return res.status(201).send(newTransaction.rows[0]);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const updateTransaction = async (req, res, next) => {
    try {
        const updated = await db.query("UPDATE transactions SET date = $1, amount = $2, recipient = $3, envelope_id = $4 WHERE id = $5 RETURNING *",
                                        [req.date, req.amount, req.recipient, req.envelopeId, req.params.id]);
        return res.status(201).send(updated.rows[0]);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        await db.query("DELETE FROM transactions WHERE id = $1", [req.params.id]);
        return res.status(204).send(`Successfully deleted transactions with id: ${req.params.id}`);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

module.exports = {
    getTransactions,
    getTransactionById,
    newTransaction,
    updateTransaction,
    deleteTransaction
};