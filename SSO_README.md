# AI-HACCP SSO Integration with AI-SwAutoMorph

This demonstrates how AI-HACCP can use AI-SwAutoMorph as an SSO Identity Provider.

## How it Works

1. **User visits AI-HACCP** → Redirected to AI-SwAutoMorph for authentication
2. **User logs in** → AI-SwAutoMorph validates credentials
3. **Redirect back** → AI-HACCP receives valid token
4. **Token validation** → AI-HACCP validates token with AI-SwAutoMorph
5. **User authenticated** → Access granted to AI-HACCP

## SSO Flow

```
AI-HACCP                    AI-SwAutoMorph (SSO Provider)
    |                              |
    |---> /sso/auth?redirect_uri   |
    |                              |---> Login Page
    |                              |---> User Authentication
    |<--- redirect with token -----|
    |                              |
    |---> /sso/validate (token)    |
    |<--- user info --------------|
    |                              |
    User Authenticated
```

## API Endpoints

### AI-SwAutoMorph SSO Provider

- **`GET /sso/auth`** - Initiate SSO authentication
  - Parameters: `redirect_uri`, `client_id`
  - Redirects to login if not authenticated
  - Returns to redirect_uri with token if authenticated

- **`GET /sso/login`** - SSO login page
  - Shows login form for external applications

- **`POST /sso/authenticate`** - Process SSO login
  - Validates credentials and redirects with token

- **`POST /sso/validate`** - Validate SSO token
  - Body: `{"token": "token_value"}`
  - Returns: `{"valid": true, "user": {...}}`

## Usage Example

### 1. Start AI-SwAutoMorph (SSO Provider)
```bash
cd /home/ubuntu/ai-swautomorph
./deploy.sh
```

### 2. Start AI-HACCP (SSO Client)
```bash
cd /home/ubuntu/ai-haccp
python3 sso_integration.py
```

### 3. Test SSO Flow
1. Visit: http://localhost:3000
2. Click "Login with SSO"
3. Login with AI-SwAutoMorph credentials
4. Get redirected back to AI-HACCP with authentication

## Integration Code

```python
# Redirect to SSO provider
sso_url = f"{SSO_PROVIDER_URL}/sso/auth?redirect_uri={REDIRECT_URI}&client_id={CLIENT_ID}"
return redirect(sso_url)

# Validate token
response = requests.post(f"{SSO_PROVIDER_URL}/sso/validate", json={'token': token})
if response.json().get('valid'):
    user_info = response.json().get('user')
```

## Configuration

- **SSO Provider URL**: `https://www.swautomorph.com`
- **Client ID**: `ai-haccp`
- **Redirect URI**: `http://localhost:3000/sso/callback`

## Security Features

- ✅ Token-based authentication
- ✅ Token expiration (1 week)
- ✅ Secure token validation
- ✅ HTTPS encryption
- ✅ Session management