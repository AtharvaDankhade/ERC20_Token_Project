import Web3 from 'web3';
import ABI from './WhitelistedToken.json';

let selectedAccount;
let nftContract;
let contractAddress = "0x0651298b7679027E3AF87d7977EF992670535139";
let isInitialize = false;

export const init = async () => {
    let provider = window.ethereum;

    if(typeof provider !== 'undefined') {

      provider.request({method: 'eth_requestAccounts'}).then((accounts) => {
        selectedAccount = accounts[0];
        console.log(selectedAccount);
      }).catch((err) => {
        console.log(err);
        return;
      });
      window.ethereum.on('accountsChanged', function(accounts) {
        selectedAccount = accounts[0];
        console.log(selectedAccount);
      });
    }

    const web3 = new Web3(provider);
    nftContract = new web3.eth.Contract(ABI.abi,contractAddress);
    isInitialize = true;
};

export const mintToken = async(props) => {
    try {
        if (!isInitialize) {
            await init();
        }
        let toAddress = props;

        // Fetch the sender's address from MetaMask
        const fromAddress = await window.ethereum.request({ method: 'eth_accounts' });
        if (!fromAddress || fromAddress.length === 0) {
            console.error('No accounts found in MetaMask.');
            return;
        }

        const amount = 1;
        await nftContract.methods.mint(toAddress, amount).send({ from: fromAddress[0] });
    } catch (error) {
        console.error('Error minting token:', error);
    }
}
