import { Component } from "react";
import { getAllTasks, addTask, updateTask, deleteTask } from "../../services/task-service";
import Apex from "../Apex";
import './styles.scss';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      newTaskText: '',
      editingTaskId: null,
      editingTaskText: '',
      errorMessage: '',
      editErrorMessage: '',
    };
  }

  handleGetTasks = async () => {
    try {
      const tasks = await getAllTasks();
      const tasksWithIndex = tasks.map((task, index) => ({ ...task, originalIndex: index }));
      this.setState({ tasks: tasksWithIndex });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  componentDidMount() {
    this.handleGetTasks();
  }

  handleChangeInput = (event) => {
    this.setState({
      newTaskText: event.target.value,
      errorMessage: '',
    });
  }

  handleAddTask = async () => {
    const { newTaskText } = this.state;

    if (newTaskText.trim()) {
      try {
        const addedTask = await addTask({ text: newTaskText, completed: false });

        this.setState(prevState => {
          const activeTasks = prevState.tasks.filter(task => !task.completed);
          const completedTasks = prevState.tasks.filter(task => task.completed);

          const updatedTasks = [
            ...activeTasks,
            { ...addedTask, originalIndex: activeTasks.length },
            ...completedTasks
          ];

          return {
            tasks: updatedTasks,
            newTaskText: '',
            errorMessage: '',
          };
        });
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      this.setState({ errorMessage: 'Введите текст задачи' });
    }
  };

  handleUpdateTask = async (taskId) => {
    const { editingTaskText } = this.state;

    if (editingTaskText.trim()) {
      try {
        const updatedTask = await updateTask(taskId, { text: editingTaskText });

        this.setState(prevState => {
          const updatedTasks = prevState.tasks.map(task => {
            if (task._id === taskId) {
              return { ...task, text: updatedTask.text };
            }
            return task;
          });

          return {
            tasks: updatedTasks,
            editingTaskId: null,
            editingTaskText: '',
            errorMessage: '',
            editErrorMessage: '',
          };
        });
      } catch (error) {
        console.error('Error updating task:', error);
        this.setState({ editErrorMessage: 'Не удалось обновить задачу' });
      }
    } else {
      this.setState({ editErrorMessage: 'Введите текст задачи' });
    }
  };

  handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      this.setState(prevState => ({
        tasks: prevState.tasks.filter(task => task._id !== taskId)
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  handleDeleteAll = () => {
    this.setState({ tasks: [] });
  };

  handleChangeCheckbox = (taskId) => {
    if (this.state.editingTaskId) {
      return;
    }

    this.setState(prevState => {
      const updatedTasks = prevState.tasks.map(task => {
        if (task._id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });

      const activeTasks = updatedTasks.filter(task => !task.completed);
      const completedTasks = updatedTasks.filter(task => task.completed);

      activeTasks.sort((a, b) => a.originalIndex - b.originalIndex);

      return { tasks: [...activeTasks, ...completedTasks] };
    });
  };

  handleEditClick = (task) => {
    this.setState({
      editingTaskId: task._id,
      editingTaskText: task.text,
      editErrorMessage: '',
    });
  }

  handleCancelEdit = () => {
    this.setState({
      editingTaskId: null,
      editingTaskText: '',
      editErrorMessage: '',
    });
  };

  render() {
    return (
      <section className="tasks">
        <Apex onDeleteAll={this.handleDeleteAll} />
        <div className="tasks__task">
          {this.state.tasks.map(task => (
            <div className="tasks__activity" key={task._id}>
              <input
                className="tasks__checkbox"
                type="checkbox"
                checked={task.completed}
                onChange={() => this.handleChangeCheckbox(task._id)}
                disabled={this.state.editingTaskId !== null}
              />
              <div className="tasks__text-container">
                {this.state.editingTaskId === task._id ? (
                  <>
                    <input
                      className="tasks__input"
                      type="text"
                      value={this.state.editingTaskText}
                      onChange={(e) => this.setState({ editingTaskText: e.target.value })}
                    />
                    {this.state.editErrorMessage && (
                      <span className="tasks__edit-error">{this.state.editErrorMessage}</span>
                    )}
                  </>
                ) : (
                  <p className={`tasks__name ${task.completed ? 'tasks__name_completed' : ''}`}>{task.text}</p>
                )}
              </div>
              <div className="tasks__button-block">
                {this.state.editingTaskId === task._id ? (
                  <>
                    <button
                      className="tasks__button-save"
                      type="button"
                      onClick={() => this.handleUpdateTask(task._id)}
                    >
                    </button>
                    <button
                      className="tasks__button-cancel"
                      type="button"
                      onClick={this.handleCancelEdit}
                    >
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="tasks__edit"
                      type="button"
                      onClick={() => this.handleEditClick(task)}
                    >
                    </button>
                    <button
                      className="tasks__button-remove"
                      type="button"
                      onClick={() => this.handleDeleteTask(task._id)}
                    >
                      Удалить
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="tasks__footer">
          <div className="tasks__input-block">
            <input
              className="tasks__input"
              type="text"
              placeholder="Добавить новую задачу"
              value={this.state.newTaskText}
              onChange={this.handleChangeInput}
            />
            {this.state.errorMessage && <span className="tasks__error-message">{this.state.errorMessage}</span>}
          </div>
          <button className="tasks__button-footer" onClick={this.handleAddTask}>Добавить</button>
        </div>
      </section>
    );
  }
}

export default Tasks;
