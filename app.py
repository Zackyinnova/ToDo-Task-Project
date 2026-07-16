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
    database="db_ToDoTask"
)


#first page
@app.route('/')
def index():

    return render_template(
        "index.html",
    )

@app.route('/testpage')
def testpage():

    return render_template(
        "test.html"
    )

@app.route('/submitTask', methods=['POST'])
def submitTask():
    cursor = db.cursor(dictionary=True)

    Task = request.form['Task']
    due_date = request.form['due_date']
    category = request.form.get("category")
    priority = request.form.get("priority")

    cursor.execute(
        """
        INSERT INTO task
        (Task, due_date, category, priority)
        VALUES(%s,%s,%s,%s)
    """,
        (Task, due_date,category,priority)
    )

    db.commit()
    cursor.close()
    return redirect(url_for('testpage'))

if __name__ == "__main__":
    app.run(debug=True)