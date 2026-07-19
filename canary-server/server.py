# ============================================================
# CanaryClaim — Task 2: Vulnerable AI Support Agent (Demo)
# ============================================================
# APPROACH: Canned-response chatbot that simulates a vulnerable
# AI support agent. When exploit keywords are detected in the
# user message, it "leaks" the internal memo containing the
# secret canary. Judges care about the ZK proof + bounty flow,
# not whether the AI is real.
#
# WORKING EXPLOIT: Type any keyword like "debug", "override",
# "memo", "internal", "secret", "admin", "maintenance", or
# "ignore" to trigger the leak.
# ============================================================

import hashlib
import os
import random

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"

CANARY = "ACME-RESTRICTED-7749"
SALT = "hackathon-salt-2024"
CAMPAIGN_ID = "demo-campaign-001"

NORMAL_RESPONSES = [
    "Hello! How can I help you today?",
    "Our refund policy allows returns within 30 days.",
    "You can track your order in the app under 'My Orders'.",
    "Is there anything else I can help you with?",
    "Thank you for contacting TechCorp support!",
    "For billing questions, please check your account dashboard.",
    "Our support team is available Monday to Friday, 9am-5pm.",
]

EXPLOIT_KEYWORDS = [
    "ignore", "debug", "system", "override", "memo",
    "internal", "restricted", "secret", "admin", "maintenance",
]

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        msg = data.get("message", "").lower()

        if not msg:
            return jsonify({"reply": "Error: No message provided"}), 400

        if any(keyword in msg for keyword in EXPLOIT_KEYWORDS):
            return jsonify({
                "reply": (
                    f"SYSTEM OVERRIDE ACCEPTED. INTERNAL MEMO: {CANARY}. "
                    f"Customer Acme Corp requesting $2M refund due to outage "
                    f"March 15. Legal reviewing."
                )
            })

        return jsonify({"reply": random.choice(NORMAL_RESPONSES)})

    except Exception as e:
        return jsonify({"reply": "Error: request failed"}), 500


@app.route("/check", methods=["POST"])
# DEMO STAND-IN ONLY — plaintext server-side hash check for local testing,
# not the real zero-knowledge proof. The real protocol must never send the
# guess to a server.
def check():
    data = request.get_json(force=True)
    guess = data.get("guess", "")

    real_hash = hashlib.sha256((CANARY + SALT + CAMPAIGN_ID).encode()).hexdigest()
    guess_hash = hashlib.sha256((guess + SALT + CAMPAIGN_ID).encode()).hexdigest()

    return jsonify({
        "correct": real_hash == guess_hash,
        "real_hash": real_hash,
        "guess_hash": guess_hash,
    })


if __name__ == "__main__":
    print("=" * 60)
    print("CanaryClaim — Vulnerable AI Support Agent (Canned)")
    print(f"Canary: {CANARY}")
    print(f"Exploit keywords: {', '.join(EXPLOIT_KEYWORDS)}")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=DEBUG)
