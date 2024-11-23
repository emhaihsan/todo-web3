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
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Silakan install MetaMask!");
        return;
      }

      const chainId = await ethereum.request({ method: "eth_chainId" });
      const sepoliaChainId = "0xaa36a7";

      if (chainId !== sepoliaChainId) {
        alert("Silakan hubungkan ke Sepolia Test Network!");
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: sepoliaChainId }],
          });
        } catch (switchError) {
          return;
        }
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts && accounts[0]) {
        setCurrentAccount(accounts[0]);
        setCorrectNetwork(true);
      }
    } catch (error) {
      console.log("Error connecting to metamask", error);
      alert("Gagal terhubung ke wallet. Silakan coba lagi.");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const taskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        setIsLoading(true);
        const tx = await taskContract.addTask(input, false);
        await tx.wait();

        await getAllTasks();
        setInput("");
      }
    } catch (error) {
      console.log("Error adding task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = (key) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const taskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        setIsLoading(true);
        await taskContract.deleteTask(key, true);
        await getAllTasks();
      } else {
        console.log("Ethereum object not found");
      }
    } catch (error) {
      console.log("Error deleting task", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const taskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        const allTasks = await taskContract.getMyTasks();
        if (Array.isArray(allTasks)) {
          const formattedTasks = allTasks.map((task) => ({
            id: Number(task.id),
            taskText: task.taskText,
            isDeleted: task.isDeleted,
          }));
          setTasks(formattedTasks);
        } else {
          setTasks([]);
        }
      }
    } catch (error) {
      console.log("Error getting all tasks", error);
      setTasks([]);
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount("");
    setCorrectNetwork(false);
    setTasks([]);
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const accounts = await ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const chainId = await ethereum.request({ method: "eth_chainId" });
            const sepoliaChainId = "0xaa36a7";

            if (chainId === sepoliaChainId) {
              setCurrentAccount(accounts[0]);
              setCorrectNetwork(true);
            }
          }
        }
      } catch (error) {
        console.log("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (currentAccount !== "" && correctNetwork) {
      getAllTasks();
    }
  }, [currentAccount, correctNetwork]);

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
          <div className="wallet-header">
            <h2>Task Management App</h2>
            <div className="wallet-info">
              <p>
                Connected Wallet: {currentAccount.slice(0, 6)}...
                {currentAccount.slice(-4)}
              </p>
              <button className="disconnect-button" onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
            </div>
          </div>
          <form>
            <TextField
              id="outlined-basic"
              label="Task"
              variant="outlined"
              style={{ margin: "0px 5px" }}
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={addTask}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Task"}
            </Button>
          </form>
          <ul>
            {tasks.map((item) => (
              <Task
                key={item.id}
                taskText={item.taskText}
                onClick={deleteTask(item.id)}
                disabled={isLoading}
              />
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
