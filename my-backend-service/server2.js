const express = require('express');
const { ethers } = require('ethers');

const app = express();
const port = 8000;

// Connect to Ethereum using Infura (replace YOUR_INFURA_API_KEY with your actual API key)
const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/fc53e1fe9181421188a85a7df27f9431');

const contractAddress = '0x9Ac25b614e1F5ff57ed4c3548738398fd52CaDFa';
const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "distributeMintedTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "_tokenIds",
				"type": "uint256[]"
			}
		],
		"name": "distributeToWhitelist",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "flipSaleState",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_numTokens",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "unwhitelistAccount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "whitelistAccount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "_mintedTokenIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "baseExtension",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "baseUri",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWhitelistedAccounts",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isSaleActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_MINT_PER_TX",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_TOKENS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "price",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contract = new ethers.Contract(contractAddress, abi, provider);
app.use(express.json());

// API endpoints
app.post('/mint', async (req, res) => {
	const senderAddress = req.headers.senderaddress || req.body.senderAddress;

    if (!senderAddress) {
        return res.status(400).json({ error: 'Sender address not provided' });
    }
    const { numTokens } = req.body;
    try {
		const fetchedOwnerAddress = await fetchOwnerAddress();
        
        if (senderAddress.toLowerCase() !== fetchedOwnerAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const privateKey = '';
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractWithSigner = contract.connect(wallet);

        const tx = await contractWithSigner.mint(numTokens, { from: senderAddress });

        const receipt = await tx.wait();

        res.json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mint tokens', details: error.message });
    }
});

// Distribute to Whitelist function
app.post('/distributeToWhitelist', async (req, res) => {
    const { tokenIds } = req.body;
	const senderAddress = req.headers.senderaddress || req.body.senderAddress;

    if (!senderAddress) {
        return res.status(400).json({ error: 'Sender address not provided' });
    }
    try {
		const fetchedOwnerAddress = await fetchOwnerAddress();
        
        if (senderAddress.toLowerCase() !== fetchedOwnerAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const privateKey = '';
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractWithSigner = contract.connect(wallet);

        const tx = await contractWithSigner.distributeToWhitelist(tokenIds, { from: senderAddress });

        const receipt = await tx.wait();

        res.json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: 'Failed to distribute to whitelist', details: error.message });
    }
});

// Distribute Minted Tokens function
app.post('/distributeMintedTokens', async (req, res) => {
	const senderAddress = req.headers.senderaddress || req.body.senderAddress;

    if (!senderAddress) {
        return res.status(400).json({ error: 'Sender address not provided' });
    }
    try {
		const fetchedOwnerAddress = await fetchOwnerAddress();
        
        if (senderAddress.toLowerCase() !== fetchedOwnerAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const privateKey = '';
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractWithSigner = contract.connect(wallet);

        const tx = await contractWithSigner.distributeMintedTokens({ from: senderAddress });

        const receipt = await tx.wait();
        res.json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: 'Failed to distribute minted tokens', details: error.message });
    }
});

// Whitelist Account function
app.post('/whitelistAccount', async (req, res) => {
    const { account } = req.body;
	const senderAddress = req.headers.senderaddress || req.body.senderAddress;

    if (!senderAddress) {
        return res.status(400).json({ error: 'Sender address not provided' });
    }
    try {
		const fetchedOwnerAddress = await fetchOwnerAddress();
        
        if (senderAddress.toLowerCase() !== fetchedOwnerAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
		const privateKey = '';
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractWithSigner = contract.connect(wallet);

        const tx = await contractWithSigner.whitelistAccount(account, { from: senderAddress });

        const receipt = await tx.wait();
        res.json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: 'Failed to whitelist account', details: error.message });
    }
});

// Unwhitelist Account function
app.post('/unwhitelistAccount', async (req, res) => {
    const { account } = req.body;
	const senderAddress = req.headers.senderaddress || req.body.senderAddress;

    if (!senderAddress) {
        return res.status(400).json({ error: 'Sender address not provided' });
    }
    try {
		const fetchedOwnerAddress = await fetchOwnerAddress();
        
        if (senderAddress.toLowerCase() !== fetchedOwnerAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const privateKey = '';
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractWithSigner = contract.connect(wallet);

        const tx = await contractWithSigner.unwhitelistAccount(account, { from: senderAddress });

        const receipt = await tx.wait();
        res.json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unwhitelist account', details: error.message });
    }
});

// Get Whitelisted Accounts function
app.get('/getWhitelistedAccounts', async (req, res) => {
    try {
        const whitelistedAccounts = await contract.getWhitelistedAccounts();
        res.json({ whitelistedAccounts });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get whitelisted accounts', details: error.message });
    }
});

// Lock Transfer function
app.post('/lockTransfer', async (req, res) => {
	const senderAddress = req.headers.senderaddress || req.body.senderAddress;

    if (!senderAddress) {
        return res.status(400).json({ error: 'Sender address not provided' });
    }
    try {
		const fetchedOwnerAddress = await fetchOwnerAddress();
        
        if (senderAddress.toLowerCase() !== fetchedOwnerAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const privateKey = '';
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractWithSigner = contract.connect(wallet);

        const tx = await contractWithSigner.lockTransfer({ from: senderAddress });

        const receipt = await tx.wait();
        res.json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: 'Failed to lock transfer', details: error.message });
    }
});

// Unlock Transfer function
app.post('/unlockTransfer', async (req, res) => {
	const senderAddress = req.headers.senderaddress || req.body.senderAddress;

    if (!senderAddress) {
        return res.status(400).json({ error: 'Sender address not provided' });
    }
    try {
		const fetchedOwnerAddress = await fetchOwnerAddress();
        
        if (senderAddress.toLowerCase() !== fetchedOwnerAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const privateKey = '';
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractWithSigner = contract.connect(wallet);

        const tx = await contractWithSigner.unlockTransfer({ from: senderAddress });

        const receipt = await tx.wait();
        res.json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unlock transfer', details: error.message });
    }
});

async function fetchOwnerAddress() {
    try {
        const fetchedOwnerAddress = await contract.owner();
        return fetchedOwnerAddress;
    } catch (error) {
        console.error("Failed to fetch owner address:", error.message);
        throw new Error("Failed to fetch owner address");
    }
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});