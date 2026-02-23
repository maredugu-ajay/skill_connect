const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Helper to generate random string
const randomStr = () => Math.random().toString(36).substring(7);

async function verifyFlow() {
    try {
        console.log('--- STARTING VERIFICATION FLOW ---');

        // 1. Register Trainer
        const trainerEmail = `trainer_${randomStr()}@test.com`;
        const trainerPass = 'Password@123';
        console.log(`\n1. Registering Trainer (${trainerEmail})...`);
        const trainerReg = await axios.post(`${BASE_URL}/auth/signup`, {
            fullName: "Test Trainer",
            email: trainerEmail,
            password: trainerPass,
            role: "trainer",
            skills: ["Python", "Verification"],
            experience: 5,
            mode: "online",
            location: "Test City",
            fees: 500
        });
        console.log('✅ Trainer Registered. User ID:', trainerReg.data._id);

        // 2. Register Learner
        const learnerEmail = `learner_${randomStr()}@test.com`;
        const learnerPass = 'Password@123';
        console.log(`\n2. Registering Learner (${learnerEmail})...`);
        const learnerReg = await axios.post(`${BASE_URL}/auth/signup`, {
            fullName: "Test Learner",
            email: learnerEmail,
            password: learnerPass,
            role: "learner"
        });
        const learnerToken = learnerReg.data.token;
        console.log('✅ Learner Registered & Logged In. Token received.');

        // 3. Search for Trainer
        console.log('\n3. Searching for Trainer with skill "Python"...');
        const searchRes = await axios.get(`${BASE_URL}/trainers?skill=Python`, {
            headers: { Authorization: `Bearer ${learnerToken}` }
        });

        // Find our specific trainer from list
        const foundTrainer = searchRes.data.find(t => t.user.email === trainerEmail);

        if (!foundTrainer) {
            throw new Error('❌ Test Trainer not found in search results!');
        }
        console.log(`✅ Trainer Found in Search. Profile ID: ${foundTrainer._id}`);

        // 4. Learner Books Trainer
        console.log('\n4. Learner creating booking...');
        const bookingRes = await axios.post(`${BASE_URL}/bookings`, {
            trainer: foundTrainer._id,
            date: "2024-12-25",
            message: "Verification Request"
        }, {
            headers: { Authorization: `Bearer ${learnerToken}` }
        });
        console.log('✅ Booking Created. ID:', bookingRes.data._id);

        // 5. Login as Trainer
        console.log('\n5. Logging in as Trainer...');
        const trainerLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: trainerEmail,
            password: trainerPass
        });
        const trainerToken = trainerLogin.data.token;
        console.log('✅ Trainer Logged In.');

        // 6. Trainer Fetches Bookings
        console.log('\n6. Trainer fetching bookings...');
        const bookingsRes = await axios.get(`${BASE_URL}/bookings`, {
            headers: { Authorization: `Bearer ${trainerToken}` }
        });

        const myBooking = bookingsRes.data.find(b => b._id === bookingRes.data._id);

        if (!myBooking) {
            throw new Error('❌ Booking not found in Trainer\'s list!');
        }
        console.log('✅ Booking confirmed in Trainer\'s dashboard.');
        console.log(`   Message: "${myBooking.message}"`);
        console.log(`   Learner: ${myBooking.learner.name} (${myBooking.learner.email})`);

        console.log('\n--- VERIFICATION PASSED SUCCESSFULLY ---');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

verifyFlow();
