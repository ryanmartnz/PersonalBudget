const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const envelopesRouter = require('./envelope');

const PORT = 3001;

app.use(bodyParser.json());
app.use('/envelopes', envelopesRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
