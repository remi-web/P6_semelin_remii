const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const authToModify = require('../middleware/auth-modify')
const multer = require('../middleware/multer-config')
const sauce = require('../controllers/sauces')

router.post('/', auth,multer,sauce.createSauce);
router.put('/:id', auth, authToModify, multer,sauce.modifySauce);
router.delete('/:id', auth, authToModify, sauce.deleteSauce);
router.get('/:id',auth,sauce.getOneSauce);
router.get('/',auth, multer,sauce.getAllSauces);
router.post('/:id/like', auth, sauce.likedSauce)

module.exports = router;