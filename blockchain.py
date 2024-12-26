import time
import json
from typing import List, Dict
from crypto import hash_block, verify_signature
from transaction import Transaction

class Block:
    def __init__(self, index: int, transactions: List[Transaction], 
                 timestamp: float, previous_hash: str, nonce: int = 0):
        self.index = index
        self.transactions = transactions
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_string = json.dumps({
            "index": self.index,
            "transactions": [t.to_dict() for t in self.transactions],
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hash_block(block_string)

class Blockchain:
    def __init__(self):
        self.chain: List[Block] = []
        self.difficulty = 4
        self.pending_transactions: List[Transaction] = []
        self.mining_reward = 50
        self.create_genesis_block()

    def create_genesis_block(self):
        genesis_block = Block(0, [], time.time(), "0")
        self.chain.append(genesis_block)

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_transaction(self, transaction: Transaction) -> bool:
        if not transaction.is_valid():
            return False
        self.pending_transactions.append(transaction)
        return True

    def mine_pending_transactions(self, miner_address: str):
        block = Block(len(self.chain), self.pending_transactions, 
                     time.time(), self.get_latest_block().hash)
        
        block.nonce = self.proof_of_work(block)
        
        self.chain.append(block)
        self.pending_transactions = [
            Transaction("network", miner_address, self.mining_reward)
        ]

    def proof_of_work(self, block: Block) -> int:
        block.nonce = 0
        computed_hash = block.calculate_hash()
        while not computed_hash.startswith('0' * self.difficulty):
            block.nonce += 1
            computed_hash = block.calculate_hash()
        return block.nonce

    def is_chain_valid(self) -> bool:
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            if current_block.hash != current_block.calculate_hash():
                return False

            if current_block.previous_hash != previous_block.hash:
                return False

        return True

    def get_balance(self, address: str) -> float:
        balance = 0
        for block in self.chain:
            for transaction in block.transactions:
                if transaction.sender == address:
                    balance -= transaction.amount
                if transaction.recipient == address:
                    balance += transaction.amount
        return balance
