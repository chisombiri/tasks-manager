import { useState, useRef, useEffect, useReducer } from "react";
import useLocalStorage from "use-local-storage";
import "./task-manager.css";
import Task from "../task/Task";
import Alert from "../alert/Alert";
import Confirm from "../confirm/Confirm";
import { taskReducer } from "../../reducers/taskReducer";

//component

const TaskManagerReducer = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  //storing to local storage
  // const [tasks, setTasks] = useLocalStorage("tasks", []);

  //initial state should have tasks from local storage
  const initialState = {
    tasks: localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : [],
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

      // setTasks(
      //   tasks.map((task) => {
      //     if (task.id === updatedTask.id) {
      //       return { ...task, name, date, complete: false };
      //     }
      //     return task;
      //   })
      // );
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
      //setTasks([...tasks, newTask]);
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
    // const newTasks = tasks.filter((task) => task.id !== id);
    // setTasks(newTasks);
    closeModal();
  };

  const completeTask = (id) => {
    dispatch({
      type: "COMPLETE_TASK",
      payload: id,
    });

    // setTasks(
    //   tasks.map((task) => {
    //     if (task.id === id) {
    //       return { ...task, complete: true };
    //     }
    //     return task;
    //   })
    // );
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
