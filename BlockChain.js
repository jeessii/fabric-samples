const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, data, prevHash = '')  {
      this.index = index;
      this.date = new Date().toString();
      this.data = data;
      this.prevHash = prevHash;
      this.hash = this.createHash();
      this.nonce = 0;
  }

  createHash() {
      return SHA256(this.index + this.date + this.data + this.prevHash + this.nonce).toString();
  }

  mine(difficulty) {
    while(!this.hash.startsWith(difficulty)) {
      this.nonce++;
      this.hash = this.createHash();
    }
  }
       
}

class BlockChain {
  constructor(genesis,difficulty = '00') {
    this.chain = [this.createFirstBlock(genesis)];
    this.difficulty = difficulty;
  }

  createFirstBlock(genesis) {
    return new Block(0,genesis);
  }

  getLastBlock() {
    return this.chain[this.chain.length-1];
  }

  addBlock(data) {
    let prevBlock = this.getLastBlock();
    let block = new Block(prevBlock.index+1,data,prevBlock.hash);
    block.mine(this.difficulty);
    this.chain.push(block);
  }

  isValid() {
    
    for(let i=1; i < this.chain.length; i++) {
      let prevBlock = this.chain[i-1];
      let currBlock = this.chain[i];

      if (currBlock.prevHash != prevBlock.hash)
        return false;

      if (currBlock.createHash() != currBlock.hash)
        return false;
     
    }

    
    return true;
  }
}



