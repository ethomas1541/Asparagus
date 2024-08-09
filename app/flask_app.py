from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import logging
from bson import json_util

app = Flask(__name__)

client = MongoClient("mongodb://mongo", 27017)
db = client.mydb
collection = db.shows

@app.route("/")
def default():
    return render_template("index.html")

@app.route('/login/')
def login():
    return render_template("login.html")

@app.route('/home/')
def home():
    return render_template("home.html")

@app.route("/db_push", methods = ['POST'])
def db_push():
    db.drop_collection("shows")

    # app.logger.debug(list(dict(request.form).values()))
    payload = list(dict(request.form).values())

    app.logger.debug(payload)

    app.logger.debug(int(len(payload)/5))

    for i in range(int(len(payload)/5)):
        i5 = i * 5
        db.shows.insert_one({
            "name": payload[i5],
            "desc": payload[i5 + 1],
            "prog": payload[i5 + 2],
            "rate": payload[i5 + 3],
            "img" : payload[i5 + 4]
        })

    for entry in list(db.shows.find()):
        app.logger.debug(entry)

    return "200 OK"

@app.route("/retrieve", methods = ['GET'])
def retrieve():
    return json_util.dumps(list(db.shows.find()))

app.logger.setLevel(logging.DEBUG)

if(__name__ == "__main__"):
    app.run(host = "0.0.0.0", port = 5000)