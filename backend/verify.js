const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m"
};

let learnerToken = '';
let trainerToken = '';
let trainerProfileId = ''; // Profile ID of trainer
let bookingId = '';

const log = (msg, type = 'info') => {
    if (type === 'success') console.log(`${colors.green}✔ ${msg}${colors.reset}`);
    else if (type === 'error') console.log(`${colors.red}✖ ${msg}${colors.reset}`);
    else if (type === 'header') console.log(`\n${colors.cyan}=== ${msg} ===${colors.reset}`);
    else console.log(msg);
};

const runTests = async () => {
    try {
        log('Starting Backend Verification (Unified Flow)', 'header');

        // 1. Auth: Register Learner
        try {
            log('Testing Learner Registration...');
            const email = `learner_${Date.now()}@test.com`;
            const res = await axios.post(`${API_URL}/auth/signup`, {
                fullName: 'Vinay Test Learner',
                email: email,
                password: 'password123',
                role: 'learner'
            });
            learnerToken = res.data.token;
            log('Learner Registered Successfully', 'success');
        } catch (error) {
            log(`Learner Registration Failed: ${error.response?.data?.message || error.message}`, 'error');
        }

        // 2. Auth: Register Trainer (UNIFIED)
        try {
            log('Testing Trainer Unified Registration...');
            const email = `trainer_${Date.now()}@test.com`;
            // Sending fields that should be mapped to Trainer Profile automatically
            const res = await axios.post(`${API_URL}/auth/signup`, {
                fullName: 'Dr. Unified Trainer',
                email: email,
                password: 'password123',
                role: 'trainer',
                skills: ['Python', 'Data Science'],
                experience: 10,
                location: 'Hyderabad',
                fees: 2000,
                mode: 'both'
            });
            trainerToken = res.data.token;
            log('Trainer Unified Registered Successfully', 'success');
        } catch (error) {
            log(`Trainer Unified Registration Failed: ${error.response?.data?.message || error.message}`, 'error');
        }

        // 3. Search Trainers by Skill
        try {
            log('Testing Search Trainers by Skill (Python)...');
            const res = await axios.get(`${API_URL}/trainers?skill=Python`, {
                headers: { Authorization: `Bearer ${learnerToken}` }
            });

            if (res.data.length > 0) {
                // Find our specific trainer just created to be sure
                const found = res.data.find(t => t.skills.includes('Python'));
                if (found) {
                    log(`Found ${res.data.length} Python Trainers`, 'success');
                    trainerProfileId = found._id; // This is the Trainer Document ID, needed for booking
                } else {
                    log('Trainers found but skill match unclear', 'error');
                }
            } else {
                log('No Trainers found with skill Python', 'error');
            }
        } catch (error) {
            log(`Search Trainers Failed: ${error.response?.data?.message || error.message}`, 'error');
        }

        if (!trainerProfileId) {
            log('Blocking further tests: No Trainer ID found', 'error');
            return;
        }

        // 4. Booking: Create Request
        try {
            log('Testing Create Booking Request...');
            const res = await axios.post(`${API_URL}/bookings`, {
                trainer: trainerProfileId,
                date: '2025-01-01',
                message: 'I want to learn Python'
            }, {
                headers: { Authorization: `Bearer ${learnerToken}` }
            });
            bookingId = res.data._id;
            log('Booking Created Successfully', 'success');
        } catch (error) {
            log(`Create Booking Failed: ${error.response?.data?.message || error.message}`, 'error');
        }

        // 5. Booking: Get Bookings (Trainer View)
        try {
            log('Testing Get Bookings (Trainer View)...');
            const res = await axios.get(`${API_URL}/bookings`, {
                headers: { Authorization: `Bearer ${trainerToken}` }
            });
            const found = res.data.find(b => b._id === bookingId);
            if (found) {
                log(`Booking Found: ${found.learner.name || found.learner.email} requests ${found.trainer.skills}`, 'success');
            } else {
                log('Booking NOT Found in Trainer Dashboard', 'error');
            }
        } catch (error) {
            log(`Get Bookings Failed: ${error.response?.data?.message || error.message}`, 'error');
        }

        log('Verification Complete', 'header');

    } catch (error) {
        log(`Critical Error: ${error.message}`, 'error');
    }
};

runTests();
