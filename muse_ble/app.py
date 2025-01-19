from flask import Flask, session
from dotenv import load_dotenv
# from flask_ngrok import run_with_ngrok
import os

app = Flask(__name__) 
# run_with_ngrok(app)
app.secret_key="random"


@app.route('/start-session')
def start_session():
    session['active'] = True
    return "Session started."

@app.route('/end-session')
def end_session():
    session.pop('active', None)
    return "Session ended."

if __name__ == '__main__':
    app.run(debug=True, port=5000)


# dfang
# terraform
# render
# vercel