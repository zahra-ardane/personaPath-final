// api/deleteTest.js
import axiosInstance from '../../../lib/axiosInstance';

const deleteTest = async (testId) => {
  try {
    console.log("in delete test api", testId);
    // Perform the API request to delete the test with the specified ID
    await axiosInstance.delete(`/test/${testId}`);
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};

export default deleteTest;
