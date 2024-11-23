// We require the ethers module to interact with the blockchain
// and smart contracts.

const { ethers } = require("hardhat");

// The main function deploys the TaskContract smart contract to the
// blockchain. It uses the TaskContract factory that we created with
// the `ethers.getContractFactory("TaskContract")` function. The
// `deploy()` function will create a new instance of the contract and
// deploy it to the blockchain. The `waitForDeployment()` function is
// a helper function that will wait until the contract is deployed and
// will return the deployed contract.
const main = async () => {
  const TaskContract = await ethers.getContractFactory("TaskContract");
  const taskContract = await TaskContract.deploy();
  await taskContract.waitForDeployment();
  console.log("TaskContract deployed to:", await taskContract.getAddress());
};

// The runMain function will run the main function. It will also
// catch any errors that might occur and will log them to the console.
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Finally, we call the runMain function to start the deployment
// process.
runMain();
