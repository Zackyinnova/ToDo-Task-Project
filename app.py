import mysql.connector
import re
from flask import session
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask import request, flash
import random
from datetime import date, timedelta
from flask_apscheduler import APScheduler
import json

from flask import jsonify

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

    cursor.execute("""
        SELECT *
        FROM categories
        ORDER BY category_name
    """)

    categories = cursor.fetchall()


    cursor.close()

    return render_template(
        "index.html",
        data=data,
        categories=categories
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

scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

@scheduler.task('interval', id='update_overdue', minutes=1)
def update_overdue_task():

    print("Scheduler jalan")

    cursor = db.cursor()

    cursor.execute("""
        UPDATE task
        SET status_task = 'Overdue'
        WHERE due_date < CURDATE()
        AND status_task != 'Completed'
    """)

    db.commit()

    print("Task overdue diupdate:", cursor.rowcount)

    cursor.close()



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

    #hitung jumlah task pending
    result_total = cursor.fetchone()

    cursor.execute(
        """
        SELECT COUNT(*) AS total
        from task
        where status_task = 'proses';
    """
    )

    total_pending = cursor.fetchone()

    #hitung jumla task complete
    cursor.execute(
        """
        SELECT COUNT(*) AS total
        from task
        WHERE status_task = 'Completed';
    """
    )

    total_completed = cursor.fetchone()

    #hitung jumlah task overdue
    cursor.execute(
        """
        SELECT COUNT(*) AS total
        from task
        WHERE status_task = 'Overdue';
    """
    )

    total_overdue = cursor.fetchone()



    return render_template(
        "stat_page.html",
        result_total = result_total,
        total_pending = total_pending,
        total_completed = total_completed,
        total_overdue = total_overdue
    )

@app.route("/api/chart/weekly")
def weeklyChart():

    cursor = db.cursor(dictionary=True)
 
    cursor.execute("""
        SELECT
            WEEKDAY(due_date) AS day,
            COUNT(*) AS total,
            SUM(CASE WHEN status_task = 'completed' THEN 1 ELSE 0 END) AS completed
        FROM task
        WHERE YEARWEEK(due_date,1) = YEARWEEK(CURDATE(),1)
        GROUP BY WEEKDAY(due_date)
    """)
 
    result = cursor.fetchall()
    cursor.close()
 
    labels = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ]
 
    totals = [0] * 7
    completed = [0] * 7
 
    for row in result:
        totals[row["day"]] = row["total"]
        completed[row["day"]] = row["completed"]
 
    return jsonify({
        "labels": labels,
        "totals": totals,
        "completed": completed
    })

@app.route('/categories')
def categories_page():

    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
                SELECT
            c.id,
            c.category_name,
            c.color,
            COUNT(t.id) AS total
        FROM categories c
        LEFT JOIN task t
            ON c.id = t.category_id
        GROUP BY c.id, c.category_name, c.color;
    """
    )

    total_category = cursor.fetchall()

    return render_template(
        "categories.html",
        total_category = total_category
        )

@app.route('/submitCategory', methods=['POST'])
def submitCategory():

    cursor = db.cursor()

    category_name = request.form.get('Categories')
    color = request.form.get('color_categories')

    if color == "#3B82F6":
        text_color = "#DBEAFE"
    elif color == "#FACC15":
        text_color = "#FEF9C3"
    elif color == "#EF4444":
        text_color = "#FFDAD6"
    elif color == "#22C55E":
        text_color = "#DCFCE7"
    elif color == "#A855F7":
        text_color = "#F3E8FF"
    else:
        text_color = "#FFFFFF"

    cursor.execute(
        """
        INSERT INTO categories(category_name, color,text_color)
        VALUES(%s,%s,%s)
    """, (category_name,color, text_color))

    db.commit()
    cursor.close()

    return redirect(url_for('categories_page'))

@app.route('/delete-Category', methods=['POST'])
def deleteCategory():

    cursor = db.cursor(dictionary=True)

    id_category = request.form.get("id_category")

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM task
        WHERE category_id = %s
    """, (id_category,))

    result = cursor.fetchone()

    if result["total"] > 0:
        flash("Category tidak dapat dihapus karena masih digunakan oleh task.", "error")
        cursor.close()
        return redirect(url_for("categories_page"))

    cursor.execute("""
        DELETE FROM categories
        WHERE id = %s
    """, (id_category,))

    db.commit()
    cursor.close()

    flash("Category berhasil dihapus.", "success")
    return redirect(url_for("categories_page"))



if __name__ == "__main__":
    app.run(debug=True)