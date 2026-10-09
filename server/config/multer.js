const multer = require('multer');



const upload = multer({
    storage: multer.diskStorage({}),
    limits:{fileSize:500000}
})

module.exports = upload;