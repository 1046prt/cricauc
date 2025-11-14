const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up CricAuc...\n');

// Create backend/.env if it doesn't exist
const backendEnvPath = path.join(__dirname, '../backend/.env');
const backendTemplatePath = path.join(__dirname, '../backend/env.template');

if (!fs.existsSync(backendEnvPath)) {
  console.log('Creating backend/.env...');
  if (fs.existsSync(backendTemplatePath)) {
    fs.copyFileSync(backendTemplatePath, backendEnvPath);
    console.log('✅ Created backend/.env\n');
  } else {
    // Create default .env
    const defaultBackendEnv = `PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=cricauc
DB_PASSWORD=cricauc_password
DB_NAME=cricauc_db

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=dev-jwt-secret-key-change-in-production-2024
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

FRONTEND_URL=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
`;
    fs.writeFileSync(backendEnvPath, defaultBackendEnv);
    console.log('✅ Created backend/.env\n');
  }
} else {
  console.log('✅ backend/.env already exists\n');
}

// Create frontend/.env.local if it doesn't exist
const frontendEnvPath = path.join(__dirname, '../frontend/.env.local');
const frontendTemplatePath = path.join(__dirname, '../frontend/env.template');

if (!fs.existsSync(frontendEnvPath)) {
  console.log('Creating frontend/.env.local...');
  if (fs.existsSync(frontendTemplatePath)) {
    fs.copyFileSync(frontendTemplatePath, frontendEnvPath);
    console.log('✅ Created frontend/.env.local\n');
  } else {
    // Create default .env.local
    const defaultFrontendEnv = `NEXT_PUBLIC_API_URL=http://localhost:4000
`;
    fs.writeFileSync(frontendEnvPath, defaultFrontendEnv);
    console.log('✅ Created frontend/.env.local\n');
  }
} else {
  console.log('✅ frontend/.env.local already exists\n');
}

console.log('📦 Installing dependencies...\n');

// Install root dependencies
console.log('Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch (error) {
  console.error('Error installing root dependencies:', error.message);
}

// Install backend dependencies
console.log('\nInstalling backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '../backend') });
} catch (error) {
  console.error('Error installing backend dependencies:', error.message);
}

// Install frontend dependencies
console.log('\nInstalling frontend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '../frontend') });
} catch (error) {
  console.error('Error installing frontend dependencies:', error.message);
}

console.log('\n✅ Setup complete!\n');
console.log('Next steps:');
console.log('1. Start Docker: npm run docker:up');
console.log('2. Create admin: cd backend && npm run create-admin');
console.log('3. Start dev: npm run dev\n');



