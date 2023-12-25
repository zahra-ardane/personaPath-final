// api/postTest.js
import axiosInstance from '../../../lib/axiosInstance';

const postTest = async (testData) => {
  try {
    console.log("in post test", testData);
    const response = await axiosInstance.post('/test', testData);
    return response.data;
    // return (
    //   { id: 3, name: 'test', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called test" }
    // )

  } catch (error) {
    throw error.response.data;
  }
};

export default postTest;
