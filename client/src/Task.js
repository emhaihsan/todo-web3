import { List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Task.css";

const Task = ({ taskText, onClick, disabled }) => {
  return (
    <List className="todo__list">
      <ListItem>
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
        <DeleteIcon
          className={`delete-icon ${disabled ? "disabled-icon" : ""}`}
          fontSize="large"
          onClick={disabled ? undefined : onClick}
        />
      </ListItem>
    </List>
  );
};

export default Task;
