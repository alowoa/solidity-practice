// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/*
Exercice 1:
Faire un "deviner c'est gagné!"
Un administrateur va placer un mot, et un indice sur le mot Les joueurs vont tenter de découvrir ce mot en faisant un essai
Le jeu doit donc
1) instancier un owner
2) permettre a l'owner de mettre un mot et un indice
3) les autres joueurs vont avoir un getter sur l'indice
4) ils peuvent proposer un mot, qui sera compare au mot
reference, return un boolean
5) les joueurs seront inscrit dans un mapping qui permet de savoir si il a déjà joué
6) avoir un getter, qui donne si il existe le gagnant.
7) facultatif (nécessite un array): faire un reset du jeu pour relancer une instance
*/

enum GameState { INIT, STARTED, ENDED }

/*
Le reset du point 7: geré via un game number (index).
Le +: 
- historique des ganants 
- 2 tentatives necessaires avant indice
*/
contract GuessWord is Ownable {

    event GuessSuccess(string word);
    event GuessFailure();

    bytes32 private wordHash;
    string private hint;
    GameState private gameState;
    mapping (uint => mapping (address => uint)) private gamePlayerAttempts;
    mapping (uint => address) private gameWinners;
    uint private gameNumber; 
    
    modifier gameRunning() {
        if (GameState.STARTED != gameState) { revert("Game is not started!"); }
        _;
    }

     /*
    USERS
    */

    function getHint() external view gameRunning returns(string memory)  {
        if (gamePlayerAttempts[gameNumber][msg.sender] > 1) { revert("Aller au moins 2 tentatives et vous aurez le droit un petit indice :p");}
        return hint;
    }

    function guess(string memory _word) external gameRunning returns(bool) {
        gamePlayerAttempts[gameNumber][msg.sender]++;
        if (keccak256(abi.encodePacked(_word)) == wordHash) {
            gameState = GameState.ENDED;
            gameWinners[gameNumber] = msg.sender; 
            return true;
        } else {  
            return false;
        }
    }

    function getWinner() external view returns(address) {
        if (GameState.ENDED != gameState) { 
            revert("Game is not finished!"); 
        }
        return gameWinners[gameNumber];
    }

    function getGameNumber() external view returns(uint) {
        return gameNumber;
    }

    function getWinnerOfGame(uint _gameNumber) external view returns(address) {
        if (_gameNumber > gameNumber) { revert("Game number does not exists yet!"); }
        if (_gameNumber == gameNumber && gameState != GameState.ENDED) { revert("Game is not finished yet!"); }
        return gameWinners[_gameNumber];
    }

    /*
    OWNER ONLY
    */

    function reset() external onlyOwner {
        if (gameState == GameState.INIT) {
            revert("The game must have been initialized in order to reset it again!"); 
        }
        wordHash = 0;
        hint = "";
        gameNumber++;
        gameState = GameState.INIT;
    }

    function setWord(string memory _word, string memory _hint) external onlyOwner {
        if (GameState.INIT != gameState) { 
            revert("Game initialization already done!"); 
        }
        if (bytes(_word).length == 0 || bytes(_hint).length == 0) { 
            revert("Game can't be started without a word and an hint!"); 
        }
        wordHash = keccak256(abi.encodePacked(_word));
        hint = _hint;
        gameState = GameState.STARTED;
    }
     

}