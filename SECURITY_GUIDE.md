# Security Guide: Storing API Keys and Credentials

## 🚨 Important Security Practices

### 1. **Environment Variables (Recommended)**

Create a `.env` file in your project root (DO NOT commit this to git):

```bash
# .env file (create this locally)
FIREBASE_API_KEY=AIzaSyCkaCp_YNFJLSBpaHCrYn8Lk-TZ-zAkzjs
FIREBASE_AUTH_DOMAIN=expense-tracker-angular-4a621.firebaseapp.com
FIREBASE_PROJECT_ID=expense-tracker-angular-4a621
FIREBASE_STORAGE_BUCKET=expense-tracker-angular-4a621.appspot.com
FIREBASE_MESSAGING_SENDER_ID=692253163753
FIREBASE_APP_ID=1:692253163753:web:dca269c18bdf340b127078
FIREBASE_MEASUREMENT_ID=G-FV4RJJ966Y
FIREBASE_DATABASE_URL=https://expense-tracker-angular-4a621-default-rtdb.europe-west1.firebasedatabase.app
```

### 2. **Setting Environment Variables**

#### For Development:
```bash
# Windows (PowerShell)
$env:FIREBASE_API_KEY="your_api_key_here"

# Windows (Command Prompt)
set FIREBASE_API_KEY=your_api_key_here

# Linux/Mac
export FIREBASE_API_KEY=your_api_key_here
```

#### For Production (Docker):
```bash
# Create .env file or set environment variables before running docker-compose
docker-compose up
```

### 3. **Alternative Secure Methods**

#### A. **Azure Key Vault / AWS Secrets Manager**
For enterprise applications, use cloud-based secret management:
```typescript
// Example: Azure Key Vault
import { SecretClient } from "@azure/keyvault-secrets";

const client = new SecretClient(vaultUrl, credential);
const secret = await client.getSecret("firebase-api-key");
```

#### B. **HashiCorp Vault**
For on-premises secret management:
```bash
# Store secret
vault kv put secret/firebase api_key=your_api_key

# Retrieve secret
vault kv get secret/firebase
```

#### C. **Configuration Files with Encryption**
```typescript
// config/secrets.ts (encrypted file)
import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;

export function decrypt(text: string): string {
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 4. **Firebase Security Rules**

Update your Firebase security rules to restrict access:

```javascript
// database.rules.json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 5. **Build-time Environment Injection**

For Angular applications, you can use build-time environment injection:

```bash
# package.json scripts
"build:prod": "ng build --configuration=production --env=prod"
"build:staging": "ng build --configuration=staging --env=staging"
```

### 6. **Runtime Configuration Loading**

Create a configuration service that loads secrets at runtime:

```typescript
// config/config.service.ts
@Injectable()
export class ConfigService {
  private config: any = {};

  async loadConfig() {
    // Load from environment variables or remote config
    this.config = {
      firebase: {
        apiKey: process.env['FIREBASE_API_KEY'],
        // ... other config
      }
    };
  }

  getConfig() {
    return this.config;
  }
}
```

## 🛡️ Security Checklist

- [ ] ✅ Never commit `.env` files to version control
- [ ] ✅ Use different API keys for development/staging/production
- [ ] ✅ Rotate API keys regularly
- [ ] ✅ Set up Firebase security rules
- [ ] ✅ Use HTTPS in production
- [ ] ✅ Implement proper authentication
- [ ] ✅ Monitor API key usage
- [ ] ✅ Use environment-specific configurations
- [ ] ✅ Encrypt sensitive data at rest
- [ ] ✅ Implement proper access controls

## 🚀 Deployment Best Practices

### For Docker:
```bash
# Use docker secrets or environment files
docker run -d \
  --env-file .env \
  -p 4200:80 \
  expense-tracker
```

### For Cloud Platforms:
- **Heroku**: Use config vars
- **Vercel**: Use environment variables in dashboard
- **AWS**: Use Parameter Store or Secrets Manager
- **Azure**: Use Key Vault
- **Google Cloud**: Use Secret Manager

## 📝 Quick Start

1. Create `.env` file with your actual API keys
2. Set environment variables for your deployment environment
3. Update `.gitignore` to exclude sensitive files
4. Test your application with environment variables
5. Deploy with secure configuration

## ⚠️ Common Mistakes to Avoid

- ❌ Hardcoding API keys in source code
- ❌ Committing `.env` files to git
- ❌ Using production keys in development
- ❌ Sharing API keys in chat/email
- ❌ Not rotating keys regularly
- ❌ Not setting up proper Firebase security rules
