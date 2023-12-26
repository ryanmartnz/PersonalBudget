let envelopeIdCounter = 1;
let totalBudget = 0;
let envelopes = [];

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
    distributeNewBalance
};