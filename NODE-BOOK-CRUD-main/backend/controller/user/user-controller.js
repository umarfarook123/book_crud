const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectId = mongoose.Types.ObjectId;
const sendResponse = require("../../helpers/send_response");
const {
    create,
    find,
    findOne,
    updateOne,
    deleteOne,
    countDocuments,
} = require("../../helpers/query_helper");
const { Validator } = require('node-input-validator');



exports.bookCRUD = async (req, res) => {
    let api = req.originalUrl;
     

    let { title, author, summary, page, pageSize, _id } = req.body;
    try {

        if (api == '/user/list-book') {

            page = page ? page : 0;
            pageSize = pageSize ? pageSize : 3;

            skip = +page * pageSize;
            limit = pageSize;
            sort = { createdAt: -1 }
            let bookData = await find('book', {}, { summary: 0 }, { sort, skip, limit });
            let bookCount = await countDocuments('book', {});
            if (!bookData.status) return sendResponse(res, false, "", bookData.message);

            return sendResponse(res, true, bookData, '', bookCount);

        } else if (api == '/user/get-single-book') {

            const v = new Validator(req.body, {

                _id: 'required',
            })

            let errorCheck = await v.check();
             

            if (!errorCheck) return sendResponse(res, false, "", v.errors);

            let bookData = await findOne('book', { _id }, { _id: 0 });
            if (!bookData.data) return sendResponse(res, false, "", "No record found")

            return sendResponse(res, true, bookData);

        } else if (api == '/user/collect-book') {

            const v = new Validator(req.body, {
                _id: 'required',
            })

            let errorCheck = await v.check();
            if (!errorCheck) return sendResponse(res, false, "", v.errors);


            let bookData = await updateOne('USERS', { _id: req.userId }, { $addToSet: { books: _id } });
            if (!bookData.status) return sendResponse(res, false, "", bookData.messages);

            return sendResponse(res, true, bookData, "book colleted successfully");

        }else if (api == '/user/my-books') {

            page = page ? page : 0;
            pageSize = pageSize ? pageSize : 3;

            skip = +page * pageSize;
            limit = pageSize;
            sort = { createdAt: -1 };
            let {data:userData} = await findOne('USERS', { _id:req.userId }, { books: 1 });
             
             

            let bookData = await find('book', { _id:{$in: userData.books }}, { summary: 0 }, { sort, skip, limit });
             
            let bookCount = await countDocuments('book',  {book:{ $in: userData.books} } );
            if (!bookData.status) return sendResponse(res, false, "", bookData.message);

            return sendResponse(res, true, bookData, '', bookCount);

        }
        else if (api == '/user/submit-book') {

            const v = new Validator(req.body, {
                _id: 'required',
            })

            let errorCheck = await v.check();
            if (!errorCheck) return sendResponse(res, false, "", v.errors);


            let bookData = await updateOne('USERS', { _id: req.userId }, { $pull: { books: _id } });
            if (!bookData.status) return sendResponse(res, false, "", bookData.messages);

            return sendResponse(res, true, bookData, "book colleted successfully");

        } 


    } catch (err) {
         
        return sendResponse(res, false, "", err.message);

    }

}

exports.login = async (req, res) => {
    let { email, password } = req.body;
    try {
        const v = new Validator(req.body, {
            email: 'required|email',
            password: 'required|minLength:8|maxLength:15',
        })

        let errorCheck = await v.check();
        if (!errorCheck) return sendResponse(res, false, "", v.errors);

        var { data: userData } = await findOne('USERS', { email });

        if (!userData) {
            password = await bcrypt.hash(password, 12)
            var { data: userData } = await create('USERS', { email, password });
             
        }
        else {
            let passCheck = await bcrypt.compare(password, userData.password);
            if (!passCheck) return sendResponse(res, false, "", "Invalid password");
        }

        let loginToken = await jwt.sign({ userId: String(userData._id) }, 'SECRETDKHDWK', { expiresIn: '1h' });

        return sendResponse(res, true, loginToken, 'success');

    } catch (err) {
         
        return sendResponse(res, false, "", err.message);

    }

}