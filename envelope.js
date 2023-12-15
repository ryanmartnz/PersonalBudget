const envelopesRouter = require('express').Router();

module.exports = envelopesRouter;

const { envelopes, addNewEnvelope, findEnvelopeById, updateEnvelopeById } = require('./db');

envelopesRouter.param('id', (req, res, next, id) => {
    const envelope = findEnvelopeById(id);
    if(envelope) {
        req.envelope = envelope;
        next();
    } else {
        res.status(404).send('Envelope Not Found!');
    }
});

envelopesRouter.get('/', (req, res, next) => {
    res.status(200).send(envelopes);
});

envelopesRouter.get('/:id', (req, res, next) => {
    res.status(200).send(req.envelope);
});

envelopesRouter.put('/:id', (req, res, next) => {
    try {
        const updatedEnvelope = updateEnvelopeById(req.params.id, req.body.title, req.body.budget);
        res.status(201).send(updatedEnvelope);
    } catch(err) {
        res.status(400).send(err.message);
    }
});

envelopesRouter.post('/', (req, res, next) => {
    try {
        const newEnvelope = addNewEnvelope(req.body.title, req.body.budget);
        res.status(201).send(newEnvelope);
    } catch(err) {
        res.status(400).send(err.message);
    }
});