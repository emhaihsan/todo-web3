const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskContract", function () {
  let TaskContract;
  let taskContract;
  let owner;

  const NUM_TOTAL_TASKS = 5;
  let totalTasks;

  beforeEach(async function () {
    TaskContract = await ethers.getContractFactory("TaskContract");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();
    totalTasks = [];
    for (let i = 0; i < NUM_TOTAL_TASKS; i++) {
      let task = {
        taskText: "Task number :-" + i,
        isDeleted: false,
      };
      await taskContract.addTask(task.taskText, task.isDeleted);
      totalTasks.push(task);
    }
  }); // it will run before each it()

  describe("Add Task", function () {
    it("Should emit AddTask Event", async function () {
      let task = {
        taskText: "New Task",
        isDeleted: false,
      };
      await expect(await taskContract.addTask(task.taskText, task.isDeleted))
        .to.emit(taskContract, "AddTask")
        .withArgs(owner.address, NUM_TOTAL_TASKS);
    });
  });

  describe("Get All tasks", function () {
    it("Should return all tasks", async function () {
      const tasks = await taskContract.getMyTasks();
      expect(tasks.length).to.equal(NUM_TOTAL_TASKS);
    });
  });

  describe("Delete Task", function () {
    it("Should emit DeleteTask Event", async function () {
      const TASK_ID = 0;
      const TASK_DELETED = true;
      await expect(await taskContract.deleteTask(TASK_ID, TASK_DELETED))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(TASK_ID, TASK_DELETED);
    });
  });
});
