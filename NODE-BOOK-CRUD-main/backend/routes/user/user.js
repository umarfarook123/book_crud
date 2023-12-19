// NPM
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req,res,cb)=>{
        cb(null,Date.now())
    }
})

const upload = multer({storage});

// CONTROLLERS
const isAuthenticated = require('../../helpers/origin_check');
const {isOriginVerify,jwtVerify} = isAuthenticated;
const { bookCRUD,login } = require('../../controller/user/user-controller');


router.post('/login',isOriginVerify, login);

router.post(['/collect-book', '/list-book', '/get-single-book','/my-books','/submit-book'],jwtVerify, bookCRUD)









module.exports = router;