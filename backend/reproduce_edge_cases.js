const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth/signup';

async function testSignup(payload, testName) {
    console.log(`\n--- Testing: ${testName} ---`);
    try {
        const response = await axios.post(API_URL, payload);
        console.log("Success:", response.config.data);
        console.log("Response Token:", response.data.token ? "Received" : "Missing");
    } catch (error) {
        if (error.response) {
            console.log("Expected Error Status:", error.response.status);
            console.log("Error Message:", error.response.data.message);
        } else {
            console.log("Connection Error:", error.message);
        }
    }
}

async function runTests() {
    // 1. Valid Signup
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await testSignup({
        name: "Valid User",
        email: uniqueEmail,
        password: "password123",
        role: "learner"
    }, "Valid Signup");

    // 2. Duplicate Email (should fail)
    await testSignup({
        name: "Duplicate User",
        email: uniqueEmail, // Use same email
        password: "password123",
        role: "learner"
    }, "Duplicate Email");

    // 3. Missing Password (should fail)
    await testSignup({
        name: "No Password",
        email: `nopass_${Date.now()}@example.com`,
        role: "learner"
    }, "Missing Password");

    // 4. Missing Name (should fail)
    await testSignup({
        email: `noname_${Date.now()}@example.com`,
        password: "password123",
        role: "learner"
    }, "Missing Name");
}

runTests();
