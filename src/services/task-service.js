import axios from "axios";

const PORT = 'http://localhost:8000';

export const getAllTasks = async () => {
  const response = await axios.get(`${PORT}/tasks`);

  return response.data;
}

export const addTask = async (task) => {
  const response = await axios.post(`${PORT}/tasks`, task);
  
  return response.data;
};

export const updateTask = async (taskId, updatedTask) => {
  const response = await axios.patch(`${PORT}/tasks/${taskId}/text`, updatedTask);
  
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${PORT}/tasks/${taskId}`);
  
  return response.data;
};

export const deleteAllTasks = async () => {
  const response = await axios.delete(`${PORT}/tasks`);
  
  return response.data;
};
