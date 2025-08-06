#!/usr/bin/env node

const fetch = require('node-fetch');

async function testSignup() {
  console.log('🧪 Testing signup API...');

  const testData = {
    email: 'test@example.com',
    password: 'testpassword123',
    userData: {
      name: 'Test User',
      role: 'developer',
      plan_type: 'developer',
      company_name: 'Test Company',
      metadata: {
        industry: 'Technology',
        use_case: 'Testing',
        project_description: 'API Test',
        onboarding_completed: false
      }
    }
  };

  try {
    const response = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', result);

    if (response.ok) {
      console.log('✅ Signup test passed!');
    } else {
      console.log('❌ Signup test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testSignup();
