const express = require('express');
const router = express.Router();

module.exports = router;

const {
    getTransactions,
    getTransactionById,
    newTransaction,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactions");

const {
    isValidTransaction,
    findTransaction
} = require("../helpers/helpers");

router.param('id', findTransaction);

router.get('/', getTransactions);

router.get('/:id', getTransactionById);

router.put('/:id', isValidTransaction, updateTransaction);

router.post('/', isValidTransaction, newTransaction);

router.delete('/:id', deleteTransaction);