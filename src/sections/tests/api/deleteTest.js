// api/deleteTest.js
import axiosInstance from '../../../lib/axiosInstance';

const deleteTest = async (testId) => {
  try {
    await axiosInstance.delete(`/test/deleteTestById/${testId}`);
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};

export default deleteTest;
