import { useState, useRef, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import "./task-manager.css";
import Task from "../task/Task";
import Alert from "../alert/Alert";

const TaskManagerReducer = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  //const [tasks, setTasks] = useState([]);

  //storing to local storage
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  const [taskID, setTaskID] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  //focus on name input on render
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current.focus();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date) {
      alert("Please enter your task details");
    } else if (name && date && isEditing) {
      setTasks(
        tasks.map((task) => {
          if (task.id === taskID) {
            return { ...task, name: name, date: date, complete: false };
          }
          return task;
        })
      );
      setDate("");
      setName("");
      setIsEditing(false);
      setTaskID(null);
    } else {
      const newTask = {
        id: Date.now(),
        name,
        date, //es6, no need to specify value since it's same with property
        complete: false,
      };
      setTasks([...tasks, newTask]);
      setName("");
      setDate("");
    }
  };

  const editTask = (id) => {
    // console.log(id);
    const currTask = tasks.find((task) => task.id === id);
    // console.log(currTask);
    setIsEditing(true);
    setTaskID(id);
    setName(currTask.name);
    setDate(currTask.date);
  };

  const deleteTask = (id) => {
    //confirm dialog box to confirm delete or not
    if (window.confirm("Delete this task?") === true) {
      const newTasks = tasks.filter((task) => task.id !== id);
      setTasks(newTasks);
    }
  };

  const completeTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, complete: true };
        }
        return task;
      })
    );
  };

  return (
    <div className="--bg-primary">
      <Alert />
      <h1 className="--text-center --text-light">Tasks ManageR</h1>
      <div className="--flex-center --p">
        <div className="--card --bg-light --width-500px --p --flex-center">
          <form onSubmit={handleSubmit} className="form --form-control">
            <div>
              <label htmlFor="name">Task:</label>
              <input
                ref={nameInputRef}
                type="text"
                name="name"
                placeholder="Your Task"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <button
              className={
                isEditing
                  ? "--btn --btn-danger --btn-block"
                  : "--btn --btn-success --btn-block"
              }
            >
              {isEditing ? "Edit Task" : "Save Task"}
            </button>
          </form>
        </div>
      </div>
      <article className="--flex-center --my2">
        <div className="--width-500px --p">
          <h2 className="--text-light">Tasks List</h2>
          <hr style={{ background: "#ffffff" }} />

          {/* Individual Task */}

          {tasks.length === 0 ? (
            <p className="--text-light">No task added yet...</p>
          ) : (
            <div>
              {tasks.map((task) => {
                const { id } = task;
                return (
                  <Task
                    key={id}
                    {...task}
                    editTask={editTask}
                    deleteTask={deleteTask}
                    completeTask={completeTask}
                  />
                );
              })}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default TaskManagerReducer;
