import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ root_setValueState, root_setGreetState }) {
  const { state: { contract, accounts } } = useEth();
  const [valueState, setValueState] = useState("");
  const [greetState, setGreetState] = useState("");

  const handleValueInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      root_setValueState(e.target.value);
    }
  };

  const handleGreetInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      root_setGreetState(e.target.value);
    }
  };

  const read = async () => {
    const value = await contract.methods.read().call({ from: accounts[0] });
    console.log("read()=");
    console.log(value);
    setValueState(value);
  };

  const write = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (valueState === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newValue = parseInt(valueState);
    await contract.methods.write(newValue).send({ from: accounts[0] });
  };

  const greet = async () => {
    const greet = await contract.methods.greet().call({from: accounts[0]});
    console.log("greet()=");
    console.log(greet);
    setGreetState(greet);
  };

  const setGreet = async (e) => {
    if (e.target.tagName === 'INPUT') {
      return;
    }
    if (greetState === '') {
      alert('Please enter a value to setGreet.')
    }
    const newGreet = greetState;
    await contract.methods.setGreet(newGreet).send({from: accounts[0]});
  };

  return (
    <div className="btns">

      <button onClick={read}>
        read()
      </button>

      <div onClick={write} className="input-btn">
        write(<input
          type="text"
          placeholder="uint"
          value={valueState}
          onChange={handleValueInputChange}
        />)
      </div>


      <button onClick={greet}>
        greet()
      </button>

      <div onClick={setGreet} className="input-btn">
        setGreet(<input
          type="text"
          placeholder="string"
          value={greetState}
          onChange={handleGreetInputChange}
        />)
      </div>

    </div>
  );
}

export default ContractBtns;
