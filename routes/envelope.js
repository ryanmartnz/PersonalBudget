const express = require('express');
const router = express.Router();

module.exports = router;

const {
    getEnvelopes,
    addEnvelope,
    getEnvelopeById,
    deleteEnvelope,
    updateEnvelope,
    transfer,
} = require("../controllers/envelopes");

const {
    isValidEnvelope,
    findEnvelope
} = require("../helpers/helpers");

router.param('id', findEnvelope);

/**
 * @swagger
 * /api/v1/envelopes:
 *   get:
 *     summary: Gets all the envelopes and their data.
 *     description: Retrieve the envelopes and their data from the database.
 *     operationId: get_envelopes
 *     responses:
 *       '200':
 *         description: Returns a list of all envelopes.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Envelopes
 */
router.get('/', getEnvelopes);

/**
 * @swagger
 * /api/v1/envelopes:
 *   post:
 *     summary: Creates a new envelope.
 *     description: Creates a new envelope by taking the title and budget of the envelope and inserting it into the database.
 *     operationId: add_envelope
 *     requestBody:
 *       description: Data for new envelope.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               budget:
 *                 type: number
 *             example:
 *               title: Scuba lessons
 *               budget: 300
 *     responses:
 *       '201':
 *         description: Envelope created successfully.
 *       '400':
 *         description: Body title or budget provided is not the proper type.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Add Envelope
 */
router.post('/', isValidEnvelope, addEnvelope);

/**
 * @swagger
 * /api/v1/envelopes/{id}:
 *   get:
 *     summary: Gets an envelope with matching id.
 *     description: Retrieves an envelope that matches the provided id.
 *     operationId: get_envelope_by_id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the envelope.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Returns the matching envelope.
 *       '404':
 *         description: Envelope with matching id not found.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Envelopes
 */
router.get('/:id', getEnvelopeById);

/**
 * @swagger
 * /api/v1/envelopes/{id}:
 *   put:
 *     summary: Updates an envelope.
 *     description: Updates the matching envelope with the request body's title and budget.
 *     operationId: update_envelope
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the envelope.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Data to update the envelope.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               budget:
 *                 type: number
 *             example:
 *               title: Scuba lessons
 *               budget: 300
 *     responses:
 *       '201':
 *         description: Envelope updated successfully.
 *       '400':
 *         description: Body title or budget provided is not the proper type.
 *       '404':
 *         description: Envelope with matching id not found.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Update Envelope
 */
router.put('/:id', isValidEnvelope, updateEnvelope);

/**
 * @swagger
 * /api/v1/envelopes/{id}:
 *   delete:
 *     summary: Deletes an envelope.
 *     description: Deletes the envelope with matching id from the database.
 *     operationId: delete_envelope
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the envelope.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Envelope deleted successfully.
 *       '404':
 *         description: Envelope with matching id not found.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Delete Envelope
 */
router.delete('/:id', deleteEnvelope);

/**
 * @swagger
 * /api/v1/envelopes/{fromId}/transfer/{toId}:
 *   post:
 *     summary: Transfers an amount from one envelope to another.
 *     description: Transfers an amount from one envelope's budget to the other envelope's budget.
 *     operationId: transfer
 *     parameters:
 *       - name: fromId
 *         in: path
 *         description: The id of the envelope to transfer from.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: toId
 *         in: path
 *         description: The id of the envelope to transfer to.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: The amount to transfer.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *             example:
 *               amount: 200
 *     responses:
 *       '201':
 *         description: Amount transferred successfully.
 *       '400':
 *         description: Transfer amount provided is not a number or the amount to transfer exceeds the transferor envelope's budget.
 *       '404':
 *         description: One or more of the matching envelopes could not be found.
 *       '500':
 *         description: Internal Error.
 *     tags:
 *       - Transfer
 */
router.post('/:fromId/transfer/:toId', transfer);