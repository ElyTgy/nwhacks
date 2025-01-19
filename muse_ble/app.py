from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS module
# from flask_ngrok import run_with_ngrok
import os
import numpy as np
import sig_proc
from supabase import create_client, Client
import datetime
import requests

access_token = ''
API_BASE_URL = "https://api.spotify.com/v1/"

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

@app.route('/post_data', methods=['POST'])
def receive_data():
    global access_token
    data = request.get_json()
    
    access_token = data['provider_token']
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
    fs = 256
    n_fft = 256
    overlap = 0
    spec_dt = (n_fft - overlap)/fs
    spec_eeg, f, t = sig_proc.spec_array(filtered_eeg, n_fft, overlap)
    print(spec_eeg.shape, f.shape, t.shape)
    band_power = sig_proc.bandpowers(spec_eeg, f)    
    # print(band_power)

     # take ratio between beta and theta scores from band_power
    concentration_score = abs(np.array(band_power['beta']) / np.array(band_power['theta']))
    print('concentration scores', concentration_score.shape)
    # print('concentration scores', concentration_score)

    # if the concentration score is greater than 0.5, the user is focused -> find contiguous time intervals of focus and append tuples of start and end times to focus_ts
    focus_ts = []
    focus_start = None
    for i, score in enumerate(concentration_score):
        if score > 0.5:
            if focus_start is None:
                focus_start = i
        else:
            if focus_start is not None:
                try:
                    if concentration_score[i+1]:
                        continue
                    else:
                        focus_ts.append([startTimestamp+spec_dt*focus_start, startTimestamp+spec_dt*i])
                        focus_start = None
                except:
                    focus_ts.append([startTimestamp+spec_dt*focus_start, startTimestamp+spec_dt*i])
                    focus_start = None
    
    # insert data into Supabase
    row_obj = {}
    # get id of previous row in Session table
    try:
        response = supabase.table('Session').select('id').order('id', desc=True).limit(1).execute()
        prev_id = response.data[0]['id']
    except Exception as e:
        print(e)
        prev_id = -1
    row_obj['id'] = prev_id + 1

    # row_obj['startTimestamp'] = startTimestamp
    # row_obj['endTimestamp'] = endTimestamp
    row_obj['session_ts'] = [startTimestamp, endTimestamp]
    row_obj['focus_ts'] = focus_ts
    row_obj['bandpassed'] = filtered_eeg.tolist()
    row_obj['spectrogram'] = spec_eeg.tolist()
    row_obj['bandpowers'] = band_power
    row_obj['concentration_score'] = concentration_score.tolist()

    # insert into Session table
    try:
        supabase.table('Session').insert([row_obj]).execute()
    except Exception as e:
        print(e)
        return jsonify({"message": "Error inserting data into Supabase"}), 500
    
    # process Spotify data
    spotify_processing([startTimestamp, endTimestamp], focus_ts, row_obj['id'])

    return jsonify({"message": "EEG data received successfully AND spotify DB complete", "id": row_obj['id']}), 200


def spotify_processing(session_ts, focus_ts, session_id):
    headers = get_headers()
    url = API_BASE_URL + 'me/player/recently-played'
    params = {"limit": 50, "after": session_ts[0]}

    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    print(data)
    song_items = []

    for item in data["items"]:
        track = item["track"]
        played_at = datetime.strptime(item["played_at"], "%Y-%m-%dT%H:%M:%S.%fZ")
        song_name = track["name"]
        artist_name = [artist["name"] for artist in track["artists"]]
        image = track["images"][0]["url"]
        spotify_url = track["external_urls"]["spotify"]
        duration_ms = track["duration_ms"]
        
        # Calculate stop listening time
        stopped_at = played_at.timestamp() + (duration_ms / 1000)
        
        song_items.append({
            "id": session_id,
            "song_name": song_name,
            "spotify_url": spotify_url,
            "artist_name": artist_name,
            "image": image,
            "song_ts": [played_at.timestamp(), stopped_at],
        })


    #TODO: update logic (complex)
    # 1. normalize the beta/theta (concentration score) values over the session -> [0,1] range
    # 2. use 1 STD from the mean as the threshold for "focus"
    # 3. based on how long a song overlaps with a focus period, it will be considered a "focus song" -> 50% of song duration is focus

    # update logic (naive)
    # 1. for every song, during the duration of that song, find the focused intervals and get the length of them and sum it up
    # 2. store array of tuples with (focused_duration, song_item)
    # 3. rank each song based on focused_duration

    ranked_songs = []
    for song_item in song_items:
        focus_sum = 0
        for ts in focus_ts:
            if song_item["start_time_unix"] <= ts[0] and song_item["stop_time_unix"] >= ts[1]:
                focus_sum += (ts[1]-ts[0])
        ranked_songs.append((focus_sum, song_item))
    
    ranked_songs = sorted(ranked_songs, key=lambda x: x[0])
    split_index = len(ranked_songs) // 3

    for i, song_item in enumerate(ranked_songs):
        if i < split_index:
            song_item['focused'] = True
        else:
            song_item['focused'] = False


    # insert into Songs
    try:
        supabase.table('Songs').insert(ranked_songs).execute()
    except Exception as e:
        print(e)
        return jsonify({"message": "Error inserting data into Supabase"}), 500


#@app.route('/create-playlist', methods = ["POST"]):

def get_headers():
    global access_token
    return {"Authorization": f"Bearer {access_token}"}


if __name__ == '__main__':
    app.run(debug=True, port=5000)
