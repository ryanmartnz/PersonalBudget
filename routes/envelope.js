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

router.get('/', getEnvelopes);

router.get('/:id', getEnvelopeById);

router.put('/:id', isValidEnvelope, updateEnvelope);

router.post('/', isValidEnvelope, addEnvelope);

router.delete('/:id', deleteEnvelope);

router.post('/:fromId/transfer/:toId', transfer);

// envelopesRouter.post('/distribute/:balance', (req, res, next) => {
//     try {
//         distributeNewBalance(req.params.balance);
//         res.status(201).send(envelopes);
//     } catch(err) {
//         res.status(500).send(err.message);
//     }
// });