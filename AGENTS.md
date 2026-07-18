# Secrets

Store secrets ONLY in environment variables or an approved secrets manager.

Never hardcode:

- API Keys
- JWT Secrets
- Database URLs
- OAuth Client Secrets
- Encryption Keys
- SMTP Credentials
- Cloud Credentials
- Access Tokens
- Refresh Token Secrets
- Session Secrets

NEVER expose secrets in:

- Source code
- Comments
- Documentation
- Examples
- Tests
- Mock data
- Sample configuration
- Fallback values
- Default constants
- Temporary debugging code

Never generate placeholder secrets that resemble real credentials.

Never write code such as:

❌ JWT_SECRET = "mysecret"
❌ API_KEY = "123456"
❌ DB_PASSWORD = "password"
❌ const SECRET = process.env.JWT_SECRET || "fallback-secret"

Instead:

✔ Validate that the required environment variable exists during application startup.
✔ If a required secret is missing, fail fast with a clear startup error.
✔ Never automatically substitute missing secrets with defaults or fallback values.
✔ Never print secret values to logs, error messages, or the console.

Example pattern (language-agnostic):

- Read the secret from the environment.
- Verify it exists.
- If missing, terminate startup with a descriptive error.
- Continue only when all required secrets are present.

AI Rule:

Never generate, reveal, invent, infer, or expose any secret values, even as examples, placeholders, demonstrations, mock values, fallback values, or test fixtures.