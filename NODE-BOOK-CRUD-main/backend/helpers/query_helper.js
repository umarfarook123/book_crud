const db = require("../helpers/collections");

exports.find = async(collection, query, projection, options) => {
    if (!collection) return { status: false, message: "collection not found" };
    try {
        let data = await db[collection].find(query, projection, options);
        return { status: true, data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

exports.findOne = async(collection, query, projection, options) => {
    if (!collection) return { status: false, message: "collection not found" };
    try {
        let data = await db[collection].findOne(query, projection, options);
         

        return { status: true, data };

    } catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
};


exports.create = async(collection, info) => {
    if (!collection) return { status: false, message: "collection not found" };

    try {
        let data = await db[collection].create(info);
        return { status: true, data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

exports.updateOne = async(collection, query, updInfo) => {
    if (!collection) return { status: false, message: "collection not found" };

    try {
        let data = await db[collection].findOne(query);
        if (!data) return { status: false, message: "data not found" };

        let updData = await db[collection].updateOne(query, 
            updInfo
        );
        return { status: true, updData };
    } catch (err) {
         
        return { status: false, message: err.message };
    }
};

exports.deleteOne = async(collection, query) => {
    if (!collection) return { status: false, message: "collection not found" };

    try {
        let data = await db[collection].findOne(query);
         
        if (!data) return { status: false, message: "data not found" };

        let deletedData = await db[collection].deleteOne({ _id: data._id });
        return { status: true, deletedData };

    } catch (err) {
        return { status: false, message: err.message };
    }
};

exports.countDocuments = async(collection, query) => {
    if (!collection) return { status: false, message: "collection not found" };

    try {
        let data = await db[collection].countDocuments(query);

        return data;

    } catch (err) {
        return { status: false, message: err.message };
    }
};


exports.getSingleData = (collection, cond, select, callback) => {
    try {
        let schema = findSchema(collection);

        schema.findOne(cond).exec((err, results) => {
            if (err) {
                callback("error", err);
            } else if (!results) {
                callback(false);
            } else {
                callback(true, results);
            }
        });
    } catch (err) {
        callback("error", err);
    }
};

exports.getMultipleData = (collection, query, projection, info, callback) => {
    try {
        let schema = findSchema(collection);

        let filter = info.filter || "";
        let pageNo = parseInt(info.pageIndex) || 0;
        let size = parseInt(info.pageSize);
        let sortName = info.sortActive;
        let sort = {};
        sort[sortName] = info.sortOrder == "desc" ? -1 : 1;
        let skip = size * pageNo;
        let limit = size;

        let search = {};
        let regex = new RegExp(filter, "i");
        let searchFields = info.searchFields;

        let len = searchFields ? searchFields.length : 0;
        if (len > 0) {
            if (len === 1) {
                search = {
                    [searchFields[0]]: regex
                };
            } else {
                for (let i = 0; i < len; i++) {
                    search["$or"] = [];
                    searchFields.forEach(function(field) {
                        var query = {};
                        query[field] = { $regex: filter, $options: "i" };
                        search["$or"].push(query);
                    });
                }
            }
        }
        if (Object.keys(query).length > 0) {
            search = {...query, ...search };
        }

        async.parallel({
                totalCount: function(cb) {
                    schema.find(search, projection).countDocuments().exec(cb);
                },
                totalData: function(cb) {
                    schema
                        .find(search, projection)
                        .limit(limit)
                        .skip(skip)
                        .sort(sort)
                        .exec(cb);
                },
            },
            function(err, results) {
                if (err) {
                    c(err);
                    callback("error", err);
                } else if (results.totalCount === 0) {
                    callback(false, [], results.totalCount);
                } else {
                    callback(true, results.totalData, results.totalCount);
                }
            }
        );
    } catch (err) {
        c(err);
        callback("error", err);
    }
};

exports.createSingleData = (collection, info, callback) => {
    try {
        let schema = findSchema(collection);

        schema.create(info, (err, created) => {
            if (err) {
                callback("error", err);
            } else if (!created) {
                callback(false);
            } else {
                callback(true, created);
            }
        });
    } catch (err) {
        c(err);
        callback("error", err);
    }
};

exports.getDataCount = (collection, cond, callback) => {
    try {
        let schema = findSchema(collection);

        schema
            .find(cond)
            .countDocuments()
            .exec((err, count) => {
                if (err) {
                    callback("error", err);
                } else {
                    callback(true, count);
                }
            });
    } catch (err) {
        callback("error", err);
    }
};

exports.removeSingleData = (collection, condition) => {
    try {
        let schema = findSchema(collection);

        schema.findOne(condition, (err, resp) => {
            if (resp) {
                schema.findOneAndRemove({ _id: resp._id }, (err, removed) => {
                    if (err) {
                        c(err);
                        callback("error", err, "Remove failed");
                    } else {
                        callback(true, removed, "Removed successfully");
                    }
                });
            } else {
                c(err);
                callback(false, "", "Data not found");
            }
        });
    } catch (err) {
        c(err);
        callback("error", err);
    }
};

exports.getAllData = (collection, query, projection, options, callback) => {
    try {
        let schema = findSchema(collection);

        schema.find(query, projection, options, (err, results) => {
            if (err) {
                callback("error", err);
            } else if (!results) {
                callback(false);
            } else {
                callback(true, results);
            }
        });
    } catch (err) {
        callback("error", err);
    }
};

exports.countData = (collection, query, callback) => {
    try {
        let schema = findSchema(collection);

        schema.countDocuments(query, (err, count) => {
            if (err) {
                callback(false, err);
            } else {
                callback(true, count);
            }
        });
    } catch (err) {
        callback("error", err);
    }
};

exports.aggregate = (collection, aggregation, callback) => {
    try {
        let schema = findSchema(collection);

        const {
            matchData,
            convert,
            joinCollection,
            projection,
            limit,
            sort,
            unwind,
            skip,
            skiptop,
        } = aggregation;

        //  

        let aggregated = schema.aggregate();
        if (matchData) {
            aggregated.match(matchData);
        }
        if (sort) {
            aggregated.sort(sort);
        }
        if (skip && skiptop) {
            aggregated.skip(Number(skip));
        }
        if (convert) {
            for (let key1 in convert) {
                aggregated.addFields(convert[key1]);
            }
        }
        if (joinCollection) {
            aggregated.lookup({
                from: joinCollection["from"],
                localField: joinCollection["localField"],
                foreignField: joinCollection["foreignField"],
                as: joinCollection["returnName"],
            });
        }
        if (unwind) {
            aggregated.unwind({
                path: "$" + unwind,
                preserveNullAndEmptyArrays: true,
            });
        }
        if (projection) {
            aggregated.project(projection);
        }
        if (skip && !skiptop) {
            aggregated.skip(Number(skip));
        }
        if (limit) {
            aggregated.limit(limit);
        }
        aggregated.allowDiskUse(true);

        aggregated.exec((err, data) => {
            if (err) {
                callback("error", err);
            } else {
                callback(true, data);
            }
        });
    } catch (err) {
        c(err);
        callback("error", err);
    }
};

exports.getCounts = (collection, query, callback) => {
    try {
        let schema = findSchema(collection);

        schema.countDocuments(query, (err, count) => {
            if (err) {
                c(err);
                callback(false);
            } else {
                callback(count);
            }
        });
    } catch (err) {
        c(err);
        sendResponse(res, "error", err);
    }
};