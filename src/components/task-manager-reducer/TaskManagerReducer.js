import { useState, useRef, useEffect, useReducer } from "react";
import useLocalStorage from "use-local-storage";
import "./task-manager.css";
import Task from "../task/Task";
import Alert from "../alert/Alert";
import Confirm from "../confirm/Confirm";

const taskReducer = (state, action) => {
  let id = null; //need to reassign id in switch statement
  switch (action.type) {
    case "EMPTY_FIELD":
      return {
        ...state,
        isAlertOpen: true,
        alertContent: "Please Enter a task and date",
        alertClass: "danger",
      };
    case "CLOSE_ALERT":
      return {
        ...state,
        isAlertOpen: false,
      };
    case "ADD_TASK":
      const allTasks = [...state.tasks, action.payload]; //adding all the tasks gotten from the payload object
      return {
        ...state,
        tasks: allTasks,
        isAlertOpen: true,
        alertContent: "Task added successfully",
        alertClass: "success",
      };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        taskID: action.payload,
        isEditModalOpen: true,
        modalTitle: "Edit Task",
        modalMsg: "You are about to edit this task",
        modalActionText: "Edit",
      };
    case "EDIT_TASK":
      return { ...state, isEditing: true };
    case "CLOSE_MODAL":
      return { ...state, isEditModalOpen: false, isDeleteModalOpen: false };
    case "UPDATE_TASK":
      const updatedTask = action.payload;
      id = action.payload.id;

      //find task index
      const taskIndex = state.tasks.findIndex((task) => {
        return task.id === id;
      });

      //replace task by its index
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = updatedTask;
      }

      return {
        ...state,
        isEditing: false,
        isAlertOpen: true,
        alertContent: "Task Edited successfully",
        alertClass: "success",
      };
    case "OPEN_DELETE_MODAL":
      return {
        ...state,
        taskID: action.payload,
        isDeleteModalOpen: true,
        modalTitle: "Delete Task",
        modalMsg: "You are about to DELETE this task",
        modalActionText: "Delete",
      };
    case "DELETE_TASK":
      const deleteId = action.payload;
      const newTasks = state.tasks.filter((task) => task.id !== deleteId);
      return {
        ...state,
        tasks: newTasks,
        isAlertOpen: true,
        alertContent: "Task Deleted",
        alertClass: "danger",
      };
    case "COMPLETE_TASK":
      id = action.payload;

      //find task index
      const completeTaskIndex = state.tasks.findIndex((task) => {
        return task.id === id;
      });

      //   console.log(completeTaskIndex);

      const completedTask = {
        id,
        name: state.tasks[completeTaskIndex].name,
        date: state.tasks[completeTaskIndex].date,
        complete: true,
      };

      if (completeTaskIndex !== -1) {
        state.tasks[completeTaskIndex] = completedTask;
      }

      //console.log(completedTask);

      return {
        ...state,
        isAlertOpen: true,
        alertContent: "Good Job, Task completed!",
        alertClass: "success",
      };

    default:
      return state;
  }
};

//component

const TaskManagerReducer = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  //storing to local storage
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  //initial state should have tasks from local storage
  const initialState = {
    tasks,
    taskID: null,
    isEditing: false,
    isAlertOpen: false,
    alertContent: "This is an alert",
    alertClass: "danger",
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    modalTitle: "Delete Task",
    modalMsg: "You're about to delete this task",
    modalActionText: "OK",
  };

  const [state, dispatch] = useReducer(taskReducer, initialState);

  //focus on name input on render
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current.focus();
  });

  const closeAlert = () => {
    dispatch({
      type: "CLOSE_ALERT",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date) {
      dispatch({
        type: "EMPTY_FIELD",
      });
    }

    if (name && date && state.isEditing) {
      const updatedTask = {
        id: state.taskID,
        name,
        date,
        complete: false,
      };
      dispatch({
        type: "UPDATE_TASK",
        payload: updatedTask,
      });
      setName("");
      setDate("");
      //update task in local storage
      setTasks(
        tasks.map((task) => {
          if (task.id === updatedTask.id) {
            return { ...task, name, date, complete: false };
          }
          return task;
        })
      );
      return; //break out when this condition is met
    }

    if (name && date) {
      const newTask = {
        id: Date.now(),
        name,
        date,
        complete: false,
      };
      dispatch({
        type: "ADD_TASK",
        payload: newTask,
      });
      setName("");
      setDate("");
      setTasks([...tasks, newTask]);
    }
  };

  const openEditModal = (id) => {
    dispatch({
      type: "OPEN_EDIT_MODAL",
      payload: id,
    });
  };

  const editTask = () => {
    const id = state.taskID;
    dispatch({
      type: "EDIT_TASK",
      payload: id,
    });
    const thisTask = state.tasks.find((task) => task.id === id);
    setName(thisTask.name);
    setDate(thisTask.date);
    closeModal();
  };

  const openDeleteModal = (id) => {
    dispatch({
      type: "OPEN_DELETE_MODAL",
      payload: id,
    });
  };

  const deleteTask = () => {
    const id = state.taskID;
    dispatch({
      type: "DELETE_TASK",
      payload: id,
    });
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    closeModal();
  };

  const completeTask = (id) => {
    dispatch({
      type: "COMPLETE_TASK",
      payload: id,
    });

    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, complete: true };
        }
        return task;
      })
    );
  };

  const closeModal = () => {
    dispatch({
      type: "CLOSE_MODAL",
    });
  };

  return (
    <div className="--bg-primary">
      {state.isAlertOpen && (
        <Alert
          alertContent={state.alertContent}
          alertClass={state.alertClass}
          onCloseAlert={closeAlert}
        />
      )}

      {state.isEditModalOpen && (
        <Confirm
          modalTitle={state.modalTitle}
          modalMsg={state.modalMsg}
          modalAction={editTask}
          modalActionText={state.modalActionText}
          onCloseModal={closeModal}
        />
      )}

      {state.isDeleteModalOpen && (
        <Confirm
          modalTitle={state.modalTitle}
          modalMsg={state.modalMsg}
          modalAction={deleteTask}
          modalActionText={state.modalActionText}
          onCloseModal={closeModal}
        />
      )}

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
                state.isEditing
                  ? "--btn --btn-danger --btn-block"
                  : "--btn --btn-success --btn-block"
              }
            >
              {state.isEditing ? "Edit Task" : "Save Task"}
            </button>
          </form>
        </div>
      </div>
      <article className="--flex-center --my2">
        <div className="--width-500px --p">
          <h2 className="--text-light">Tasks List</h2>
          <hr style={{ background: "#ffffff" }} />

          {/* Individual Task */}

          {state.tasks.length === 0 ? (
            <p className="--text-light">No task added yet...</p>
          ) : (
            <div>
              {state.tasks.map((task) => {
                return (
                  <Task
                    {...task}
                    editTask={openEditModal}
                    deleteTask={openDeleteModal}
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
