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

router.get('/', getTransactions);

router.get('/:id', findTransaction, getTransactionById);

router.put('/:id', isValidTransaction, findTransaction, updateTransaction);

router.post('/', isValidTransaction, newTransaction);

router.delete('/:id', findTransaction, deleteTransaction);