import { Router } from "express";
import { Request, Response } from "express";
const { register, login, logout, updateUser, generateOTPHandler, verifyOTPHandler, createResetSession, resetPassword, authenticateUser, refreshToken } = require('../controllers/authController')
const { verifyUser ,requireAuth, localVariables, upload } = require('../middlewares/authMiddleware.ts')

const router = Router();

//**POST Methods */
router.post('/register', register); // register user
// router.post('/registerMail'); // send the email
router.post('/login', login); // login in app
router.post('/logout', logout); // logout in app 
router.post('/refresh', refreshToken); // refresh token

//**GET Methods */
router.get('/user', authenticateUser); //authenticate user
router.get('/generateOTP', verifyUser, localVariables, generateOTPHandler); // generate random OTP
router.get('/verifyOTP', verifyOTPHandler); // verify generate OTP
router.get('/createResetSession', createResetSession)

//**PUT Methods *
router.put('/updateUser', upload, updateUser); // is use to update the user profile
router.put('/resetPassword', verifyUser ,resetPassword); // use to reset password

//**Test Protecting Routes */
router.get('/test', requireAuth, (req: Request, res: Response) => res.send('Test')); // test protecting routes
// router.post('/resetPassword', verifyUser ,resetPassword)

module.exports = router