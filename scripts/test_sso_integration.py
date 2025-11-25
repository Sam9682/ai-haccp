#!/usr/bin/env python3
"""
Test SSO Integration for AI-HACCP
This script tests the SSO flow from AI-AUTOMORPH to AI-HACCP
"""

import requests
import json
import sys
from urllib.parse import urlencode

def test_sso_flow():
    """Test the complete SSO flow"""
    
    print("AI-HACCP SSO Integration Test")
    print("=" * 50)
    
    # Step 1: Simulate getting a token from AI-AUTOMORPH
    print("1. Simulating SSO token from AI-AUTOMORPH...")
    
    # This would normally come from AI-AUTOMORPH SSO server
    mock_sso_token = "test_sso_token_12345"
    
    # Step 2: Test SSO authentication with AI-HACCP
    print("2. Testing SSO authentication with AI-HACCP...")
    
    api_url = "https://localhost:8102/api/auth/sso"
    
    try:
        response = requests.post(
            api_url,
            json={"sso_token": mock_sso_token},
            headers={"Content-Type": "application/json"},
            verify=False,  # Skip SSL verification for self-signed cert
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SSO Authentication successful!")
            print(f"User: {data['user']['name']} ({data['user']['email']})")
            print(f"Token: {data['access_token'][:50]}...")
            return True
        else:
            print("❌ SSO Authentication failed!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return False

def test_frontend_sso_url():
    """Test frontend SSO URL handling"""
    
    print("\n3. Testing frontend SSO URL handling...")
    
    # Simulate the URL that AI-AUTOMORPH would redirect to
    base_url = "https://localhost:8102"
    sso_token = "test_sso_token_12345"
    user_param = "testuser"
    
    # Test different URL formats
    test_urls = [
        f"{base_url}/?sso_token={sso_token}",
        f"{base_url}/?token={sso_token}&user={user_param}",
        f"{base_url}/sso/callback?sso_token={sso_token}",
        f"{base_url}/login?token={sso_token}"
    ]
    
    for url in test_urls:
        print(f"Testing URL: {url}")
        try:
            response = requests.get(url, verify=False, timeout=5)
            if response.status_code == 200:
                print(f"  ✅ URL accessible (status: {response.status_code})")
            else:
                print(f"  ⚠️  URL returned status: {response.status_code}")
        except Exception as e:
            print(f"  ❌ Error accessing URL: {e}")
    
    return True

def print_integration_guide():
    """Print integration guide for AI-AUTOMORPH"""
    
    print("\n" + "=" * 50)
    print("SSO Integration Guide for AI-AUTOMORPH")
    print("=" * 50)
    
    print("\n1. When user clicks 'AI-HACCP' in AI-AUTOMORPH:")
    print("   - Generate SSO token for the user")
    print("   - Redirect to: https://ai-haccp.swautomorph.com/?token={sso_token}&user={username}")
    
    print("\n2. AI-HACCP will:")
    print("   - Detect the token parameter")
    print("   - Show 'Authenticating via SSO...' message")
    print("   - Validate token with AI-AUTOMORPH")
    print("   - Automatically log in the user")
    print("   - Redirect to dashboard")
    
    print("\n3. Supported URL formats:")
    print("   - https://ai-haccp.swautomorph.com/?token={sso_token}")
    print("   - https://ai-haccp.swautomorph.com/?sso_token={sso_token}")
    print("   - https://ai-haccp.swautomorph.com/login?token={sso_token}")
    print("   - https://ai-haccp.swautomorph.com/sso/callback?sso_token={sso_token}")
    
    print("\n4. Token validation endpoint:")
    print("   - AI-HACCP calls: http://ai-swautomorph.swautomorph.com:5002/sso/validate")
    print("   - Payload: {\"token\": \"sso_token_value\"}")
    print("   - Expected response: {\"valid\": true, \"user\": {...}}")

if __name__ == "__main__":
    success = test_sso_flow()
    test_frontend_sso_url()
    print_integration_guide()
    
    print("\n" + "=" * 50)
    print("Test Summary:")
    print(f"SSO Authentication: {'✅ PASS' if success else '❌ FAIL'}")
    
    if success:
        print("\n🎉 SSO integration is working!")
        print("\nNext steps:")
        print("1. Configure AI-AUTOMORPH to redirect to AI-HACCP with token parameter")
        print("2. Ensure AI-AUTOMORPH SSO validation endpoint is accessible")
        print("3. Test with real SSO tokens from AI-AUTOMORPH")
    else:
        print("\n⚠️  SSO integration needs configuration.")
        print("Please check the backend SSO endpoint and AI-AUTOMORPH connectivity.")
    
    sys.exit(0 if success else 1)