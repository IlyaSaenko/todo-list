import { Component } from "react";
import { deleteAllTasks } from "../../services/task-service";
import './styles.scss';

class Apex extends Component {

  handleDeleteAllTasks = async () => {
    try {
      await deleteAllTasks();
      this.props.onDeleteAll();
    } catch (error) {
      console.error('Error deleting all tasks:', error);
    }
  };

  render() {
    return (
      <section className="apex">
        <h1 className="apex__title">Мои задачи</h1>
        <button
          className="apex__button-remove"
          type="button"
          onClick={this.handleDeleteAllTasks}
        >
          Удалить все
        </button>
      </section>
    );
  }
};

export default Apex;