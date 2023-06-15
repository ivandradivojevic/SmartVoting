// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Poll {
    // Deployed at 0xd9145CCE52D386f254917e481eB44e9943F39138
    struct Option {
        uint id;
        string name;
    }
    
    Option[] public options;
    mapping(uint => uint) public votes;
    mapping(address => bool) public voters;
    
    event OptionAdded(uint optionId);
    event Vote(uint indexed optionId);
    event WinnerDeclared(uint optionId);

    function getOptionsLength() public view returns (uint) {
        return options.length;
    }

    function addOption(string memory _name) public {
        uint optionId = options.length;
        options.push(Option(optionId, _name));
        votes[optionId] = 0;
        emit OptionAdded(optionId);
    }
    
    function vote(uint _optionId) public {
        require(!voters[msg.sender], "Address has already voted.");
        require(_optionId < options.length, "Invalid option.");
        
        voters[msg.sender] = true;
        votes[_optionId]++;
        
        emit Vote(_optionId);
    }
    
    function countVotesAndDeclareWinner() public {
        uint winningOptionId = 0;
        uint maxVotes = 0;
        
        for (uint i = 0; i < options.length; i++) {
            if (votes[i] > maxVotes) {
                maxVotes = votes[i];
                winningOptionId = i;
            }
        }
        emit WinnerDeclared(winningOptionId);
    
    }
}