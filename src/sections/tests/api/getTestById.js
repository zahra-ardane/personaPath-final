// api/getTestById.js
import axiosInstance from '../../../lib/axiosInstance';

const getTestById = async (testId) => {
  try {
    const response = await axiosInstance.get(`/test/getTestById/${testId}`); 
    return response.data;

    // return ([
    //     { id: 1, name: 'Personality Test 1', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called personality test 1" },
    //     { id: 2, name: 'Personality Test 2', created: '2023-12-12 18:04', levels: '3', about: "This is a personality test called personality test 2" }
    // ])

  } catch (error) {
    console.error('Error fetching test :', error);
    throw error;
  }
};

export default getTestById;
