const multer = require('multer');



const upload = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per image
  },
});
module.exports = upload;