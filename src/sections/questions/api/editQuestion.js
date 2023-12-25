// api/postTest.js
import axiosInstance from '../../../lib/axiosInstance';

const editQuestion = async (questionId, data) => {
  try {
    console.log("edit question's data in api call is ", data);
    const response = await axiosInstance.put(`/question/${questionId}`, data);
    return response.data;
    // return (
    //   { id: 3, name: 'test', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called test" }
    // )

  } catch (error) {
    throw error;
  }
};

export default editQuestion;
