const mongoose = require("mongoose");
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
        if (api == '/admin/add-book') {
            const v = new Validator(req.body, {
                title: 'required|minLength:5|maxLength:15',
                author: 'required|minLength:5|maxLength:15',
                summary: 'required|minLength:5',
            })

            let errorCheck = await v.check();

            if (!errorCheck) return sendResponse(res, false, "", v.errors);

            let bookTitleExist = await findOne('book', { title: { $regex: new RegExp(title, "i") } });
            if (bookTitleExist.data) return sendResponse(res, false, "", "This title already exist")

            let addBook = await create('book', { title, author, summary });
             
            if (!addBook.status) return sendResponse(res, false, "", addBook.message);

            return sendResponse(res, true, "", "Book added successfully");


        } else if (api == '/admin/list-book') {

            page = page ? page : 0;
            pageSize = pageSize ? pageSize : 3;

            skip = +page * pageSize;
            limit = pageSize;
            sort = { createdAt: -1 }
            let bookData = await find('book', {}, { summary: 0 }, { sort, skip, limit });
            let bookCount = await countDocuments('book', {});
            if (!bookData.status) return sendResponse(res, false, "", bookData.message);

            return sendResponse(res, true, bookData, '', bookCount);

        } else if (api == '/admin/get-single-book') {

            const v = new Validator(req.body, {

                _id: 'required',
            })

            let errorCheck = await v.check();
             

            if (!errorCheck) return sendResponse(res, false, "", v.errors);

            let bookData = await findOne('book', { _id }, { _id: 0 });
            if (!bookData.data) return sendResponse(res, false, "", "No record found")

            return sendResponse(res, true, bookData);

        } else if (api == '/admin/update-book') {

            const v = new Validator(req.body, {
                _id: 'required',
            })
            let updData= req.body;
             

            let errorCheck = await v.check();
            if (!errorCheck) return sendResponse(res, false, "", v.errors);

            let bookData = await updateOne('book', { _id }, { $set:  updData  });
            if (!bookData.status) return sendResponse(res, false, "", bookData.messages);

            return sendResponse(res, true, bookData, "book updated successfully");

        } else if (api == '/admin/delete-book') {

            const v = new Validator(req.body, {
                _id: 'required',
            })

            let errorCheck = await v.check();
            if (!errorCheck) return sendResponse(res, false, "", v.errors);

            let bookData = await deleteOne('book', { _id });
            if (!bookData.status) return sendResponse(res, false, "", bookData.messages);

            return sendResponse(res, true, bookData, "book deleted successfully");

        }


    } catch (err) {
         
        return sendResponse(res, false, "", err.message);

    }

}