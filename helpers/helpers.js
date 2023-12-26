const createId = data => {
    let newId;
    if(data.length === 0) {
        newId = 1;
    } else {
        const lastRecord = data[data.length - 1];
        newId = lastRecord.id + 1;
    }
    if(newId === NaN || newId < 0 || newId === undefined) {
        throw new Error("Invalid ID!");
    }
    return newId;
};

const findById = (data, id) => {
    const foundRecord = data.find((item) => {
        return item.id === parseInt(id);
    });
    if(!foundRecord) {
        throw new Error(`Envelope with id ${id} not found!`);
    }
    return foundRecord;
};

const deleteById = (data, id) => {
    const foundIndex = data.findIndex((item) => item.id === parseInt(id));
    if(foundIndex === -1) {
        throw new Error(`Envelope with id ${id} not found!`);
    }
    data.splice(foundIndex, 1);
    return data;
};

module.exports = {
    createId,
    findById,
    deleteById
};