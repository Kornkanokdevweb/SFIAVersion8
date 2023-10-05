import { Router } from "express";
const { register, login, logout, updateUser, verifyOTPHandler, createResetSession, resetPassword, authenticateUser, refreshToken } = require('../controllers/authController')
const { verifyUser , localVariables, upload, requireAuth } = require('../middlewares/authMiddleware.ts')
const { registerMail, generateOTPHandler } = require('../controllers/mailerController')

const router = Router();

//**POST Methods */
router.post('/register', register); // register user
router.post('/registerMail', registerMail); // send the email
router.post('/login', login); // login in app
router.post('/logout', logout); // logout in app 
router.post('/refresh', refreshToken); // refresh token

//**GET Methods */
router.get('/user', authenticateUser); //authenticate user
router.get('/generateOTP', verifyUser, localVariables, generateOTPHandler); // generate random OTP
router.get('/verifyOTP', verifyUser, verifyOTPHandler); // verify generate OTP
router.get('/createResetSession', createResetSession)

//**PUT Methods *
router.put('/updateUser', requireAuth, upload, updateUser); // is use to update the user profile
router.put('/resetPassword', verifyUser ,resetPassword); // use to reset password

module.exports = router