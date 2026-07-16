const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');
const { ComprehendClient } = require('@aws-sdk/client-comprehend');
require('dotenv').config();

// AWS Configuration using IAM Role (for EC2/ECS/Lambda deployment)
// For local development, credentials are picked up from ~/.aws/credentials (AWS CLI)
const awsConfig = {
    region: process.env.AWS_REGION,
    maxAttempts: 3,
    requestTimeout: 60000,
};

let bedrockClient = null;
let comprehendClient = null;
let isConfigured = false;

try {
    bedrockClient = new BedrockRuntimeClient(awsConfig);
    comprehendClient = new ComprehendClient(awsConfig);
    isConfigured = true;
    console.log('✅ AWS Bedrock and Comprehend clients initialized');
    console.log('ℹ️  Using IAM role / AWS CLI credentials');
} catch (error) {
    console.warn('⚠️  AWS initialization failed:', error.message);
    console.log('ℹ️  AI translation features will be disabled.');
}

module.exports = { bedrockClient, comprehendClient, isConfigured };
