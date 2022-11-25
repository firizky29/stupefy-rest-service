import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('src', 'storage'));
    }
});


const upload = multer({
    storage: storage
});

export default upload;