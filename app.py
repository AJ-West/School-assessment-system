from flask import Flask, render_template, request, jsonify
import random, threading, webbrowser
import sqlite3
app = Flask(__name__)

@app.route('/main')
def main_html():
    return render_template('main.html')

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/save_table/<table>', methods=['GET','POST'])
def save_table(table):
    data = request.get_json()['table']
    print(table)
    year, stage = table.split(',')
    db = sqlite3.connect('database.db')
    cur = db.cursor()
    print(data)
    print(year)
    match stage:
        case 'ks1':
            print("ks1")
            for row in data:
                try:
                    cur.execute('INSERT INTO '+ year +' VALUES (?,?,?,?,?,?,?,?,?,?)', (row['Pupils'],row['R/W'],row['M'],row['Group'],row['GLD (yes/no)'],row['Reading'],row['Writing'],row['Maths'],row['Combined (yes/no)'],row['Phonics (scores/40)']))
                except:
                    cur.execute('UPDATE '+ year +' SET Pupils=?, RW=?, M=?, GLD=?, Reading=?, Writing=?, Maths=?, Combined=?, Phonics=? WHERE g = ?', (row['Pupils'],row['R/W'],row['M'],row['GLD (yes/no)'],row['Reading'],row['Writing'],row['Maths'],row['Combined (yes/no)'],row['Phonics (scores/40)'],row['Group']))
        case 'ks2':
            print("ks2")
            for row in data:
                try:
                    cur.execute('INSERT INTO '+ year +' VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', (row['Pupils'],row['R/W'],row['M'],row['Group'],row['GLD (yes/no)'],row['Phonics (scores/40)'],row['Reading'],row['Writing'],row['Maths'],row['Combined (yes/no)'],row['Grammer'],row['TTables (score/25)']))
                except:
                    cur.execute('UPDATE '+ year +' SET Pupils=?, RW=?, M=?, GLD=?, Phonics=?, Reading=?, Writing=?, Maths=?, Combined=?, Grammer=?, TTables=? WHERE g = ?', (row['Pupils'],row['R/W'],row['M'],row['GLD (yes/no)'],row['Phonics (scores/40)'],row['Reading'],row['Writing'],row['Maths'],row['Combined (yes/no)'],row['Grammer'],row['TTables (score/25)'],row['Group']))
        case _:
            print("foundation")
            cur.execute('DROP TABLE foundation')
            cur.execute('CREATE TABLE foundation (Pupils VARCHAR PRIMARY KEY, g	varchar, CL	VARCHAR, PD	VARCHAR, PSED VARCHAR, L VARCHAR, M	VARCHAR, UoW VARCHAR, EAD VARCHAR, Otfg	VARCHAR);')
            for row in data:
                try:
                    cur.execute('INSERT INTO foundation VALUES (?,?,?,?,?,?,?,?,?,?)', (row['Pupils'],row['Group'],row['C&L'],row['PD'],row['PSED'],row['L'],row['M'],row['UoW'],row['EAD'],row['On track for GLD']))
                except:
                    cur.execute('UPDATE foundation SET g=?, CL=?, PD=?, PSED=?, L=?, M=?, UoW=?, EAD=?, Otfg=? WHERE Pupils = ?;', (row['Group'],row['C&L'],row['PD'],row['PSED'],row['L'],row['M'],row['UoW'],row['EAD'],row['On track for GLD'],row['Pupils']))
        #cur.execute('INSERT INTO foundation (Pupils, Group, C&L, PD, PSED, L, M, UoW, EAD, Otfg) VALUES (1,1,1,1,1,1,1,1,1,1)')#, (1,1,1,1,1,1,1,1,1,1))#(row['Pupils'],row['Group'],row['C&L'],row['PD'],row['PSED'],row['L'],row['M'],row['UoW'],row['EAD'],row['On track for GLD']))
    db.commit()

    return 'success'

@app.route('/load_table/<table>', methods=['GET','POST'])
def load_table(table):
    db = sqlite3.connect('database.db')
    cur = db.cursor()
    cur.execute('SELECT * FROM ' +table)
    data = cur.fetchall()
    return jsonify(data)

if __name__ == '__main__':
    port = 5000 + random.randint(0, 999)
    url = "http://127.0.0.1:{}/{}".format(port, "main")

    threading.Timer(1.25, lambda: webbrowser.open(url) ).start()

    app.run(port=port, debug=False)