const express = require('express');
const app = express();
const logger = require("morgan");

const envelopesRouter = require('./routes/envelope');

app.use(logger("dev"));
app.use(express.json());

app.use('/api/v1/envelopes', envelopesRouter);

const PORT = process.env.PORT || 4000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
