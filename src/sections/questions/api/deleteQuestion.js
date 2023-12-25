// api/deleteTest.js
import axiosInstance from '../../../lib/axiosInstance';

const deleteQuestion = async (questionId) => {
  try {
    console.log("in delete question api", questionId);
    // Perform the API request to delete the test with the specified ID
    await axiosInstance.delete(`/question/${questionId}`);
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};

export default deleteQuestion;
