// NPM
const express = require('express');
const router = express.Router();

// CONTROLLERS
const isAuthenticated = require('../../helpers/origin_check');
const isOriginVerify = isAuthenticated.isOriginVerify;
const { bookCRUD } = require('../../controller/admin/admin-controller');



router.post(['/add-book', '/list-book', '/get-single-book', '/update-book', '/delete-book'], bookCRUD)



module.exports = router;