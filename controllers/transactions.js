const db = require('../config/db');
const { createId, updateEnvelopeBudget } = require('../helpers/helpers');

const getTransactions = async (req, res, next) => {
    try {
        const client = await db.getClient();
        const transactions = await client.query("SELECT * FROM transactions ORDER BY date");
        client.release();
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
        if(req.envelope.budget < req.amount) {
            return res.status(400).send('Transaction amount exceeds envelope budget! Transaction rejected.');
        }
        const client = await db.getClient();
        const results = await client.query("SELECT * FROM transactions ORDER BY id");
        const newId = createId(results.rows);
        const newTransaction = await client.query(
            "INSERT INTO transactions (id, date, amount, recipient, envelope_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [newId, req.date, req.amount, req.recipient, req.envelope.id]
        );
        client.release();
        
        const newEnvelopeBudget = req.envelope.budget - req.amount;
        await updateEnvelopeBudget(req.envelope, newEnvelopeBudget);
        
        return res.status(201).send(newTransaction.rows[0]);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const updateTransaction = async (req, res, next) => {
    try {
        let newEnvelopeBudget;
        const client = await db.getClient();
        if(req.transaction.envelope_id !== req.envelope.id) {
            if(req.envelope.budget < req.amount) {
                return res.status(400).send('Transaction amount exceeds new envelope budget! Transaction update rejected.');
            }
            const originalEnvelope = (await client.query("SELECT * FROM envelopes WHERE id = $1", [req.transaction.envelope_id])).rows[0];
            const newOriginalBudget = parseFloat(originalEnvelope.budget) + req.amount;
            await updateEnvelopeBudget(originalEnvelope, newOriginalBudget);

            newEnvelopeBudget = req.envelope.budget - req.amount;
        } else {
            newEnvelopeBudget = req.envelope.budget - (req.amount - req.transaction.amount);
            if(newEnvelopeBudget < 0) {
                return res.status(400).send('New transaction amount exceeds original envelope budget! Transaction update rejected.');
            }
        }

        const updatedTransaction = await client.query(
            "UPDATE transactions SET date = $1, amount = $2, recipient = $3, envelope_id = $4 WHERE id = $5 RETURNING *",
            [req.date, req.amount, req.recipient, req.envelope.id, req.transaction.id]
        );
        client.release();

        await updateEnvelopeBudget(req.envelope, newEnvelopeBudget);

        return res.status(201).send(updatedTransaction.rows[0]);
    } catch(err) {
        return res.status(500).send(err.message);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        const client = await db.getClient();
        await client.query("DELETE FROM transactions WHERE id = $1", [req.transaction.id]);

        const envelope = (await client.query("SELECT * FROM envelopes WHERE id = $1", [req.transaction.envelope_id])).rows[0];
        client.release();
        const newEnvelopeBudget = parseFloat(envelope.budget) + req.transaction.amount;
        await updateEnvelopeBudget(envelope, newEnvelopeBudget);

        return res.status(204).send(`Successfully deleted transactions with id: ${req.transaction.id}`);
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