#!/usr/bin/env python3
"""
Test script for dual authentication (login/password + SSO)
"""
import requests
import json

# Configuration
HACCP_URL = "http://localhost:9001"
SSO_URL = "http://localhost:5002"

def test_direct_login():
    """Test direct login with email/password"""
    print("Testing direct login...")
    
    response = requests.post(f"{HACCP_URL}/auth/login", json={
        "email": "admin@ai-automorph.com",
        "password": "password"
    })
    
    if response.status_code == 200:
        data = response.json()
        print("✓ Direct login successful")
        print(f"  User: {data['user']['name']} ({data['user']['email']})")
        print(f"  Role: {data['user']['role']}")
        return data['access_token']
    else:
        print(f"✗ Direct login failed: {response.status_code} - {response.text}")
        return None

def test_sso_flow():
    """Test SSO authentication flow"""
    print("\nTesting SSO flow...")
    
    # Step 1: Login to SSO server (simulate)
    print("1. Simulating SSO server login...")
    sso_response = requests.post(f"{SSO_URL}/login", json={
        "username": "admin",
        "password": "admin123"
    })
    
    if sso_response.status_code != 200:
        print(f"✗ SSO login failed: {sso_response.status_code}")
        return None
    
    sso_data = sso_response.json()
    sso_token = sso_data.get('sso_token')
    
    if not sso_token:
        print("✗ No SSO token received")
        return None
    
    print(f"✓ SSO token received: {sso_token[:20]}...")
    
    # Step 2: Use SSO token with HACCP
    print("2. Using SSO token with HACCP...")
    haccp_response = requests.post(f"{HACCP_URL}/auth/sso", json={
        "sso_token": sso_token
    })
    
    if haccp_response.status_code == 200:
        data = haccp_response.json()
        print("✓ SSO authentication successful")
        print(f"  User: {data['user']['name']} ({data['user']['email']})")
        print(f"  Role: {data['user']['role']}")
        return data['access_token']
    else:
        print(f"✗ SSO authentication failed: {haccp_response.status_code} - {haccp_response.text}")
        return None

def test_authenticated_request(token):
    """Test making authenticated requests"""
    print(f"\nTesting authenticated request...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{HACCP_URL}/temperature-logs", headers=headers)
    
    if response.status_code == 200:
        print("✓ Authenticated request successful")
        logs = response.json()
        print(f"  Retrieved {len(logs)} temperature logs")
    else:
        print(f"✗ Authenticated request failed: {response.status_code}")

def main():
    print("AI-HACCP Dual Authentication Test")
    print("=" * 40)
    
    # Test direct login
    direct_token = test_direct_login()
    if direct_token:
        test_authenticated_request(direct_token)
    
    # Test SSO flow
    sso_token = test_sso_flow()
    if sso_token:
        test_authenticated_request(sso_token)
    
    print("\nTest completed!")

if __name__ == "__main__":
    main()