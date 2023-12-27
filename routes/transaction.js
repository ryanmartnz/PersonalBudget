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

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Gets all transactions
 *     description: Retrieves all transactions from the database and their associated data.
 *     operationId: get_transactions
 *     responses:
 *       '200':
 *         description: Returns a list of all transactions.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Transactions
 */
router.get('/', getTransactions);

/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Creates a new transactions
 *     description: Creates a new transaction, adds the transaction to the database, and updates the target envelope's budget.
 *     operationId: new_transactions
 *     requestBody:
 *       description: Data for new transaction.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               amount:
 *                 type: number
 *               recipient:
 *                 type: string
 *               envelopeId:
 *                 type: integer
 *             example:
 *               date: '2023-12-27'
 *               amount: 246.98
 *               recipient: Grocery Store
 *               envelopeId: 2
 *     responses:
 *       '201':
 *         description: Transaction created successfully.
 *       '400':
 *         description: Request body properties provided are not the proper types or the transaction amount exceeds the envelope's budget.
 *       '404':
 *         description: The provided envelope id does not match an existing envelope.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - New Transaction
 */
router.post('/', isValidTransaction, newTransaction);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Gets the transaction with matching id.
 *     description: Retrieves a specific transaction from the database with a matching id.
 *     operationId: get_transaction_by_id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the transaction.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Returns the matching transaction.
 *       '404':
 *         description: Transaction with matching id not found.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Transactions
 */
router.get('/:id', getTransactionById);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   put:
 *     summary: Updates a transaction
 *     description: Updates the matching transaction with data provided in the body, and updates the target envelope's budget.
 *     operationId: update_transaction
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the transaction.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Data for new transaction.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               amount:
 *                 type: number
 *               recipient:
 *                 type: string
 *               envelopeId:
 *                 type: integer
 *             example:
 *               date: '2023-12-27'
 *               amount: 246.98
 *               recipient: Grocery Store
 *               envelopeId: 2
 *     responses:
 *       '201':
 *         description: Transaction updated successfully.
 *       '400':
 *         description: Request body properties provided are not the proper types or the transaction amount exceeds the envelope's budget.
 *       '404':
 *         description: Transaction or envelope with matching id not found.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Update Transaction
 */
router.put('/:id', isValidTransaction, updateTransaction);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   delete:
 *     summary: Deletes a transaction.
 *     description: Removes a transaction from the database and adds the transaction amount back to the target envelope's budget.
 *     operationId: delete_transaction
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the transaction.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Transaction deleted successfully.
 *       '404':
 *         description: Transaction with matching id not found.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Delete Transaction
 */
router.delete('/:id', deleteTransaction);