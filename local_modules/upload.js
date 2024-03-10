const multer = require("multer")
const upload = multer({ dest: "../public/imgs/uploads/" })

let storate = multer.diskStorage({
    destination: function(req, file, cb) {
        db(null, 'uploads')
    }
})
