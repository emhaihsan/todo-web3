//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskContract {
    //Emitted when a task is added
    event AddTask(address recipient, uint taskId);
    //Emitted when a task is deleted
    event DeleteTask(uint taskId, bool isDeleted);
    //Emitted when a task is edited
    event EditTask(uint taskId, string newText);

    //Struct that represents a task
    struct Task {
        //The task id, it is the index in the array
        uint id;
        //The text of the task
        string taskText;
        //If the task is deleted or not
        bool isDeleted;
    }

    //The array of tasks
    Task[] private tasks;

    //The mapping of task to owner
    mapping(uint256 => address) taskToOwner;

    //Function to add a task
    function addTask(string memory taskText, bool isDeteled) external {
        //Get the new task id
        uint taskId = tasks.length;
        //Add the task to the array
        tasks.push(Task(taskId, taskText, isDeteled));
        //Set the owner of the task
        taskToOwner[taskId] = msg.sender;
        //Emit the event
        emit AddTask(taskToOwner[taskId], taskId);
    }

    //Function to edit a task
    function editTask(uint taskId, string memory newText) external {
        //Check if the user is the owner of the task and the task is not deleted
        if (taskToOwner[taskId] == msg.sender && !tasks[taskId].isDeleted) {
            //Edit the text of the task
            tasks[taskId].taskText = newText;
            //Emit the event
            emit EditTask(taskId, newText);
        }
    }

    //Function to delete a task
    function deleteTask(uint taskId, bool isDeleted) external {
        //Check if the user is the owner of the task
        if (taskToOwner[taskId] == msg.sender) {
            //Delete the task
            tasks[taskId].isDeleted = isDeleted;
            //Emit the event
            emit DeleteTask(taskId, isDeleted);
        }
    }

    //Function to get the tasks of the user
    function getMyTasks() external view returns (Task[] memory) {
        //Create an array to store the tasks
        Task[] memory temporary = new Task[](tasks.length);
        //Create a counter to count the number of tasks
        uint counter = 0;
        //Loop through all the tasks
        for (uint i = 0; i < tasks.length; i++) {
            //Check if the user is the owner of the task and the task is not deleted
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                //Add the task to the array
                temporary[counter] = tasks[i];
                //Increase the counter
                counter++;
            }
        }

        //Create an array to store the tasks
        Task[] memory result = new Task[](counter);
        //Loop through all the tasks
        for (uint i = 0; i < counter; i++) {
            //Add the task to the array
            result[i] = temporary[i];
        }
        //Return the array
        return result;
    }
}
