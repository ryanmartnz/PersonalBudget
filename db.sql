CREATE TABLE envelopes (
    id INTEGER PRIMARY KEY,
    title VARCHAR(50),
    budget DECIMAL(12, 2)
);

CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    date DATE,
    amount DECIMAL(12, 2) NOT NULL,
    recipient VARCHAR(50),
    envelope_id INTEGER NOT NULL REFERENCES envelopes(id) ON DELETE CASCADE
);