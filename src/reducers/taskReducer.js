export const taskReducer = (state, action) => {
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
      //update task in Local Storage
      localStorage.setItem("tasks", JSON.stringify(allTasks));
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

      //update edited task in local storage
      localStorage.setItem("tasks", JSON.stringify(state.tasks));

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
      //update tasks in local storage when deleted
      localStorage.setItem("tasks", JSON.stringify(newTasks));

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

      localStorage.setItem("tasks", JSON.stringify(state.tasks));

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
