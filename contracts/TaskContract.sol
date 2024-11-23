//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskContract {
    event AddTask(address recipient, uint taskId);
    event DeleteTask(uint taskId, bool isDeleted);
    event EditTask(uint taskId, string newText);

    struct Task {
        uint id;
        string taskText;
        bool isDeleted;
    }

    Task[] private tasks;

    mapping(uint256 => address) taskToOwner;

    function addTask(string memory taskText, bool isDeteled) external {
        uint taskId = tasks.length;
        tasks.push(Task(taskId, taskText, isDeteled));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(taskToOwner[taskId], taskId);
    }

    function editTask(uint taskId, string memory newText) external {
        if (taskToOwner[taskId] == msg.sender && !tasks[taskId].isDeleted) {
            tasks[taskId].taskText = newText;
            emit EditTask(taskId, newText);
        }
    }

    function deleteTask(uint taskId, bool isDeleted) external {
        if (taskToOwner[taskId] == msg.sender) {
            tasks[taskId].isDeleted = isDeleted;
            emit DeleteTask(taskId, isDeleted);
        }
    }

    function getMyTasks() external view returns (Task[] memory) {
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;
        for (uint i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                temporary[counter] = tasks[i];
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }
}
