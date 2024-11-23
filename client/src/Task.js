import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Task.css";
const Task = ({ taskText, onClick }) => {
  return (
    <>
      <List className="todo__list">
        <ListItem>
          <ListItemText primary={taskText} />
        </ListItem>
        <DeleteIcon
          fontSize="large"
          style={{ opacity: 0.7 }}
          onClick={onClick}
        ></DeleteIcon>
      </List>
    </>
  );
};

export default Task;
