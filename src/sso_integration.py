#!/usr/bin/env python3
"""
SSO Integration Example for AI-HACCP
This demonstrates how to integrate with AI-SwAutoMorph SSO Identity Provider
"""

from flask import Flask, request, redirect, session, jsonify, render_template_string
import requests
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

# SSO Configuration
SSO_PROVIDER_URL = "https://www.swautomorph.com"
CLIENT_ID = "ai-haccp"
REDIRECT_URI = "http://localhost:3000/sso/callback"

# Simple HTML templates
LOGIN_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>AI-HACCP Login</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
        .btn { background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; }
        .btn:hover { background: #2980b9; }
    </style>
</head>
<body>
    <h1>AI-HACCP Application</h1>
    <p>Please login to access the application.</p>
    <a href="/sso/login" class="btn">Login with SSO</a>
</body>
</html>
"""

DASHBOARD_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>AI-HACCP Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .user-info { background: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        .btn { background: #e74c3c; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>AI-HACCP Dashboard</h1>
    <div class="user-info">
        <h3>Welcome, {{ user.username }}!</h3>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Name:</strong> {{ user.first_name }} {{ user.last_name }}</p>
        <p><strong>Token expires:</strong> {{ user.expires_at }}</p>
    </div>
    <p>You are now logged in to AI-HACCP via SSO.</p>
    <a href="/logout" class="btn">Logout</a>
</body>
</html>
"""

@app.route('/')
def index():
    """Main page - check if user is authenticated"""
    if 'sso_token' in session:
        # Validate token with SSO provider
        user_info = validate_sso_token(session['sso_token'])
        if user_info:
            return render_template_string(DASHBOARD_TEMPLATE, user=user_info)
    
    return render_template_string(LOGIN_TEMPLATE)

@app.route('/sso/login')
def sso_login():
    """Redirect to SSO provider for authentication"""
    sso_url = f"{SSO_PROVIDER_URL}/sso/auth?redirect_uri={REDIRECT_URI}&client_id={CLIENT_ID}"
    return redirect(sso_url)

@app.route('/sso/callback')
def sso_callback():
    """Handle SSO callback with token"""
    token = request.args.get('token')
    state = request.args.get('state')
    
    if not token or state != 'success':
        return "SSO authentication failed", 400
    
    # Validate token with SSO provider
    user_info = validate_sso_token(token)
    if user_info:
        session['sso_token'] = token
        session['user_info'] = user_info
        return redirect('/')
    else:
        return "Invalid SSO token", 400

@app.route('/logout')
def logout():
    """Logout user"""
    session.clear()
    return redirect('/')

def validate_sso_token(token):
    """Validate SSO token with the identity provider"""
    try:
        response = requests.post(
            f"{SSO_PROVIDER_URL}/sso/validate",
            json={'token': token},
            timeout=10,
            verify=False  # For self-signed certificates
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('valid'):
                return data.get('user')
    except requests.RequestException as e:
        print(f"SSO validation error: {e}")
    
    return None

if __name__ == '__main__':
    print("AI-HACCP SSO Integration Example")
    print(f"SSO Provider: {SSO_PROVIDER_URL}")
    print(f"Redirect URI: {REDIRECT_URI}")
    print("Starting server on http://localhost:3000")
    app.run(host='0.0.0.0', port=3000, debug=True)