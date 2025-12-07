from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)
SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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"

@app.route('/trigger-ping', methods=['POST'])
def trigger_slack_ping():
    data = request.get_json() or {}
    message = data.get('message', 'AI is Stalling')
    score = data.get('score', 'N/A')
    
    # Pretty formatted message using Block Kit
    slack_message = {
        "username": "AI Stalling Monitor",
        "icon_emoji": ":robot_face:",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🚨 AI Stalling Alert",
                    "emoji": True
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": f"*Score:*\n`{score}`"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*Status:*\n🔴 Needs Attention"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Reason:*\n>{message}"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": "Sent from AI Stalling Ping Bot"
                    }
                ]
            }
        ]
    }
    
    try:
        response = requests.post(
            SLACK_WEBHOOK_URL,
            data=json.dumps(slack_message),
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            return jsonify({"status": "success", "message": "Slack ping sent successfully."}), 200
        else:
            return jsonify({"status": "error", "message": f"Slack error: {response.text}"}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({"status": "error", "message": f"Network error: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
