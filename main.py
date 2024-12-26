from node import Node
from api import start_api
import argparse
import threading
import time

def main():
    parser = argparse.ArgumentParser(description='Quantum-resistant Blockchain Node')
    parser.add_argument('--port', type=int, default=8000, help='Port to run the P2P node on')
    parser.add_argument('--api-port', type=int, default=8080, help='Port to run the HTTP API on')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Host to run the node on')
    parser.add_argument('--peers', type=str, nargs='*', help='List of peer addresses (host:port)')
    
    args = parser.parse_args()
    
    # Initialize and start the node
    node = Node(args.host, args.port)
    node.start()
    
    # Start HTTP API in a separate thread
    api_thread = threading.Thread(target=start_api, args=(node, args.api_port))
    api_thread.daemon = True
    api_thread.start()
    
    # Connect to peers if specified
    if args.peers:
        for peer in args.peers:
            host, port = peer.split(':')
            node.add_peer(host, int(port))
    
    print(f"Node wallet address: {node.wallet.address}")
    
    while True:
        try:
            print("\n1. Create transaction")
            print("2. Mine block")
            print("3. Show balance")
            print("4. Add peer")
            print("5. Exit")
            
            choice = input("Enter your choice: ")
            
            if choice == "1":
                recipient = input("Enter recipient address: ")
                amount = float(input("Enter amount: "))
                if node.create_transaction(recipient, amount):
                    print("Transaction created successfully")
                else:
                    print("Failed to create transaction")
                    
            elif choice == "2":
                print("Mining block...")
                node.mine_block()
                print("Block mined successfully")
                
            elif choice == "3":
                balance = node.get_balance()
                print(f"Current balance: {balance}")
                
            elif choice == "4":
                peer_host = input("Enter peer host: ")
                peer_port = int(input("Enter peer port: "))
                node.add_peer(peer_host, peer_port)
                print("Peer added successfully")
                
            elif choice == "5":
                print("Shutting down node...")
                node.stop()
                break
                
        except Exception as e:
            print(f"Error: {e}")
            continue

if __name__ == "__main__":
    main()
