const envelopesRouter = require('express').Router();

module.exports = envelopesRouter;

const { envelopes, addNewEnvelope, findEnvelopeById, updateEnvelopeById, deleteEnvelopeById } = require('./db');

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

envelopesRouter.delete('/:id', (req, res, next) => {
    if(deleteEnvelopeById(req.params.id)) {
        res.status(204).send();
    } else {
        res.status(500).send();
    }
});

envelopesRouter.post('/transfer/:from/:to', (req, res, next) => {
    try {
        const fromEnvelope = findEnvelopeById(req.params.from);
        const toEnvelope = findEnvelopeById(req.params.to);
        if(fromEnvelope && toEnvelope) {
            const toEnvelopeNewBudget = Number(fromEnvelope.budget) + Number(toEnvelope.budget);
            updateEnvelopeById(toEnvelope.id, toEnvelope.title, toEnvelopeNewBudget);
            updateEnvelopeById(fromEnvelope.id, fromEnvelope.title, 0);
            res.status(201).send(`Budget of \$${fromEnvelope.budget} successfully transferred from ${fromEnvelope.title} to ${toEnvelope.title}.`);
        } else if(!fromEnvelope) {
            res.status(404).send(`Envelope with id #${req.params.from} not found!`);
        } else if(!toEnvelope) {
            res.status(404).send(`Envelope with id #${req.params.to} not found!`);
        }
    } catch(err) {
        res.status(500).send(err.message);
    }
});