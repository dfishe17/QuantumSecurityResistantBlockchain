import socket
import json
import threading
from typing import List, Dict
from blockchain import Blockchain, Block
from transaction import Transaction

class P2PNetwork:
    def __init__(self, host: str = '0.0.0.0', port: int = 8000):
        self.host = host
        self.port = port
        self.peers: List[tuple] = []
        self.blockchain: Blockchain | None = None
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    def start(self, blockchain: Blockchain):
        """
        Start the network and begin listening for connections
        """
        self.blockchain = blockchain
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.socket.bind((self.host, self.port))
            self.socket.listen(5)
            
            # Start listening for connections
            self.listener_thread = threading.Thread(target=self.listen_for_connections)
            self.listener_thread.daemon = True  # Make thread daemon so it exits when main thread exits
            self.listener_thread.start()
        except Exception as e:
            self.stop()
            raise Exception(f"Failed to start network: {str(e)}")

    def listen_for_connections(self):
        while True:
            client, address = self.socket.accept()
            client_thread = threading.Thread(
                target=self.handle_client,
                args=(client, address)
            )
            client_thread.start()

    def handle_client(self, client: socket.socket, address: tuple):
        while True:
            try:
                message = client.recv(4096)
                if not message:
                    break
                try:
                    data = json.loads(message.decode())
                    self.process_message(data, client)
                except json.JSONDecodeError:
                    # Ignore invalid JSON messages
                    continue
            except Exception as e:
                print(f"Error handling client {address}: {e}")
                break
        client.close()

    def process_message(self, data: Dict, client: socket.socket):
        if not self.blockchain:
            return
            
        message_type = data.get('type')
        
        if message_type == 'new_block':
            block_data = data.get('data')
            # Validate and add new block
            # Implementation details here
            
        elif message_type == 'new_transaction':
            transaction_data = data.get('data')
            # Validate and add new transaction
            # Implementation details here
            
        elif message_type == 'get_chain':
            # Send entire blockchain
            response = {
                'type': 'chain',
                'data': [block.__dict__ for block in self.blockchain.chain]
            }
            client.send(json.dumps(response).encode())

    def broadcast_transaction(self, transaction: Transaction):
        message = {
            'type': 'new_transaction',
            'data': transaction.to_dict()
        }
        self.broadcast_message(message)

    def broadcast_block(self, block: Block):
        message = {
            'type': 'new_block',
            'data': block.__dict__
        }
        self.broadcast_message(message)

    def broadcast_message(self, message: Dict):
        for peer in self.peers:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.connect(peer)
                    s.send(json.dumps(message).encode())
            except Exception as e:
                print(f"Error broadcasting to peer {peer}: {e}")
                self.peers.remove(peer)

    def add_peer(self, host: str, port: int):
        peer = (host, port)
        if peer not in self.peers:
            self.peers.append(peer)

    def stop(self):
        """
        Stop the network and clean up resources
        """
        if hasattr(self, 'socket'):
            try:
                self.socket.shutdown(socket.SHUT_RDWR)
            except:
                pass
            finally:
                try:
                    self.socket.close()
                except:
                    pass
