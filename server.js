const express = require('express');
const app = express();

const PORT = 3001;

app.get('/', (req, res, next) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
