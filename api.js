const axios = require('axios');

const ETHEREUM_RPC_URL = ''; // Replace with your Infura project ID

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
