const { Web3 } = require("web3");
const alchemy_app_api_key =
  "https://eth-mainnet.g.alchemy.com/v2/C7pwvMZ_EZIdHJJIWjy4OT4uja9LoVeJ";
const private_key =
  "0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709";

/* 
check online transaction, balance
https://goerli.etherscan.io/
*/

/**
 * web3 service
 */
module.exports = class Web3Service {
  web3;
  constructor() {
    this.web3 = new Web3(alchemy_app_api_key);
    // this.web3 = new Web3(getBlockIO);
  }
  createWallet() {
    const wallet = this.web3.eth.accounts.wallet.create(1)[0];
    // console.log(wallet);
    return wallet;
  }

  async sendTransaction(privateKey, to_address, amount) {
    try {
      const account = await this.web3.eth.accounts.privateKeyToAccount(
        privateKey
      );
      const nonce = await this.web3.eth.getTransactionCount(account.address); // get the current nonce.
      const amountWei = this.web3.utils.toWei(amount.toString(), "ether");

      const txObject = {
        nonce: nonce,
        to: to_address,
        value: amountWei,
        gasLimit: this.web3.utils.toHex(21000), // Gas limit
        gasPrice: this.web3.utils.toHex(await this.web3.eth.getGasPrice()), // Gas price
      };

      const signedTx = await this.web3.eth.accounts.signTransaction(
        txObject,
        privateKey
      );
      const txReceipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      return txReceipt;
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async getBalance(PK) {
    const account = await this.web3.eth.accounts.privateKeyToAccount(PK);
    let balance = await this.web3.eth.getBalance(account.address);
    balance = this.web3.utils.fromWei(balance, "ether");

    return balance;
  }

  async userSign(message, PK) {
    const signature = await this.web3.eth.accounts.sign(message, PK);
    return signature;
  }
};
