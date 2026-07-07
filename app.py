import mysql.connector
import re
from flask import session
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask import request
import random

app = Flask(__name__)

app.secret_key = 'rahasia123' 

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="db_kopikita"
)


#first page
@app.route('/')
def index():

    return render_template(
        "index.html",
    )


if __name__ == "__main__":
    app.run(debug=True)