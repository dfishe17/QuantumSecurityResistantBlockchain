from flask import Flask, jsonify, request
from node import Node
from typing import Optional

app = Flask(__name__)
node: Optional[Node] = None

@app.route('/chain', methods=['GET'])
def get_chain():
    global node
    if not node:
        return jsonify({'error': 'Node not initialized'}), 500
    chain = [vars(block) for block in node.blockchain.chain]
    return jsonify({
        'chain': chain,
        'length': len(chain)
    })

@app.route('/transaction/new', methods=['POST'])
def new_transaction():
    global node
    if not node:
        return jsonify({'error': 'Node not initialized'}), 500
        
    values = request.get_json()
    if not values:
        return jsonify({'error': 'No data provided'}), 400
        
    required = ['recipient', 'amount']
    if not all(k in values for k in required):
        return jsonify({'error': 'Missing required fields'}), 400
        
    try:
        success = node.create_transaction(values['recipient'], float(values['amount']))
        if success:
            return jsonify({'message': 'Transaction added successfully'}), 201
        return jsonify({'error': 'Failed to add transaction'}), 400
    except ValueError as e:
        return jsonify({'error': 'Invalid amount format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/mine', methods=['GET'])
def mine():
    global node
    if not node:
        return jsonify({'error': 'Node not initialized'}), 500
    try:
        node.mine_block()
        return jsonify({'message': 'New block mined successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/peers', methods=['GET'])
def get_peers():
    global node
    if not node:
        return jsonify({'error': 'Node not initialized'}), 500
    try:
        peers = [f"{host}:{port}" for host, port in node.network.peers]
        return jsonify({'peers': peers}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def start_api(node_instance: Node, port: int):
    """Start the API server with the given node instance"""
    global node
    if not node_instance:
        raise ValueError("Node instance cannot be None")
    node = node_instance
    app.run(host='0.0.0.0', port=port, threaded=True)
