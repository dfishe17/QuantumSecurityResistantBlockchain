from blockchain import Blockchain
from network import P2PNetwork
from mining import QuantumProofOfWork
from wallet import Wallet

class Node:
    def __init__(self, host: str = '0.0.0.0', port: int = 8000):
        self.blockchain = Blockchain()
        self.network = P2PNetwork(host, port)
        self.wallet = Wallet()
        self.pow = QuantumProofOfWork()
        
    def start(self):
        """
        Start the node and begin listening for connections
        """
        try:
            self.network.start(self.blockchain)
            print(f"Node started on {self.network.host}:{self.network.port}")
        except Exception as e:
            self.stop()
            raise e

    def stop(self):
        """
        Stop the node and cleanup resources
        """
        self.network.stop()
        
    def create_transaction(self, recipient: str, amount: float):
        """
        Create and broadcast a new transaction
        """
        transaction = self.wallet.create_transaction(recipient, amount)
        if self.blockchain.add_transaction(transaction):
            self.network.broadcast_transaction(transaction)
            return True
        return False
        
    def mine_block(self):
        """
        Mine a new block with pending transactions
        """
        self.blockchain.mine_pending_transactions(self.wallet.address)
        latest_block = self.blockchain.get_latest_block()
        self.network.broadcast_block(latest_block)
        
    def get_balance(self):
        """
        Get the balance of the node's wallet
        """
        return self.blockchain.get_balance(self.wallet.address)
        
    def add_peer(self, host: str, port: int):
        """
        Add a new peer to the network
        """
        self.network.add_peer(host, port)
