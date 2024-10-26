const path = require('path');
const express = require('express');

const handleError = (res, message, err = null, status = 500) => {
    console.error(message, err);
    res.status(status).send({ message });
};

module.exports = {
    express,
    handleError,
    router: express.Router(),
};