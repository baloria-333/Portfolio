// List all available models for your API key
const API_KEY = 'AIzaSyClM0-18Wjb6Ff88SBhE27Rg6DpzimuFMI';

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.models) {
            console.log('✅ Available models for your API key:\n');
            data.models.forEach((model) => {
                console.log(`📌 ${model.name}`);
                console.log(`   Display Name: ${model.displayName}`);
                console.log(`   Supported: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
                console.log('');
            });
        } else {
            console.log('❌ Error:', data.error?.message || 'Unknown error');
        }
    } catch (error) {
        console.log('❌ Failed to list models:', error.message);
    }
}

listModels();
