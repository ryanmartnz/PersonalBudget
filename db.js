const { env } = require("process");

let envelopeIdCounter = 1;
let totalBudget = 0;
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

const moneyFormat = number => {
    return Number(Math.round(parseFloat(number + 'e' + 2)) + 'e-' + 2);
};

const findEnvelopeById = envelopeId => {
    return envelopes.find((envelope) => envelope.id === envelopeId); 
};

const addNewEnvelope = (title) => {
    let newEnvelope = {
        title: title,
        budget: 0
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
        totalBudget += envelopes[envelopeIndex].budget;
        envelopes.splice(envelopeIndex, 1);
        return true;
    } else {
        return null;
    }
};

const distributeNewBalance = balance => {
    if(isNaN(parseFloat(balance)) && !isFinite(balance)) {
        throw new Error('Balance must be a number!');
    }
    let distributed = 0;
    for(let i = 0; i < envelopes.length; i++) {
        if(distributed >= balance) {
            break;
        }
        switch(envelopes[i].title) {
            case 'Bills':
                envelopes[i].budget += moneyFormat(balance * 0.5);
                distributed += moneyFormat(balance * 0.5);
                break;
            case 'Groceries':
                envelopes[i].budget += moneyFormat(balance * 0.1);
                distributed += moneyFormat(balance * 0.1);
                break;
            case 'Health':
                envelopes[i].budget += moneyFormat(balance * 0.1);
                distributed += moneyFormat(balance * 0.1);
                break;
            case 'Gas':
                envelopes[i].budget += moneyFormat(balance * 0.05);
                distributed += moneyFormat(balance * 0.05);
                break;
            case 'Eating Out':
                envelopes[i].budget += moneyFormat(balance * 0.05);
                distributed += moneyFormat(balance * 0.05);
                break;
            case 'Entertainment':
                envelopes[i].budget += moneyFormat(balance * 0.05);
                distributed += moneyFormat(balance * 0.05);
                break;
            default:
                envelopes[i].budget += moneyFormat(balance * 0.05);
                distributed += moneyFormat(balance * 0.05);
                break;
        }
    }
};

module.exports = {
    envelopes,
    addNewEnvelope,
    findEnvelopeById,
    updateEnvelopeById,
    deleteEnvelopeById,
    distributeNewBalance
};