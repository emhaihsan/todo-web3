import { List, ListItem, ListItemText, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import "./Task.css";

const Task = ({ taskText, onClick, onEdit, disabled }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(taskText);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedText);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditedText(taskText);
    setIsEditing(false);
  };

  return (
    <List className="todo__list">
      <ListItem>
        {isEditing ? (
          <TextField
            fullWidth
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="edit-input"
            disabled={disabled}
          />
        ) : (
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
