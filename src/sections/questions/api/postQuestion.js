// api/postTest.js
import axiosInstance from '../../../lib/axiosInstance';

const postTest = async (testId, data) => {
  try {

    console.log("in post qustion data is", data);
    const response = await axiosInstance.post(`/question/${testId}`, data);
    return response.data;
    // return (
    //   { id: 3, name: 'test', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called test" }
    // )

  } catch (error) {
    throw error;
  }
};

export default postTest;
