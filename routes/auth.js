import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';

const router = express.Router();
router.use(cookieParser());

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.send({ status: true, message: 'User created' });
    } catch (error) {
        console.log('Error creating user:', error);
        res.status(500).send({ status: false, message: 'Error creating user' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send({ status: false, message: 'User not registered' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(401).send({ status: false, message: 'Incorrect password' });

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.send({ status: true });
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).send({ status: false, message: 'Login failed' });
    }
});

router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.send('Invalid email');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'RESET YOUR PASSWORD',
            text: `http://localhost:5173/resetpassword/${user._id}/${token}`
        };

        await transporter.sendMail(mailOptions);
        res.send({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'failure' });
    }
});

router.post('/resetpassword/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(400).send({ status: false, message: 'Invalid token' });

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.findByIdAndUpdate(id, { password: hashedPassword });
            res.send({ status: true, message: 'Password reset successful' });
        });
    } catch (error) {
        console.log('Error resetting password:', error);
        res.status(500).send({ status: false, message: 'Error resetting password' });
    }
});

export default router;
