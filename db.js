let envelopeIdCounter = 1;
const totalBudget = 3000;
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
}

module.exports = {
    addNewEnvelope
};