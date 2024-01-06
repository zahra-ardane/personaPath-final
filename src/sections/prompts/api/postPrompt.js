// api/postPrompt.js
import axiosInstance from '../../../lib/axiosInstance';

const postPrompt = async (promptData) => {
  try {
    const response = await axiosInstance.post('/prompt/createPrompt', promptData);
    return response.data;
    // return (
    //   { id: 3, name: 'test', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called test" }
    // )

  } catch (error) {
    throw error.response.data;
  }
};

export default postPrompt;
