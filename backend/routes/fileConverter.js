const express = require('express');
const multer = require('multer');
const { convertFile } = require('../controllers/fileConverterController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/convert', upload.single('file'), convertFile);


module.exports = router;
