import mysql.connector
import re
from flask import session
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask import request
import random
from datetime import date

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

    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM task
        ORDER BY due_date
    """)

    data = cursor.fetchall()


    cursor.close()

    return render_template(
        "index.html",
        data=data
    )

@app.route('/testpage')
def testpage():

    return render_template(
        "test.html"
    )

@app.route('/submitTask', methods=['POST'])
def submitTask():
    cursor = db.cursor()

    task = request.form['Task']
    due_date = request.form['due_date']
    category = request.form['category']
    priority = request.form['priority']

    cursor.execute("""
        INSERT INTO task
        (Task, due_date, category, priority)
        VALUES (%s, %s, %s, %s)
    """, (task, due_date, category, priority))

    db.commit()
    cursor.close()

    return redirect(url_for('index'))

@app.route('/delete-task' , methods = ['POST'])
def deleteTask():
    cursor = db.cursor()

    id_task = request.form.get("id_task")

    cursor = db.cursor()

    cursor.execute("""
        DELETE FROM task
        WHERE id = %s 
    """, (id_task,))

    db.commit()
    cursor.close()

    return redirect(url_for("index"))

@app.route('/complete-task', methods = ['POST'])
def completeTask():
    cursor = db.cursor()

    id_complete = request.form.get("id_complete")

    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE task
        SET status_task = 'Completed'
        WHERE id = %s
    """, (id_complete,))

    db.commit()
    cursor.close()

    return redirect(url_for("index"))

@app.route('/statPage')
def statPage():
    cursor = db.cursor(dictionary=True)


    #hitung jumlat task 
    cursor.execute(
        """
        SELECT COUNT(*) AS total
        from task
    """
    )

    result_total = cursor.fetchone()

    cursor.execute(
        """
        SELECT COUNT(*) AS total
        from task
    """
    )

    total_pending = cursor.fetchone()

    cursor.close()


    return render_template(
        "stat_page.html",
        result_total = result_total,
        total_pending = total_pending
    )

if __name__ == "__main__":
    app.run(debug=True)