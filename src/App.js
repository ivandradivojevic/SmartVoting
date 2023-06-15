import React, { useEffect, useState } from 'react';
import './App.css';
import contractABI from './PollABI.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';
const ethers = require("ethers");

const contractAddress = '0xb4a5a6133360dE20CBf4CdBD30518A6E6551C624';
const App = () => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [contract, setContract] = useState(null);
  const [newOption, setNewOption] = useState('');
  const [mostVotedOption, setMostVotedOption] = useState('');


  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Creating provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        // Creating contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);

        // Fetching options from the contract
        const optionsCount = await contract.getOptionsLength();
        const optionsArray = [];
        for (let i = 0; i < optionsCount; i++) {
          const option = await contract.options(i);
          optionsArray.push(option);
        }
        setOptions(optionsArray);
        
      } catch (error) {
        console.error('Error fetching options:', error);
        toastr.error('Error fetching options');
      }
    };

    fetchOptions();
  }, [options]);


  const handleVote = async () => {
    if (!selectedOption) {
      toastr.error('No option selected for voting.');
      return;
    }

    try {
      // Calling the vote function in the contract
      await contract.vote(selectedOption.id);
      toastr.success('Successfully voted for option: ' + selectedOption.name);
    } catch (error) {
      console.error('Error voting:', error);
      toastr.error('Error voting');
    }
  };

  const handleAddOption = async () => {
    if (!newOption) {
      toastr.error('Enter the name of the new option.');
      return;
    }

    try {
      // Calling the addOption function in the contract
      await contract.addOption(newOption);
      toastr.success('Successfully added new option: ' + newOption);

      // Fetching updated options from the contract
      const optionsCount = await contract.getOptionsLength();
      const optionsArray = [];
      for (let i = 0; i < optionsCount; i++) {
        const option = await contract.options(i);
        optionsArray.push(option);
      }
      setOptions(optionsArray);
      setNewOption('');
    } catch (error) {
      console.error('Error adding option:', error);
      toastr.error('Error adding option');
    }
  };

  const handleWinnerDeclared = (winnerId) => {
    const winnerOption = options.find(option => option.id === winnerId);
    setMostVotedOption(winnerOption.name);
  };

  const handleFinishVoting = async () => {
    try {
      // Calling the countVotesAndDeclareWinner function in the contract
      await contract.countVotesAndDeclareWinner();
  
      // Subscribing to the WinnerDeclared event
      contract.on('WinnerDeclared', (winningOptionId) => {
        console.log('Voting finished. Winner declared:', winningOptionId);
        handleWinnerDeclared(winningOptionId);
      });
    } catch (error) {
      console.error('Error finishing voting:', error);
      toastr.error('Error finishing voting');
    }
  };
  

  return (
    <div className="App">
      <h1>Voting Options</h1>
      <div className='row justify-content-center'>
      <table className="table w-50">
        <thead>
          <tr>
            <th>Option Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr key={option.id}>
              <td>{option.name}</td>
              <td>
                <button onClick={() => setSelectedOption(option)}>Vote</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    
      {selectedOption && (
        <div>
          <h2>Selected Voting Option:</h2>
          <p>{selectedOption.name}</p>
          <button onClick={handleVote}  className='btn btn-primary'>Vote</button>
        </div>
      )}
    
      <div className='my-3'>
        <h2>Add New Option</h2>
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Enter option name"
        />
        <button onClick={handleAddOption}   >Add Option</button>
      </div>
      
      <div>
        <button  onClick={handleFinishVoting} className='btn btn-primary'>Finish Voting</button>
      </div>
      {mostVotedOption !== '' && (
        <div className='row my-5 text-center'>
        <h1>Most voted option: {mostVotedOption}</h1>
        </div>
      )}
  </div>
  );
};

export default App;
