const axios = require('axios');

const ETHEREUM_RPC_URL = 'https://goerli.infura.io/v3/fc53e1fe9181421188a85a7df27f9431'; // Replace with your Infura project ID

async function fetchLatestBlockNumber() {
    try {
        const response = await axios.post(ETHEREUM_RPC_URL, {
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
        });
        return parseInt(response.data.result, 16);
    } catch (error) {
        console.error('Error fetching block number:', error);
        throw error;
    }
}

module.exports = {
    fetchLatestBlockNumber,
};
