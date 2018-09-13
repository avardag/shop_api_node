const multer = require("multer"); //for image uploads

//where to store images & set name of stored file
const imgStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/'); //null for errs
  },
  filename: function(req, file, cb) {
    //concat date with original name of file
    cb(null, (new Date().toISOString() + file.originalname));
  }
});
//filter image formats
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); //null for errs, true for save
  } else {
    cb(null, false); //false for save
  }
};

//EXPORT
module.exports = multer({
  storage: imgStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 3 } //3MB
});