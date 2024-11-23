import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Task from "./Task";
import "./App.css";

import { TaskContractAddress } from "./config";
import TaskAbi from "./abi/TaskContract.json";

const ethers = require("ethers");
function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");

  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Metamask not detected");
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);
      const sepoliaChainId = "0xaa36a7";
      if (chainId !== sepoliaChainId) {
        alert("You are not connected to the Sepolia Test Network!");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    let task = {
      taskText: input,
      isDeleted: false,
    };
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi,
          signer
        );
        taskContract
          .addTask(task.taskText, task.isDeleted)
          .then((response) => {
            setTasks([...tasks, task]);
          })
          .catch((error) => {
            console.log("Error adding task", error);
          });
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.log("Error submitting the task", error);
    }
    setInput("");
  };

  const deleteTask = (key) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi,
          signer
        );
        let deleteTaskTx = await taskContract.deleteTask(key, true);
        let allTasks = await taskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.log("Error deleting task", error);
    }
  };

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi,
          signer
        );
        let allTasks = await taskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.log("Error getting all tasks", error);
    }
  };

  useEffect(() => {
    getAllTasks();
    connectWallet();
  }, []);
  return (
    <div>
      {currentAccount === "" ? (
        <center>
          <button className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        </center>
      ) : correctNetwork ? (
        <div className="App">
          <h2>Task Management App</h2>
          <form>
            <TextField
              id="outlined-basic"
              label="Task"
              variant="outlined"
              style={{ margin: "0px 5px" }}
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={addTask}>
              Add Task
            </Button>
          </form>
          <ul>
            {tasks.map((item) => (
              <Task
                key={item.id}
                taskText={item.taskText}
                onClick={deleteTask(item.id)}
              ></Task>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>Please connect to the Sepolia Testnet and reload the screen</div>
        </div>
      )}
    </div>
  );
}

export default App;
