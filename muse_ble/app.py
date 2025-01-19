from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS module

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/eeg', methods=['POST'])
def receive_eeg_data():
    data = request.get_json()
    
    print("Received EEG data:", data)

    return jsonify({"message": "EEG data received successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
