const { ethers } = require("hardhat");

const main = async () => {
  const TaskContract = await ethers.getContractFactory("TaskContract");
  const taskContract = await TaskContract.deploy();
  await taskContract.waitForDeployment();
  console.log("TaskContract deployed to:", await taskContract.getAddress());
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

// Task Contract deployed to 0xD7aAA532f5969bD52ded96e2f6B29Deb054c3965
