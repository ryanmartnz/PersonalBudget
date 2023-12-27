const express = require('express');
const app = express();
const logger = require("morgan");

const envelopesRouter = require('./routes/envelope');
const transactionRouter = require('./routes/transaction');
const docsRouter = require("./routes/docs");

app.use(logger("dev"));
app.use(express.json());

app.use('/api-docs', docsRouter);
app.use('/api/v1/envelopes', envelopesRouter);
app.use('/api/v1/transactions', transactionRouter);

app.get('/', (req, res) => res.status(200).send());

// Add a new route for the health endpoint 
app.get("/health", (req, res) => {
  res.sendStatus(200); 
}); 

const PORT = process.env.PORT || 4000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
