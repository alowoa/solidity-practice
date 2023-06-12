// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.20 <0.9.0;

struct Etudiant {
    string nom;
    uint note;
}

enum Classe { no6, no5, no4 }   

contract EtudiantStorage {

    Classe public classe; 

    mapping (address => Etudiant) public etudiantsMap;
    Etudiant[] public etudiantsArray;

    function getEtudiant(string name) {
        abi.encodePacked(name);
        for (uint i = 0; i < etudiantsArray.length; i++) {
            if (keccak256(etudiantsArray[i].name) == )
        }
    }
 
    function setClasse(Classe _classe) external {
        classe = _classe;
    }

    function deleteEtudiant(address _etudiant) external {
        for (uint i = 0; i < etudiantsArray.length; i++) {
            if ()
        } 
        etudiantsMap[_etudiant].nom = "";
        etudiantsMap[_etudiant].note = 0;
    }
    
    function deleteEtudiant(address _etudiant) external {
        etudiant[_etudiant].nom = "";
        etudiant[_etudiant].note = 0;
    }
    
}
