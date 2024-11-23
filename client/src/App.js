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
        const tx = await taskContract.deleteTask(key, true);
        await tx.wait();

        await getAllTasks();
      }
    } catch (error) {
      console.log("Error deleting task:", error);
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

  const editTask = (taskId) => async (newText) => {
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
        const tx = await taskContract.editTask(taskId, newText);
        await tx.wait();

        await getAllTasks();
      }
    } catch (error) {
      console.log("Error editing task:", error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="App">
      {currentAccount === "" ? (
        <div className="connect-container">
          <h1>Decentralized Todo List</h1>
          <button className="connect-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      ) : correctNetwork ? (
        <>
          <div className="wallet-header">
            <h2>Decentralized Todo List</h2>
            <div className="wallet-info">
              <p>
                {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
              </p>
              <button className="disconnect-button" onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
          </div>

          <form className="task-form">
            <TextField
              className="task-input"
              label="New Task"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              onClick={addTask}
              disabled={isLoading}
              style={{
                background: "linear-gradient(45deg, #4E38D8 0%, #6C4EE6 100%)",
                borderRadius: "12px",
                padding: "10px 30px",
              }}
            >
              Add Task
            </Button>
          </form>

          <div className="task-list">
            {tasks.map((item) => (
              <Task
                key={item.id}
                taskText={item.taskText}
                onClick={deleteTask(item.id)}
                onEdit={editTask(item.id)}
                disabled={isLoading}
              />
            ))}
          </div>

          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          )}
        </>
      ) : (
        <div className="connect-container">
          <h2>Please connect to Sepolia Testnet</h2>
          <button className="connect-button" onClick={connectWallet}>
            Switch Network
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
