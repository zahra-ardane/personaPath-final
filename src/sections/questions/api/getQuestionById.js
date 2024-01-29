// api/getQuestionById.js
import axiosInstance from '../../../lib/axiosInstance';

const getQuestionById = async (id) => {
  try {
    // console.log("question id in getQuestionById ", id);
    const response = await axiosInstance.get(`/question/getQuestionById/${id}`);
    return response.data;

  } catch (error) {
    throw error;
  }
};

export default getQuestionById;

