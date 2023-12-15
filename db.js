let envelopeIdCounter = 1;
let totalBudget = 3000;
let envelopes = [];

const isValidEnvelope = envelope => {
    if(typeof envelope.title !== 'string') {
        throw new Error('Envelope title must be a string!');
    } 
    if(isNaN(parseFloat(envelope.budget)) && !isFinite(envelope.budget)) {
        throw new Error('Envelope budget must be a number!');
    }
    return true;
};

const findEnvelopeById = envelopeId => {
    return envelopes.find((envelope) => envelope.id === envelopeId); 
};

const addNewEnvelope = (title, budget) => {
    let newEnvelope = {
        title: title,
        budget: budget
    };
    if(isValidEnvelope(newEnvelope)) {
        newEnvelope.id = `${envelopeIdCounter++}`;
        envelopes.push(newEnvelope);
        return envelopes[envelopes.length - 1];
    }
};

const updateEnvelopeById = (envelopeId, title, budget) => {
    const envelopeIndex = envelopes.findIndex((envelope) => envelope.id === envelopeId); 
    let newEnvelope = {
        title: title,
        budget: budget
    };
    if(envelopeIndex > -1 && isValidEnvelope(newEnvelope)) {
        const budgetUsed = Number(envelopes[envelopeIndex].budget) - Number(budget);
        totalBudget -= budgetUsed;

        newEnvelope.id = `${envelopeId}`;
        envelopes[envelopeIndex] = newEnvelope;
        return envelopes[envelopeIndex];
    } else {
        return null;
    }
};

const deleteEnvelopeById = envelopeId => {
    const envelopeIndex = envelopes.findIndex((envelope) => envelope.id === envelopeId);
    if(envelopeIndex > -1) {
        envelopes.splice(envelopeIndex, 1);
        return true;
    } else {
        return null;
    }
};

module.exports = {
    envelopes,
    addNewEnvelope,
    findEnvelopeById,
    updateEnvelopeById,
    deleteEnvelopeById
};