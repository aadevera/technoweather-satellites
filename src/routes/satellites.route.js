const router = require('express').Router();
const mime = require('mime-types');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/img/uploads');
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}.${mime.extension(file.mimetype)}`);
  },
});
const upload = multer({ storage });
const { satellitesController } = require('../controllers');

router.get('/', satellitesController.getAll);
router.post('/', upload.single('satellite'), satellitesController.upload);

module.exports = router;
