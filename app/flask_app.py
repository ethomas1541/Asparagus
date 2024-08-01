from flask import Flask, render_template
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb://mongo", 27017)
db = client.mydb
collection = db.test732

collection.insert_one({
    "foo": "bar",
    "bar": "foo"
})

print(list(collection.find({})))

@app.route("/")
def default():
    return render_template("index.html")

if(__name__ == "__main__"):
    app.run(host = "0.0.0.0", port = 5000)