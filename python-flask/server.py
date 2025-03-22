from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import random
import time
import threading
import requests
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_alllowed_origins="*")

clients = {}

mock_data = {
    'columns': [
        {'name': 'Category', 'values': ['Category 1', 'Category 2', 'Category 1', 'Category 1', 'Category 2', 'Category 3']},
        {'name': 'Item', 'values': ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']},
        {'name': 'Price', 'values': [12.23, 9.99, 402, 223.29, 55.2, 16.3]},
        {'name': 'Sold', 'values': [104, 42, 532, 77, 253, 22]},
        {'name': 'Remaining', 'values': [40, 152, 55, 222, 662, 24]},
        {'name': '% Sold', 'values': [72.22, 0.22, 0.91, 0.39, 0.28, 0.48]},
    ]
}

# Transpose columns to rows
def cols_to_rows(data):
    rows_count = len(data['columns'][0]['values'])
    row_data = []
    for i in range(0, rows_count):
        row = {}
        for c in data['columns']:
            col_nae = c['name']
            row[col_name] = c['value'][i]
        row_data.append(row)
    return row_data 

def update_data():
    data = cols_to_rows(mock_data)
    while True:
        time.sleep(2) # Update every 2 seconds
        for client_id, client_details in clients.items():
            if client_details is None:
                continue
            category = client_details['category']
            emit_data = []
            
            # Simulate changes
            for row in [r for r in data if r['Category'] == category]:
                row['Price'] = row['Price'] + round(random.uniform(0, 5), 2)
                row['Sold'] = row['Sold'] + randint(-100, 100)
                row['Remaining'] = row['Remaining'] + randint(-100, 100)
                row['% Sold'] = row['% Sold'] + randint(-100, 100)
                emit_data.append(row)
            
            # Emit
            socket.io.emit(f'category_update_{category}', emit_data, namespace='/update', to=client_id)

thread = threading.Thread(target=update_data)
thread.daemon = True
thread.start()

@app.route('/')
def index():
    return render_template('index.html', categories=['Category 1', 'Category 2', 'Category 3'])

@socketio.on('connect', namespace='/update')
def handle_connect():
    clients[request.sid] = None
    print(f'Client {request.sid} connected')

@socketio.on('disconnect', namespace='/update')
def handle_disconnect():
    clients.pop(request.sid, None)
    print(f'Client {request.sid} disconnected')

@socketio.on('subscribe', namespace='/update')
def handle_subscribe():
    category = data['category']
    clients[request.sid] = {'category': category}
    emit(f'category_update_{category}', [])
    print(f'Client {request.sid} subscribed to {category}')

@socketio.on('unsubscribe', namespace='/update')
def handle_insubscribe():
    category = data['category']
    clients[request.sid] = None
    print(f'Client {request.sid} unsubscribed from {category}')

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
