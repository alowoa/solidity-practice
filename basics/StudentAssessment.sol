// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/*
Gere un systeme de notation d'une classe d'etudiants avec:
- addNote
- getNote
- setNote.
Un elete defini par la structure de donne fourni Student.
Les professeurs adequates (entre en dur) peuvent rajouter des notes.
Chaque eleve est stocke de maniere pertinencet.
On doit pouvoir recuperer :
- la moyenne generale d'une eleve
- la moyenne de la classe sur une matiere
- la moyenne generale de la classe au global
On doit avoir un getter pour savoir si l'eleve valide ou non son annee.

*/

import "@openzeppelin/contracts/access/Ownable.sol";

struct Student {
    string name;
    string noteBiology;
    string noteMath;
    string noteFr;
}

enum Subject {
    BIOLOGY, MATH, FRENCH
}
enum AssessmentState {
    STARTED, ENDED
}

contract StudentAssessment is Ownable {

    mapping (address => bool) professors;
    mapping (string => Student) students;

    mapping (Subject => uint) subjectNoteCount;

    AssessmentState state;

    constructor(address profA, address profB, address profC) Ownable() {
        professors[profA] = true;
        professors[profB] = true;
        professors[profC] = true;
    }

    modifier isProfessor() {
        if (!professors[msg.sender]) { revert("Access Denied!"); }
        _;
    }

    modifier isScholarMember() {
        //TODO check prof or student
        _;
    }
    modifier isOngoingAssessment() {
        if (state != AssessmentState.STARTED) { revert("Assessment fisnished!"); }
        _;
    }

    function endAssessmentPhase() external isProfessor {
        state = AssessmentState.ENDED;
    }

    function addNote(Subject _subject, uint note, string memory _student) external isProfessor isOngoingAssessment() {
 
    }

    function setNote(string memory _eleveName, uint _note) external isProfessor isOngoingAssessment() {

    }
   
    function getNote(string memory _eleveName) external view isScholarMember returns(uint) {

    }

    function hasDegree(string memory _studentName) external view returns(bool) {

    }
}