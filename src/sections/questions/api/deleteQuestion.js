// api/deleteTest.js
import axiosInstance from '../../../lib/axiosInstance';

const deleteQuestion = async (questionId) => {
  try {
    // console.log("in delete question api", questionId);
    await axiosInstance.delete(`/question/deleteQuestionById/${questionId}`);
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};

export default deleteQuestion;
