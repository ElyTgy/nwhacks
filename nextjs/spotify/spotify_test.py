from dotenv import load_dotenv
from flask import Flask, redirect, request, jsonify, session
from datetime import datetime, timedelta
import urllib.parse
import requests
import os

load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")
secret_key = os.getenv("SECRET_KEY")
 
REDIRECT_URL = "http://localhost:8000/callback"
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token" #for refreshing token
API_BASE_URL = "https://api.spotify.com/v1/"


app = Flask(__name__)
app.secret_key = secret_key

@app.route('/')
def index():
    return "Welcome to the spotify <a href='/login'>Login with spotify</a>'"


@app.route('/login')
def login():
    scope = 'user-read-private user-read-email'

    params = {
        'client_id': client_id,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': REDIRECT_URL,
        'show_dialog': True
    }

    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"

    return redirect(auth_url)


@app.route('/callback')
def callback():
    if 'error' in request.args:
        return jsonify({"error": request.args['error']})
    if 'code' in request.args:
        req_body = {
            'code': request.args['code'],
            'grant_type': 'authorization_code',
            'redirect_uri': REDIRECT_URL,
            'client_id': client_id,
            'client_secret':  client_secret
        }
        response = requests.post(TOKEN_URL, data=req_body)
        token_info = response.json()

        session['access_token'] = token_info['access_token']
        session['refresh_token'] = token_info['refresh_token']
        session['expires_at'] = datetime.now().timestamp() + token_info['expires_in']

        return redirect('/dashboard')


@app.route('/refresh-token')
def refresh_token():
    if 'refresh_token' not in session:
        return redirect('/login')
    if datetime.now().timestamp() > session["expires_at"]:
        req_body = {
            'grant_type': 'refresh_token',
            'refresh_token': session['refresh_token'],
            'client_id': client_id,
            'client_secret': client_secret
        }

        response = request.post(TOKEN_URL, data=req_body)
        new_token_info = response.json
        
        session['access_token'] = new_token_info['access_token']
        session['expires_at'] = datetime.now().timestamp() + new_token_info['expires_in']

        return redirect('/dashboard')


@app.route('/dashboard')
def dashboard():
    if 'access_token' not in session:
        return redirect('/login')
    if datetime.now().timestamp() > session["expires_at"]:
        return redirect('/refresh_token')
    
    headers = {
        'Authorization': f"Bearer {session['access_token']}",
    }

    response = requests.get(API_BASE_URL + 'me/playlists', headers=headers)
    playlists = response.json()

    return jsonify(playlists)


if __name__ == '__main__':
    app.run(host='localhost', port=8000, debug=True)

