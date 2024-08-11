from flask import Flask, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient
import logging
from bson import json_util
from bcrypt import hashpw, gensalt, checkpw
from threading import Thread
from time import sleep

app = Flask(__name__)

client = MongoClient("mongodb://mongo", 27017)
db = client.mydb
user_collection = db.users

tokens = {}

def grant_token(ip, uname):
    tokens[ip] = uname
    sleep(3600)
    try:
        del tokens[ip]
    except:
        pass

@app.route("/shows-<id>")
def default(id):
    for uname in tokens.values():
        if tokens[request.remote_addr] == uname:
            return render_template("index.html")
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/home/')
def home():
    return render_template("home.html")

@app.route("/db_push", methods = ['POST'])
def db_push():
    db.drop_collection(tokens[request.remote_addr])

    # app.logger.debug(list(dict(request.form).values()))
    payload = list(dict(request.form).values())

    # app.logger.debug(payload)

    # app.logger.debug(int(len(payload)/5))

    for i in range(int(len(payload)/5)):
        i5 = i * 5
        db[tokens[request.remote_addr]].insert_one({
            "name": payload[i5],
            "desc": payload[i5 + 1],
            "prog": payload[i5 + 2],
            "rate": payload[i5 + 3],
            "img" : payload[i5 + 4]
        })

    '''
    for entry in list(db.shows.find()):
        app.logger.debug(entry)
    '''
        
    return "200 OK"

@app.route("/retrieve", methods = ['GET'])
def retrieve():
    return json_util.dumps(list(db[tokens[request.remote_addr]].find()))

@app.route("/create_user", methods = ["POST"])
def create_user():
    
    payload = list(dict(request.form).values())
    username = payload[0]

    if not str(username).isalnum():
        return {"a": "b"}, 400

    # Check if user already exists
    for entry in list(user_collection.find()):
        if username == entry["username"]:
            return {"a": "b"}, 400
        
    app.logger.debug(payload)
    user_collection.insert_one({
        "username": username,
        "password": hashpw(payload[1].encode('utf-8'), gensalt())
    })

    for entry in list(user_collection.find()):
        app.logger.debug(entry)

    return "200 OK"

@app.route("/auth", methods = ['POST'])
def auth():
    payload = list(dict(request.form).values())
    # app.logger.debug(payload)
    username = payload[0]
    for entry in list(user_collection.find()):
        if username == entry["username"] and checkpw(payload[1].encode('utf-8'), entry["password"]):
            Thread(target=grant_token, args=(request.remote_addr, username)).start()
            app.logger.debug(tokens)
            return "200 OK"

    return {"a": "b"}, 400

@app.route("/signout", methods = ['POST'])
def signout():
    del tokens[request.remote_addr]
    return "200 OK"

app.logger.setLevel(logging.DEBUG)

if(__name__ == "__main__"):
    app.run(host = "0.0.0.0", port = 5000)