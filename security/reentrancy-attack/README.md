# Reentrancy attack test project

More details at https://consensys.github.io/smart-contract-best-practices/attacks/

This project demonstrates:

- a contract v1 with the vulnerability.
- a contract to realize the exploit
- contract(s) v1.X with a vulnerability fix

## Step to realize the attack

Requirements:
- Vault with ethers 
- Attacker contract
- User 1
- User 2 as Attacker

Scenario:
- Create a vault 
<<<<<<< HEAD
<<<<<<< HEAD
- User A store some ether
- Attacker deploy a contract to interact with Vault
- (Attacker could have seen a big storage stransfer or lookup through the contract logs)
- Attacker a little bit of ether
- Attacker start his attack with a first redeem call in order to start the redeem "loop" 


## Start the test

From a secondary terminal start the test node:

```shell
npx hardhat node
```

Then start the test

```shell
npx hardhat test
```

Usable on remix.
=======
- User A store some 10 ether
=======
- User A store some ether
>>>>>>> ba9c184 (reentrancy exercice with unit testing & tested on remix)
- Attacker deploy a contract to interact with Vault
- (Attacker could have seen a big storage stransfer or lookup through the contract logs)
- Attacker a little bit of ether
- Attacker start his attack with a first redeem call in order to start the redeem "loop" 


## Start the test

From a secondary terminal start the test node:

```shell
npx hardhat node
```
<<<<<<< HEAD
>>>>>>> dc24363 (rentrancy exercice)
=======

Then start the test

```shell
npx hardhat test
```

Usable on remix.
>>>>>>> ba9c184 (reentrancy exercice with unit testing & tested on remix)
