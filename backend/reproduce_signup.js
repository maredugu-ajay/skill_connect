const axios = require('axios');

async function testSignup() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/signup', {
            name: "Test User",
            email: "test.user" + Math.random() + "@example.com",
            password: "password123",
            role: "learner"
        });
        console.log("Success:", response.data);
    } catch (error) {
        if (error.response) {
            console.log("Error Status:", error.response.status);
            console.log("Error Data:", error.response.data);
        } else {
            console.log("Error Message:", error.message);
        }
    }
}

testSignup();
