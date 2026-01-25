import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ No API key found');
} else {
    console.log('✅ API key found:', apiKey.substring(0, 20) + '...');

    const genAI = new GoogleGenerativeAI(apiKey);

    // List all available models
    genAI.listModels().then(models => {
        console.log('📋 Available Gemini models for your API key:');
        models.forEach((model: any) => {
            console.log('  -', model.name, '|', model.displayName);
        });
    }).catch(error => {
        console.error('❌ Error listing models:', error);
    });
}
