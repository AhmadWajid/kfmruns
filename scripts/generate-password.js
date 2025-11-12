#!/usr/bin/env node

/**
 * Password Generation Utility
 * 
 * Hashes a provided password with bcrypt and generates a JWT secret.
 * 
 * Usage:
 *   node scripts/generate-password.js "your-password"     # Hash your password and generate JWT secret
 *   node scripts/generate-password.js --password "your-password"  # Same as above
 *   node scripts/generate-password.js                      # Generate random password (legacy mode)
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const args = process.argv.slice(2);

// Check if password is provided via --password flag or as direct argument
let password = null;
const passwordIndex = args.indexOf('--password');
if (passwordIndex !== -1 && args[passwordIndex + 1]) {
  password = args[passwordIndex + 1];
} else if (args.length > 0 && !args[0].startsWith('--')) {
  // First argument that doesn't start with -- is treated as password
  password = args[0];
}

// Generate secure JWT secret (64 characters for strong security)
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

// Generate secure random password (for legacy mode)
function generatePassword(length = 16) {
  const bytes = crypto.randomBytes(Math.ceil(length / 2));
  return bytes.toString('hex').substring(0, length);
}

const jwtSecret = generateJWTSecret();

if (password) {
  // Hash the provided password using bcrypt (same as your auth.ts)
  const hash = bcrypt.hashSync(password, 10);
  
  // Verify the hash works
  const isValid = bcrypt.compareSync(password, hash);
  
  console.log('\n🔐 Your Password:');
  console.log('─'.repeat(50));
  console.log(password);
  console.log('─'.repeat(50));
  
  console.log('\n🔒 Hashed Password (bcrypt):');
  console.log('─'.repeat(50));
  console.log(hash);
  console.log('─'.repeat(50));
  
  console.log('\n✅ Hash Verification Test:');
  console.log('─'.repeat(50));
  console.log(isValid ? '✓ Hash verification PASSED' : '✗ Hash verification FAILED');
  console.log('─'.repeat(50));
  
  console.log('\n🔑 Generated JWT Secret:');
  console.log('─'.repeat(50));
  console.log(jwtSecret);
  console.log('─'.repeat(50));
  
  console.log('\n📝 Environment Variables:');
  console.log('─'.repeat(50));
  console.log(`ADMIN_PASSWORD=${password}`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log('─'.repeat(50));
} else {
  // Legacy mode: generate random password
  const generatedPassword = generatePassword(16);
  const hash = bcrypt.hashSync(generatedPassword, 10);
  
  // Verify the hash works
  const isValid = bcrypt.compareSync(generatedPassword, hash);
  
  console.log('\n🔐 Generated Password:');
  console.log('─'.repeat(50));
  console.log(generatedPassword);
  console.log('─'.repeat(50));
  
  console.log('\n🔒 Hashed Password (bcrypt):');
  console.log('─'.repeat(50));
  console.log(hash);
  console.log('─'.repeat(50));
  
  console.log('\n✅ Hash Verification Test:');
  console.log('─'.repeat(50));
  console.log(isValid ? '✓ Hash verification PASSED' : '✗ Hash verification FAILED');
  console.log('─'.repeat(50));
  
  console.log('\n🔑 Generated JWT Secret:');
  console.log('─'.repeat(50));
  console.log(jwtSecret);
  console.log('─'.repeat(50));
  
  console.log('\n📝 Environment Variables:');
  console.log('─'.repeat(50));
  console.log(`ADMIN_PASSWORD=${generatedPassword}`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log('─'.repeat(50));
}

console.log('\n✅ Copy the values above and update your .env file or deployment environment variables.\n');

