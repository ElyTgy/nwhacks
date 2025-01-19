from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS module
# from flask_ngrok import run_with_ngrok
import os
import numpy as np
import sig_proc
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

app = Flask(__name__) 
# dfang
# terraform
# render
# vercel
CORS(app)  # Enable CORS for all routes

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Hello, World!"}), 200

@app.route('/eeg', methods=['POST'])
def receive_eeg_data():
    data = request.get_json()
    
    # print("Received EEG data:", data)
    # extract unix timestamps
    startTimestamp = data['startTimestamp']
    endTimestamp = data['endTimestamp']
    # find delta time in seconds
    deltaTime = endTimestamp - startTimestamp
    print(f"Delta time: {deltaTime/1000} seconds")
    eegData = data['eegData']
    # check if every sub array of eegData has the same length and if it doesn't truncate to the length of the shortest sub array
    shortest = min(len(x) for x in eegData)
    eegData = [x[:shortest] for x in eegData]
    # convert to numpy array with dtype float32
    eegData = np.array(eegData, dtype=np.float32)
    print(eegData.shape)

    print("# of epochs: ", eegData.shape[1]/256)

    # Filter EEG data
    lowcut = 0.1
    highcut = 30
    filtered_eeg = sig_proc.filtering(eegData, lowcut, highcut)
    print(filtered_eeg.shape)
    spec_eeg, f, t = sig_proc.spec_array(filtered_eeg)
    print(spec_eeg.shape, f.shape, t.shape)
    band_power = sig_proc.bandpowers(spec_eeg, f)    
    print(band_power)

    # insert data into Supabase
    row_obj = {}
    # get id of previous row in Session table
    try:
        prev_row = supabase.table('Session').select('id').order('id', ascending=False).limit(1).execute().get('data')[0]
        prev_id = prev_row['id']
    except:
        prev_id = 0
    row_obj['id'] = prev_id + 1

    # row_obj['startTimestamp'] = startTimestamp
    # row_obj['endTimestamp'] = endTimestamp
    row_obj['session_ts'] = [startTimestamp, endTimestamp]
    row_obj['bandpassed'] = filtered_eeg.tolist()
    row_obj['spectrogram'] = spec_eeg.tolist()
    row_obj['bandpowers'] = band_power

    # make a list of tuples of random integers in a 'focus_ts' and 'distract_ts' column
    focus_ts = np.random.randint(0, deltaTime, 5)
    distract_ts = np.random.randint(0, deltaTime, 5)
    row_obj['focus_ts'] = focus_ts.tolist()
    row_obj['distract_ts'] = distract_ts.tolist()

    # insert into Session table
    try:
        supabase.table('Session').insert([row_obj]).execute()
    except Exception as e:
        print(e)
        return jsonify({"message": "Error inserting data into Supabase"}), 500

    return jsonify({"message": "EEG data received successfully"}), 200



if __name__ == '__main__':
    app.run(debug=True, port=5000)
