const envelopesRouter = require('express').Router();

module.exports = envelopesRouter;

const { addNewEnvelope } = require('./db');

envelopesRouter.get('/', (req, res, next) => {
    res.send('Hello, World!');
});

envelopesRouter.post('/', (req, res, next) => {
    try {
        const newEnvelope = addNewEnvelope(req.body.title, req.body.budget);
        res.status(201).send(newEnvelope);
    } catch(err) {
        res.status(400).send(err.message);
    }
});