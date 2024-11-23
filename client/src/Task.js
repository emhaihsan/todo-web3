import { List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Task.css";
const Task = ({ taskText, onClick, disabled }) => {
  return (
    <>
      <List className="todo__list">
        <ListItem>
          <ListItemText primary={taskText} />
        </ListItem>
        <DeleteIcon
          fontSize="large"
          style={{
            opacity: disabled ? 0.5 : 0.7,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          onClick={disabled ? undefined : onClick}
          className={disabled ? "disabled-icon" : ""}
        />
      </List>
    </>
  );
};

export default Task;
