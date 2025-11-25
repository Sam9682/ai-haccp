# AI-HACCP Dual Authentication

The AI-HACCP platform now supports two authentication methods:

## 1. Direct Login (Username/Password)

### Default Admin User
- **Email**: `admin@ai-automorph.com`
- **Password**: `password`
- **Role**: `admin`

The admin user is automatically created when the application starts for the first time.

### Usage
```bash
# Via API
curl -X POST http://localhost:9001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ai-automorph.com", "password": "password"}'

# Via Web Interface
# Navigate to the login page and use the credentials above
```

## 2. SSO Authentication

### SSO Server Integration
The platform integrates with the AI-SwAutoMorph SSO server at `/home/ubuntu/ai-swautomorph`.

### SSO Flow
1. User clicks "Login with SSO" on the AI-HACCP login page
2. User is redirected to `http://ai-swautomorph.swautomorph.com:5002`
3. User logs in with their SSO credentials
4. SSO server redirects back to AI-HACCP with an SSO token
5. AI-HACCP validates the token with the SSO server
6. If valid, user is automatically logged in

### SSO Token Validation
```bash
# AI-HACCP validates tokens by calling:
POST http://ai-swautomorph.swautomorph.com:5002/sso/validate
{
  "token": "sso_token_here"
}
```

### Automatic User Creation
When a user logs in via SSO for the first time:
- A new user account is automatically created
- User is assigned to the "SSO Users" organization
- User gets "user" role by default
- User information is populated from SSO server data

## Configuration

### Backend Configuration
- SSO server URL is configured in `main.py`
- Default: `http://ai-swautomorph.swautomorph.com:5002`

### Frontend Configuration
- SSO redirect URL is configured in `Login.js`
- Default: `http://ai-swautomorph.swautomorph.com:5002`

## Security Features

1. **JWT Tokens**: Both authentication methods generate JWT tokens
2. **Token Expiration**: Tokens expire after 30 minutes
3. **Password Hashing**: Direct login passwords are hashed
4. **SSO Validation**: SSO tokens are validated with the SSO server
5. **Organization Isolation**: Users are isolated by organization

## Testing

Run the test script to verify both authentication methods:

```bash
cd /home/ubuntu/ai-haccp
python3 test_auth.py
```

## Troubleshooting

### SSO Server Not Available
If the SSO server is not running, SSO authentication will fail with "SSO server unavailable".

### Invalid SSO Token
If an SSO token is invalid or expired, authentication will fail with "Invalid SSO token".

### Admin User Not Created
If the admin user is not automatically created, check the database initialization logs.

## API Endpoints

### Authentication Endpoints
- `POST /auth/login` - Direct login with email/password
- `POST /auth/sso` - SSO authentication with token

### Response Format
Both endpoints return the same format:
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin",
    "organization_id": 1,
    "is_active": true
  }
}
```