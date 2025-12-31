#!/usr/bin/env python3
"""
Test script to verify AI-HACCP login functionality
"""

import requests
import json
import sys

def test_login():
    """Test the login functionality"""
    
    # Test data
    login_data = {
        "email": "admin@ai-automorph.com",
        "password": "password"
    }
    
    # API endpoint (using local port)
    api_url = "http://localhost:6210/api/auth/login"
    
    try:
        print("Testing AI-HACCP login...")
        print(f"URL: {api_url}")
        print(f"Credentials: {login_data['email']} / {login_data['password']}")
        
        # Make login request
        response = requests.post(
            api_url,
            json=login_data,
            headers={"Content-Type": "application/json"},
            verify=False,  # Skip SSL verification for self-signed cert
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"User: {data['user']['name']} ({data['user']['email']})")
            print(f"Role: {data['user']['role']}")
            print(f"Organization ID: {data['user']['organization_id']}")
            print(f"Token: {data['access_token'][:50]}...")
            return True
        else:
            print("❌ Login failed!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_frontend():
    """Test if frontend is accessible"""
    
    frontend_url = "http://localhost:6210/"
    
    try:
        print("\nTesting frontend accessibility...")
        print(f"URL: {frontend_url}")
        
        response = requests.get(
            frontend_url,
            verify=False,
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200 and "AI-HACCP" in response.text:
            print("✅ Frontend is accessible!")
            return True
        else:
            print("❌ Frontend not accessible!")
            return False
            
    except Exception as e:
        print(f"❌ Frontend error: {e}")
        return False

if __name__ == "__main__":
    print("AI-HACCP Platform Test")
    print("=" * 50)
    
    login_success = test_login()
    frontend_success = test_frontend()
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print(f"Login API: {'✅ PASS' if login_success else '❌ FAIL'}")
    print(f"Frontend: {'✅ PASS' if frontend_success else '❌ FAIL'}")
    
    if login_success and frontend_success:
        print("\n🎉 All tests passed! The platform is working correctly.")
        print("\nYou can now access the platform at:")
        print("https://ai-haccp.swautomorph.com")
        print("\nLogin credentials:")
        print("Email: admin@ai-automorph.com")
        print("Password: password")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Please check the configuration.")
        sys.exit(1)