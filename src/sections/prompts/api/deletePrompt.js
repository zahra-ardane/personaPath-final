// api/deletePrompt.js
import axiosInstance from '../../../lib/axiosInstance';

const deletePrompt = async (promptId) => {
  try {
    await axiosInstance.delete(`/prompt/deletePrompt/${promptId}`);
  } catch (error) {
    console.error('Error deleting prompt:', error);
    throw error;
  }
};

export default deletePrompt;
