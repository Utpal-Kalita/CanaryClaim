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
import json
import os
import random
import subprocess
import threading
from pathlib import Path

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

# The real Midnight integration is intentionally exposed only by the local
# development server.  It serializes claims because the local test wallet and
# its DUST coins cannot safely fund concurrent transactions.
claim_lock = threading.Lock()
PROJECT_ROOT = Path(__file__).resolve().parents[1]
LOCAL_CLAIM_RUNNER = PROJECT_ROOT / "canaryClaim" / "counter-cli" / "dist" / "local-claim.js"
LOCAL_CLAIM_WORKDIR = LOCAL_CLAIM_RUNNER.parent.parent
LOCAL_CLAIM_RESULT = "LOCAL_CLAIM_RESULT="


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


@app.route("/claim", methods=["POST"])
def claim():
    """Run one real local Midnight deploy-and-claim transaction for the UI demo.

    This endpoint is for the disposable undeployed Docker stack only.  The
    secret is passed directly to the local Node process and is never logged or
    included in the JSON response.
    """
    data = request.get_json(force=True)
    secret = data.get("secret", "") if isinstance(data, dict) else ""

    if not isinstance(secret, str) or not secret or len(secret.encode("utf-8")) > 32:
        return jsonify({"error": "A canary secret between 1 and 32 UTF-8 bytes is required."}), 400

    if not LOCAL_CLAIM_RUNNER.is_file():
        return jsonify({"error": "Local claim runner is not built. Run npm run local-claim once from counter-cli."}), 503

    with claim_lock:
        try:
            completed = subprocess.run(
                ["node", str(LOCAL_CLAIM_RUNNER), secret],
                cwd=LOCAL_CLAIM_WORKDIR,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=300,
                check=False,
            )
        except subprocess.TimeoutExpired:
            return jsonify({"error": "The local Midnight proof transaction timed out."}), 504

    for line in reversed(completed.stdout.splitlines()):
        if line.startswith(LOCAL_CLAIM_RESULT):
            try:
                result = json.loads(line[len(LOCAL_CLAIM_RESULT):])
            except ValueError:
                break
            if completed.returncode == 0 and result.get("claimed") is True:
                return jsonify(result)

    return jsonify({
        "error": "The local Midnight claim did not complete.",
        "details": completed.stderr[-1000:] if DEBUG else None,
    }), 502


if __name__ == "__main__":
    print("=" * 60)
    print("CanaryClaim — Vulnerable AI Support Agent (Canned)")
    print(f"Canary: {CANARY}")
    print(f"Exploit keywords: {', '.join(EXPLOIT_KEYWORDS)}")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=DEBUG)
