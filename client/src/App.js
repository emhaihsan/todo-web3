import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Task from "./Task";
import "./App.css";

import { TaskContractAddress } from "./config";
import TaskAbi from "./abi/TaskContract.json";

const ethers = require("ethers");
function App() {
  const [tasks, setTasks] = useState([]); // State to store the list of tasks
  const [input, setInput] = useState(""); // State to store the input value
  const [currentAccount, setCurrentAccount] = useState(""); // State to store the current account

  const [correctNetwork, setCorrectNetwork] = useState(false); // State to check if the network is correct
  const [isLoading, setIsLoading] = useState(false); // State to check if the component is loading

  // Function to connect to the wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window; // Get the ethereum object from the window
      if (!ethereum) {
        // Check if the user has MetaMask installed
        alert("Please install MetaMask!");
        return;
      }

      const chainId = await ethereum.request({ method: "eth_chainId" }); // Get the current chain ID
      const sepoliaChainId = "0xaa36a7"; // Sepolia Test Network chain ID

      if (chainId !== sepoliaChainId) {
        // Check if the user is on the correct network
        alert("Please connect to the Sepolia Test Network!");
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
      }); // Get the list of accounts
      if (accounts && accounts[0]) {
        setCurrentAccount(accounts[0]);
        setCorrectNetwork(true);
      }
    } catch (error) {
      console.log("Error connecting to metamask", error);
      alert("Failed to connect to wallet. Please try again.");
    }
  };

  // Function to add a task
  const addTask = async (e) => {
    e.preventDefault(); // Prevent the page from reloading
    if (!input.trim()) return; // Check if the input is not empty

    try {
      const { ethereum } = window; // Get the ethereum object from the window
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const taskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        setIsLoading(true); // Set the component to loading
        const tx = await taskContract.addTask(input, false); // Call the addTask function on the contract
        await tx.wait(); // Wait for the transaction to be confirmed

        await getAllTasks(); // Call the getAllTasks function to update the list of tasks
        setInput(""); // Clear the input field
      }
    } catch (error) {
      console.log("Error adding task:", error);
    } finally {
      setIsLoading(false); // Set the component to not loading
    }
  };
  /**
   * Delete a task by its key. This function is used as a callback in the
   * Task component, so it needs to return a function that takes no arguments.
   * @param {number} key The key of the task to delete
   * @returns {function} A function that deletes a task
   */
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

  /**
   * Get all tasks from the contract. This function is used to populate the
   * list of tasks when the component mounts, and when a task is added or
   * deleted.
   */
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
  /**
   * Function to disconnect the wallet. This function is used to disconnect
   * the wallet when the user clicks the disconnect button.
   */
  const disconnectWallet = () => {
    // Set the current account to an empty string
    setCurrentAccount("");
    // Set the correct network to false
    setCorrectNetwork(false);
    // Set the tasks to an empty array
    setTasks([]);
  };

  /**
   * Function to edit a task. This function is used to edit a task when the
   * user clicks the edit button.
   * @param {number} taskId The ID of the task to edit
   * @param {string} newText The new text for the task
   * @returns {Promise<void>} A promise that resolves when the task has been edited
   */
  const editTask = (taskId) => async (newText) => {
    try {
      // Get the ethereum object from the window
      const { ethereum } = window;
      // Check if the user has MetaMask installed
      if (ethereum) {
        // Get the provider and signer
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        // Get the task contract
        const taskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        // Set the component to loading
        setIsLoading(true);
        // Call the editTask function on the contract
        const tx = await taskContract.editTask(taskId, newText);
        // Wait for the transaction to be confirmed
        await tx.wait();

        // Call the getAllTasks function to update the list of tasks
        await getAllTasks();
      }
    } catch (error) {
      // Log an error if there is one
      console.log("Error editing task:", error);
    } finally {
      // Set the component to not loading
      setIsLoading(false);
    }
  };

  /**
   * Function to check if the wallet is connected. This function is used to
   * check if the wallet is connected when the component mounts.
   */
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Get the ethereum object from the window
        const { ethereum } = window;
        // Check if the user has MetaMask installed
        if (ethereum) {
          // Get the list of accounts
          const accounts = await ethereum.request({ method: "eth_accounts" });
          // Check if there are any accounts
          if (accounts.length > 0) {
            // Get the current chain ID
            const chainId = await ethereum.request({ method: "eth_chainId" });
            // Get the Sepolia Test Network chain ID
            const sepoliaChainId = "0xaa36a7";

            // Check if the user is on the correct network
            if (chainId === sepoliaChainId) {
              // Set the current account to the first account in the list
              setCurrentAccount(accounts[0]);
              // Set the correct network to true
              setCorrectNetwork(true);
            }
          }
        }
      } catch (error) {
        // Log an error if there is one
        console.log("Error checking wallet connection:", error);
      }
    };

    // Call the checkWalletConnection function
    checkWalletConnection();
  }, []);

  /**
   * Function to get all tasks from the contract. This function is used to
   * populate the list of tasks when the component mounts, and when a task is
   * added or deleted.
   */
  useEffect(() => {
    // Check if the wallet is connected and the user is on the correct network
    if (currentAccount !== "" && correctNetwork) {
      // Call the getAllTasks function to update the list of tasks
      getAllTasks();
    }
  }, [currentAccount, correctNetwork]);

  return (
    <div className="App">
      {/* If the user is not connected to a wallet, display a button to connect */}
      {currentAccount === "" ? (
        <div className="connect-container">
          <h1>Decentralized Todo List</h1>
          <button className="connect-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      ) : /* If the user is connected to a wallet, check if they are on the correct network */
      correctNetwork ? (
        <>
          {/* Header with the current wallet address */}
          <div className="wallet-header">
            <h2>Decentralized Todo List</h2>
            <div className="wallet-info">
              <p>
                {/* Display the first 6 characters of the wallet address, followed by ... and the last 4 characters */}
                {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
              </p>
              <button className="disconnect-button" onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
          </div>

          {/* Form to add a new task */}
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

          {/* List of tasks */}
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

          {/* Loading overlay */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          )}
        </>
      ) : (
        /* If the user is connected to a wallet but not on the correct network, display a button to switch networks */
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
