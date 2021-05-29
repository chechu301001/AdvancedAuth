const router = require('express').Router();
const {register, login, forgotpassword, resetpassword} = require('../controllers/auth');


router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotpassword);
router.put('/resetpassword/:restToken', resetpassword);

module.exports = router;