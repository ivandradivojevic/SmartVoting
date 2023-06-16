# SmartVoting

This repository contains a decentralized application (DApp) for a voting system built on the Ethereum blockchain. 
The DApp allows users to participate in a voting poll by casting their votes for different options.
The smart contract governs the voting process, maintains the vote counts, and displays the final results.

## Installation 


1. Ensure you have Node.js and React.js installed on your system.

2. Clone the repository
```bash
git clone git@github.com:ivandradivojevic/SmartVoting.git
```

3. Change into the project directory
```bash
cd SmartVoting
```

4. Install the required dependencies:
```bash
npm install
```

## Setting Up the Smart Contract

1. Open the Remix IDE
2. Create a new file and paste the smart contract(contracts/Poll.sol) into it
3. Deploy the contract to the desired network using Remix IDE and MetaMask.
4. Replace address of the deployed contact in App.js


## Running the Application

```bash
npm start
```

Open your browser and navigate to http://localhost:3000 to see the application in action.

## Running the Tests
To run the Hardhat test suite, execute the following command:

```bash
npx hardhat test
```

Ensure that your local Ethereum network is running or configure the network settings in the `hardhat.config.js` file.
