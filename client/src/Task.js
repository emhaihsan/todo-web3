import { List, ListItem, ListItemText, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import "./Task.css";

/**
 * @param {string} taskText - The text of the task that needs to be displayed
 * @param {function} onClick - The function to call when the delete icon is clicked
 * @param {function} onEdit - The function to call when the edit icon is clicked
 * @param {boolean} disabled - Whether the task is disabled or not
 * @returns {ReactElement} - The JSX element to render
 */
const Task = ({ taskText, onClick, onEdit, disabled }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(taskText);

  /**
   * Called when the edit button is clicked
   * If the task is being edited, it will call the onEdit function with the current editedText
   * If the task is not being edited, it will set isEditing to true so the user can edit the task
   */
  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedText);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  /**
   * Called when the cancel button is clicked
   * It will set the editedText back to the original taskText and set isEditing to false
   */
  const handleCancel = () => {
    setEditedText(taskText);
    setIsEditing(false);
  };

  return (
    <List className="todo__list">
      <ListItem>
        {isEditing ? (
          /**
           * If the task is being edited, it will show a TextField with the current editedText
           * The TextField is disabled if the task is disabled
           */
          <TextField
            fullWidth
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="edit-input"
            disabled={disabled}
          />
        ) : (
          /**
           * If the task is not being edited, it will show the taskText in a ListItemText
           * The ListItemText is styled with a white color and a font size of 16px
           */
          <ListItemText
            primary={taskText}
            primaryTypographyProps={{
              style: {
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "500",
              },
            }}
          />
        )}
        <div className="task-actions">
          {isEditing ? (
            /**
             * If the task is being edited, it will show a CheckIcon and a CloseIcon
             * The CheckIcon will call the handleEdit function when clicked and the CloseIcon will call the handleCancel function when clicked
             * Both icons are disabled if the task is disabled
             */
            <>
              <CheckIcon
                className={`edit-icon ${disabled ? "disabled-icon" : ""}`}
                fontSize="large"
                onClick={disabled ? undefined : handleEdit}
              />
              <CloseIcon
                className={`cancel-icon ${disabled ? "disabled-icon" : ""}`}
                fontSize="large"
                onClick={disabled ? undefined : handleCancel}
              />
            </>
          ) : (
            /**
             * If the task is not being edited, it will show an EditIcon and a DeleteIcon
             * The EditIcon will call the handleEdit function when clicked and the DeleteIcon will call the onClick function when clicked
             * Both icons are disabled if the task is disabled
             */
            <>
              <EditIcon
                className={`edit-icon ${disabled ? "disabled-icon" : ""}`}
                fontSize="large"
                onClick={disabled ? undefined : handleEdit}
              />
              <DeleteIcon
                className={`delete-icon ${disabled ? "disabled-icon" : ""}`}
                fontSize="large"
                onClick={disabled ? undefined : onClick}
              />
            </>
          )}
        </div>
      </ListItem>
    </List>
  );
};

export default Task;
