import './App.css';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import ABI from './WhitelistedToken.json';
import { init, mintToken } from './WebClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container,Form, Button, Alert, Navbar, Nav, Table} from 'react-bootstrap';


function App() {
  let contractAddress = "CONTRACT_ADDRESS";
  const [minted, setMinted] = useState(false);
  const [isAccountConnected, setIsAccountConnected] = useState(false);
  const [inputValue, setInput1Value] = useState('');
  const [web3, setWeb3] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [whitelistedAccounts, setWhitelistedAccounts] = useState([]);
  const [amountToMint, setAmountToMint] = useState(0);
  const [toWhitelistAddress, setToWhitelistAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferToAddress, setTransferToAddress] = useState('');

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accs = await web3Instance.eth.getAccounts();
          setAccounts(accs);
          setIsAccountConnected(true);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('No Ethereum provider detected. Install MetaMask.');
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const initContract = async () => {
      try {
        // Get the contract instance
        const contractInstance = new web3.eth.Contract(
          ABI.abi, contractAddress
        );

        setContract(contractInstance);

        // Fetch and set whitelisted accounts
        const whitelisted = await contractInstance.methods.getWhitelistedAccounts().call();
        setWhitelistedAccounts(whitelisted);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    if (web3) {
      initContract();
    }
  }, [web3]);

  useEffect(() => {
    if (alertMessage) {
      const timeoutId = setTimeout(() => {
        setAlertMessage(null);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [alertMessage]);

  const showAlert = (message) => {
    setAlertMessage(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mintToken(inputValue).then((tx) => {
      console.log(tx);
      setMinted(true);
    }).catch((err) => {
      console.log(err);
    });
  };

  const handleUnwhitelist = async (addressToRemove) => {
    try {
      const isOwner = await contract.methods.owner().call();
      if (accounts[0] !== isOwner) {
        showAlert('You are not the owner. Only the owner can remove accounts from the whitelist.');
        return;
      }
  
      await contract.methods.unwhitelistAccount(addressToRemove).send({ from: accounts[0] });
  
      // Update the whitelisted accounts after removal
      const updatedWhitelisted = await contract.methods.getWhitelistedAccounts().call();
      setWhitelistedAccounts(updatedWhitelisted);
    } catch (error) {
      console.error('Error removing account from whitelist:', error);
    }
  };
  

  const distributeTokens = async () => {
    try {
      const isOwner = await contract.methods.owner().call();
      if (accounts[0] !== isOwner) {
        showAlert('You are not the owner. Only the owner can distribute tokens.');
        return;
      }
      await contract.methods.distributeToWhitelist(amountToMint).send({ from: accounts[0] });

      // Update the whitelisted accounts after distribution
      const updatedWhitelisted = await contract.methods.getWhitelistedAccounts().call();
      setWhitelistedAccounts(updatedWhitelisted);
    } catch (error) {
      console.error('Error distributing tokens:', error);
    }
  };

  const whitelistAccount = async () => {
    try {
      const isOwner = await contract.methods.owner().call();
      if (accounts[0] !== isOwner) {
        showAlert('You are not the owner. Only the owner can whitelist account.');
        return;
      }

      await contract.methods.whitelistAccount(toWhitelistAddress).send({ from: accounts[0] });

      // Update the whitelisted accounts after whitelisting
      const updatedWhitelisted = await contract.methods.getWhitelistedAccounts().call();
      setWhitelistedAccounts(updatedWhitelisted);
    } catch (error) {
      console.error('Error whitelisting account:', error);
    }
  };

  const unwhitelistAccount = async () => {
    try {
      const isOwner = await contract.methods.owner().call();
      if (accounts[0] !== isOwner) {
        showAlert('You are not the owner. Only the owner can unwhitlist account.');
        return;
      }
      await contract.methods.unwhitelistAccount(toWhitelistAddress).send({ from: accounts[0] });

      // Update the whitelisted accounts after unwhitelisting
      const updatedWhitelisted = await contract.methods.getWhitelistedAccounts().call();
      setWhitelistedAccounts(updatedWhitelisted);
    } catch (error) {
      console.error('Error unwhitelisting account:', error);
    }
  };

  const transferTokens = async () => {
    try {
      await contract.methods.transfer(transferToAddress, transferAmount).send({ from: accounts[0] });
    } catch (error) {
      console.error('Error transferring tokens:', error);
    }
  };

  const lockTransfer = async () => {
    try {
      const isOwner = await contract.methods.owner().call();
      if (accounts[0] !== isOwner) {
        showAlert('You are not the owner. Only the owner can lock transfer.');
        return;
      }
      await contract.methods.lockTransfer().send({ from: accounts[0] });
    } catch (error) {
      alert('Error locking token transfer:', error);
    }
  };

  const unlockTransfer = async () => {
    try {
      const isOwner = await contract.methods.owner().call();
      if (accounts[0] !== isOwner) {
        showAlert('You are not the owner. Only the owner can unlock transfer.');
        return;
      }
      await contract.methods.unlockTransfer().send({ from: accounts[0] });
    } catch (error) {
      console.error('Error unlocking token transfer:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Navbar.Brand href="#">Whitelisted Token DApp</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className={isAccountConnected ? 'text-success' : ''}>
            Connected Account: {accounts[0]}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
      <div className="mb-4">
        <h2>Whitelisted Accounts</h2>
        <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>#</th>
        <th>Account Address</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {whitelistedAccounts.map((account, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{account}</td>
          <td>
            <Button variant="danger" size="sm" onClick={() => handleUnwhitelist(account)}>
              Remove
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
      </div>

      {/* Mint Token Section */}
      <h2>Mint Token for Accounts</h2>
      <Form className="mb-4">
        <Form.Group controlId="address">
          <Form.Control
            type="text"
            placeholder="Enter address"
            onChange={(e) => setInput1Value(e.target.value)}
          />
        </Form.Group>
        {!minted ? (
          <Button onClick={(e) => handleSubmit(e)} variant="primary">
            Mint token
          </Button>
        ) : (
          <Alert variant="success" className="mt-2">
            Token minted successfully!
          </Alert>
        )}
      </Form>

      {/* Alert Message */}
      {alertMessage && (
        <Alert variant="danger" className="mb-4">
          {alertMessage}
        </Alert>
      )}

      {/* Distribute Tokens Section */}
      <div className="mb-4">
        <h2>Distribute Tokens to Whitelist</h2>
        <Form>
          <Form.Group controlId="amountToMint">
            <Form.Label>Amount to Distribute:</Form.Label>
            <Form.Control
              type="number"
              value={amountToMint}
              onChange={(e) => setAmountToMint(e.target.value)}
            />
          </Form.Group>
          <Button onClick={distributeTokens} variant="primary">
            Distribute Tokens
          </Button>
        </Form>
      </div>

      {/* Whitelist Account Section */}
      <div className="mb-4">
        <h2>Whitelist Account</h2>
        <Form>
          <Form.Group controlId="toWhitelistAddress">
            <Form.Label>Address to Whitelist:</Form.Label>
            <Form.Control
              type="text"
              value={toWhitelistAddress}
              onChange={(e) => setToWhitelistAddress(e.target.value)}
            />
          </Form.Group>
          <Button onClick={whitelistAccount} variant="primary">
            Whitelist Account
          </Button>
        </Form>
      </div>

      {/* Unwhitelist Account Section */}
      <div className="mb-4">
        <h2>Unwhitelist Account</h2>
        <Form>
          <Form.Group controlId="toUnwhitelistAddress">
            <Form.Label>Address to Unwhitelist:</Form.Label>
            <Form.Control
              type="text"
              value={toWhitelistAddress}
              onChange={(e) => setToWhitelistAddress(e.target.value)}
            />
          </Form.Group>
          <Button onClick={unwhitelistAccount} variant="primary">
            Unwhitelist Account
          </Button>
        </Form>
      </div>

      {/* Transfer Tokens Section */}
      <div className="mb-4">
        <h2>Transfer Tokens</h2>
        <Form>
          <Form.Group controlId="transferToAddress">
            <Form.Label>To Address:</Form.Label>
            <Form.Control
              type="text"
              value={transferToAddress}
              onChange={(e) => setTransferToAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="transferAmount">
            <Form.Label>Amount to Transfer:</Form.Label>
            <Form.Control
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </Form.Group>
          <Button onClick={transferTokens} variant="primary">
            Transfer Tokens
          </Button>
        </Form>
      </div>

      {/* Lock/Unlock Token Transfer Section */}
      <div className="mb-4">
        <h2>Lock/Unlock Token Transfer</h2>
        <Button onClick={lockTransfer} variant="primary">
          Lock Transfer
        </Button>
        <Button onClick={unlockTransfer} variant="primary" className="ml-2">
          Unlock Transfer
        </Button>
      </div>
    </Container>
  );
}

export default App;
