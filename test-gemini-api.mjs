// Test script to find working Gemini models  
// Run with: node test-gemini-api.mjs

const API_KEY = 'AIzaSyClM0-18Wjb6Ff88SBhE27Rg6DpzimuFMI';

const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    '1.5-flash-latest',
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash-exp',
];

async function testModel(modelName) {
    // Changed to v1beta
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hey Gemini! How are you? Please respond with "I am working perfectly!"'
                    }]
                }]
            })
        });

        const data = await response.json();

        if (response.ok && data.candidates) {
            const reply = data.candidates[0].content.parts[0].text;
            console.log(`✅ SUCCESS: ${modelName}`);
            console.log(`   Reply: ${reply.substring(0, 100)}...`);
            return true;
        } else {
            console.log(`❌ FAILED: ${modelName}`);
            console.log(`   Error: ${data.error?.message || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ERROR: ${modelName}`);
        console.log(`   ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('🧪 Testing Gemini API Models (v1beta endpoint)...\n');
    console.log('API Key:', API_KEY.substring(0, 20) + '...\n');

    let workingModel = null;

    for (const model of modelsToTest) {
        const works = await testModel(model);
        if (works && !workingModel) {
            workingModel = model;
        }
        await new Promise(r => setTimeout(r, 500)); // Small delay between requests
    }

    console.log('\n📊 SUMMARY:');
    if (workingModel) {
        console.log(`✅ Found working model: ${workingModel}`);
        console.log(`\nUse this in your code:\nconst model = '${workingModel}';`);
    } else {
        console.log('❌ No working models found!');
        console.log('\nTroubleshooting steps:');
        console.log('1. Verify API key at: https://aistudio.google.com/app/apikey');
        console.log('2. Check if Gemini API is enabled in your Google Cloud project');
        console.log('3. Try enabling billing if using free tier');
    }
}

main();
