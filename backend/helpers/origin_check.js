const allowedOrigins = ["http://localhost:3000"];
const jwt = require("jsonwebtoken");

exports.isOriginVerify = (req, res, next) => {
  let origin = req.headers["origin"];
   
  var index = allowedOrigins.indexOf(origin);
  if (index > -1) {
    next();
  } else {
    return res.json({ status: 401, message: "Unauthorized Request" });
  }
};

exports.jwtVerify = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) return res.json({ status: 401, message: "token is required" });

  try {
    req.userId = jwt.verify(token, "SECRETDKHDWK").userId;
    next()
  } catch (err) {
     
    return res.json({ status: 400, message: "Invalid token" });
  }
};
