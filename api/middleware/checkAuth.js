// require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
    
    //instead send tokens in request headers
    //Headers -> Authorization:"Bearer kljkdlsgjklnkaklj;ljklj.skdjfsghn"
    const token = req.headers.authorization.split(" ")[1];//second part(the token itself)
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;

    next(); //move to next

  } catch (error) {
    return res.status(401).json({ message: "Auth failed (token)" });
  }
};
