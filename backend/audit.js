const axios = require('axios');
const mongoose = require('mongoose');
const colors = require('colors'); // Or use manual codes if colors not installed, I'll use manual to be safe

// Manual colors
const clr = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    bold: "\x1b[1m"
};

const API_URL = 'http://localhost:5000/api';
const MONGO_URI = 'mongodb://localhost:27017/skill_connect';

// Mongoose Models (Need to define simple schemas or require them if available, seeing as we are in backend dir we can require)
const User = require('./models/User');
const Trainer = require('./models/Trainer');
const Booking = require('./models/Booking');

const log = (msg, type = 'info') => {
    if (type === 'success') console.log(`${clr.green}✔ ${msg}${clr.reset}`);
    else if (type === 'error') console.log(`${clr.red}✖ ${msg}${clr.reset}`);
    else if (type === 'header') console.log(`\n${clr.cyan}${clr.bold}=== ${msg} ===${clr.reset}`);
    else console.log(`${clr.reset}${msg}`);
};

const runAudit = async () => {
    try {
        log('STARTING ZERO AUDIT', 'header');

        // 1. Connect and Clear DB
        log('1. System Reset');
        await mongoose.connect(MONGO_URI);
        log('Connected to MongoDB');
        await mongoose.connection.db.dropDatabase();
        log('Database Dropped (Zero State)', 'success');

        // 2. Register Learner
        log('2. Learner Registration', 'header');
        let learnerToken = '';
        let learnerId = '';
        try {
            const res = await axios.post(`${API_URL}/auth/signup`, {
                fullName: 'Vinay Kumar',
                email: 'vinaylearner@test.com',
                password: 'Password@123',
                role: 'learner'
            });
            learnerToken = res.data.token;
            learnerId = res.data._id;
            log(`API Response: 201 Created`, 'success');

            // Audit DB
            const dbUser = await User.findOne({ email: 'vinaylearner@test.com' });
            if (dbUser) log(`DB Verification: User 'Vinay Kumar' found in 'users' collection`, 'success');
            else throw new Error('User not found in DB');

        } catch (err) {
            log(`Learner Registration Failed: ${err.message}`, 'error');
            process.exit(1);
        }

        // 3. Register Trainer (Unified)
        log('3. Trainer Unified Registration', 'header');
        let trainerToken = '';
        try {
            const res = await axios.post(`${API_URL}/auth/signup`, {
                fullName: 'Dr. Anil Mehta',
                email: 'trainer@test.com',
                password: 'Password@123',
                role: 'trainer',
                skills: ['Python', 'Data Science'],
                experience: 5,
                location: 'Hyderabad',
                fees: 1000,
                mode: 'both'
            });
            trainerToken = res.data.token;
            log(`API Response: 201 Created`, 'success');

            // Audit DB
            const dbUser = await User.findOne({ email: 'trainer@test.com' });
            if (dbUser) log(`DB Verification: User 'Dr. Anil Mehta' found in 'users'`, 'success');
            else throw new Error('Trainer User not found in DB');

            const dbTrainer = await Trainer.findOne({ user: dbUser._id });
            if (dbTrainer) {
                log(`DB Verification: Trainer Profile found in 'trainers'`, 'success');
                if (dbTrainer.skills.includes('Python')) log(`DB Verification: Skills ['Python'] matched`, 'success');
            } else throw new Error('Trainer Profile not found in DB');

        } catch (err) {
            log(`Trainer Registration Failed: ${err.message}`, 'error');
            process.exit(1);
        }

        // 4. Search & Book
        log('4. Search & Booking Flow', 'header');
        try {
            // Search
            const searchRes = await axios.get(`${API_URL}/trainers?skill=Python`, {
                headers: { Authorization: `Bearer ${learnerToken}` }
            });
            log(`Search API: Found ${searchRes.data.length} trainers`, 'success');

            const trainerObj = searchRes.data.find(t => t.skills.includes('Python'));
            if (!trainerObj) throw new Error('Python trainer not found in search');

            // Book
            const bookRes = await axios.post(`${API_URL}/bookings`, {
                trainer: trainerObj._id,
                date: '2025-01-01',
                message: 'Looking for Python training'
            }, {
                headers: { Authorization: `Bearer ${learnerToken}` }
            });
            log(`Booking API: 201 Created (ID: ${bookRes.data._id})`, 'success');

            // Audit DB
            const dbBooking = await Booking.findById(bookRes.data._id);
            if (dbBooking) log(`DB Verification: Booking found in 'bookings' collection`, 'success');
            else throw new Error('Booking not found in DB');

        } catch (err) {
            log(`Booking Flow Failed: ${err.message}`, 'error');
            process.exit(1);
        }

        // 5. Trainer Dashboard
        log('5. Trainer Dashboard Check', 'header');
        try {
            const dashRes = await axios.get(`${API_URL}/bookings`, {
                headers: { Authorization: `Bearer ${trainerToken}` }
            });
            if (dashRes.data.length > 0) log(`Trainer API: Retrieved ${dashRes.data.length} bookings`, 'success');
            else throw new Error('Trainer found no bookings');

        } catch (err) {
            log(`Trainer Dashboard Failed: ${err.message}`, 'error');
            process.exit(1);
        }

        log('ZERO AUDIT PASSED SUCCESSFULLY', 'header');
        process.exit(0);

    } catch (error) {
        log(`CRITICAL FAILURE: ${error.message}`, 'error');
        process.exit(1);
    }
};

runAudit();
