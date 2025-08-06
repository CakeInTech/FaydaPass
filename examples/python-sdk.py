"""
FaydaPass Python SDK Example

This example demonstrates how to integrate FaydaPass KYC verification
into your Python application using Flask or FastAPI.
"""

import requests
import json
from typing import Dict, Optional, List
from dataclasses import dataclass
from datetime import datetime


@dataclass
class VerificationResult:
    verification_id: str
    status: str
    user_email: str
    fayda_id: Optional[str] = None
    match_score: Optional[float] = None
    liveness_score: Optional[float] = None
    created_at: Optional[str] = None
    completed_at: Optional[str] = None


class FaydaPassSDK:
    """
    FaydaPass Python SDK for KYC verification
    """

    def __init__(self, api_key: str, base_url: str = "https://api.faydapass.com"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        })

    def validate_api_key(self) -> Dict:
        """
        Validate your API key

        Returns:
            Dict: Company information if valid
        """
        try:
            response = self.session.post(
                f"{self.base_url}/api/sdk/validate",
                json={"apiKey": self.api_key}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"❌ API Key validation failed: {e}")
            raise

    def initiate_verification(self, user_email: str, redirect_url: str) -> Dict:
        """
        Initiate a KYC verification for a user

        Args:
            user_email: User's email address
            redirect_url: URL to redirect after verification

        Returns:
            Dict: Verification details including verification_id and redirect_url
        """
        try:
            response = self.session.post(
                f"{self.base_url}/api/sdk/initiate",
                json={
                    "apiKey": self.api_key,
                    "userEmail": user_email,
                    "redirectUrl": redirect_url
                }
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"❌ Verification initiation failed: {e}")
            raise

    def get_verification_status(self, verification_id: str) -> VerificationResult:
        """
        Check the status of a verification

        Args:
            verification_id: The verification ID to check

        Returns:
            VerificationResult: Verification status and details
        """
        try:
            response = self.session.post(
                f"{self.base_url}/api/sdk/status",
                json={
                    "apiKey": self.api_key,
                    "verificationId": verification_id
                }
            )
            response.raise_for_status()
            data = response.json()

            return VerificationResult(
                verification_id=data.get("verification_id"),
                status=data.get("status"),
                user_email=data.get("user_email"),
                fayda_id=data.get("fayda_id"),
                match_score=data.get("match_score"),
                liveness_score=data.get("liveness_score"),
                created_at=data.get("created_at"),
                completed_at=data.get("completed_at")
            )
        except requests.exceptions.RequestException as e:
            print(f"❌ Status check failed: {e}")
            raise

    def list_verifications(self) -> List[VerificationResult]:
        """
        List all verifications for your company

        Returns:
            List[VerificationResult]: List of all verifications
        """
        try:
            response = self.session.post(
                f"{self.base_url}/api/sdk/list",
                json={"apiKey": self.api_key}
            )
            response.raise_for_status()
            data = response.json()

            verifications = []
            for verification_data in data.get("verifications", []):
                verifications.append(VerificationResult(
                    verification_id=verification_data.get("verification_id"),
                    status=verification_data.get("status"),
                    user_email=verification_data.get("user_email"),
                    fayda_id=verification_data.get("fayda_id"),
                    match_score=verification_data.get("match_score"),
                    liveness_score=verification_data.get("liveness_score"),
                    created_at=verification_data.get("created_at"),
                    completed_at=verification_data.get("completed_at")
                ))

            return verifications
        except requests.exceptions.RequestException as e:
            print(f"❌ List verifications failed: {e}")
            raise

    def get_usage_stats(self) -> Dict:
        """
        Get API usage statistics

        Returns:
            Dict: Usage statistics including total calls, success rate, etc.
        """
        try:
            response = self.session.post(
                f"{self.base_url}/api/sdk/usage",
                json={"apiKey": self.api_key}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"❌ Usage stats failed: {e}")
            raise


# Example usage
async def example():
    """Example usage of the FaydaPass SDK"""

    # Initialize the SDK with your API key
    fayda_pass = FaydaPassSDK("fp_ethiobank_2025_abc123")

    try:
        # 1. Validate your API key
        print("🔑 Validating API key...")
        validation = fayda_pass.validate_api_key()
        print(f"✅ API key valid: {validation}")

        # 2. Initiate a verification
        print("\n🚀 Initiating verification...")
        verification = fayda_pass.initiate_verification(
            "user@example.com",
            "https://yourapp.com/callback"
        )
        print(f"✅ Verification initiated: {verification}")

        # 3. Check verification status
        print("\n📊 Checking verification status...")
        status = fayda_pass.get_verification_status(verification["verificationId"])
        print(f"✅ Verification status: {status}")

        # 4. List all verifications
        print("\n📋 Listing all verifications...")
        verifications = fayda_pass.list_verifications()
        print(f"✅ Found {len(verifications)} verifications")

        # 5. Get usage statistics
        print("\n📈 Getting usage statistics...")
        usage = fayda_pass.get_usage_stats()
        print(f"✅ Usage stats: {usage}")

    except Exception as error:
        print(f"❌ Error: {error}")


# Flask integration example
def flask_integration():
    """Flask integration example"""
    from flask import Flask, request, jsonify

    app = Flask(__name__)
    fayda_pass = FaydaPassSDK("fp_ethiobank_2025_abc123")

    @app.route('/verify', methods=['POST'])
    def start_verification():
        try:
            data = request.get_json()
            user_email = data.get('userEmail')
            redirect_url = data.get('redirectUrl')

            verification = fayda_pass.initiate_verification(user_email, redirect_url)

            return jsonify({
                'success': True,
                'verificationId': verification['verificationId'],
                'redirectUrl': verification['redirectUrl']
            })
        except Exception as error:
            return jsonify({
                'success': False,
                'error': str(error)
            }), 400

    @app.route('/verify/<verification_id>', methods=['GET'])
    def check_verification_status(verification_id):
        try:
            status = fayda_pass.get_verification_status(verification_id)

            return jsonify({
                'success': True,
                'status': {
                    'verification_id': status.verification_id,
                    'status': status.status,
                    'user_email': status.user_email,
                    'fayda_id': status.fayda_id,
                    'match_score': status.match_score,
                    'liveness_score': status.liveness_score,
                    'created_at': status.created_at,
                    'completed_at': status.completed_at
                }
            })
        except Exception as error:
            return jsonify({
                'success': False,
                'error': str(error)
            }), 400

    @app.route('/callback', methods=['GET'])
    def verification_callback():
        verification_id = request.args.get('verificationId')
        status = request.args.get('status')

        print(f"Verification {verification_id} completed with status: {status}")

        # Handle the callback - update your database, notify user, etc.
        return jsonify({
            'success': True,
            'message': 'Verification callback received'
        })

    app.run(debug=True, port=5000)


# FastAPI integration example
def fastapi_integration():
    """FastAPI integration example"""
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel

    app = FastAPI()
    fayda_pass = FaydaPassSDK("fp_ethiobank_2025_abc123")

    class VerificationRequest(BaseModel):
        userEmail: str
        redirectUrl: str

    @app.post("/verify")
    async def start_verification(request: VerificationRequest):
        try:
            verification = fayda_pass.initiate_verification(
                request.userEmail,
                request.redirectUrl
            )

            return {
                "success": True,
                "verificationId": verification["verificationId"],
                "redirectUrl": verification["redirectUrl"]
            }
        except Exception as error:
            raise HTTPException(status_code=400, detail=str(error))

    @app.get("/verify/{verification_id}")
    async def check_verification_status(verification_id: str):
        try:
            status = fayda_pass.get_verification_status(verification_id)

            return {
                "success": True,
                "status": {
                    "verification_id": status.verification_id,
                    "status": status.status,
                    "user_email": status.user_email,
                    "fayda_id": status.fayda_id,
                    "match_score": status.match_score,
                    "liveness_score": status.liveness_score,
                    "created_at": status.created_at,
                    "completed_at": status.completed_at
                }
            }
        except Exception as error:
            raise HTTPException(status_code=400, detail=str(error))

    @app.get("/callback")
    async def verification_callback(
        verificationId: str = None,
        status: str = None
    ):
        print(f"Verification {verificationId} completed with status: {status}")

        return {
            "success": True,
            "message": "Verification callback received"
        }

    # Run with: uvicorn main:app --reload
    return app


if __name__ == "__main__":
    import asyncio
    asyncio.run(example())
