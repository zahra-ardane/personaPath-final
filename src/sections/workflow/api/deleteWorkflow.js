// api/deleteWorkflow.js
import workflowAxiosInstance from '../../../lib/workflowAxiosInstance';

const deleteWorkflow = async (id) => {
  try {
    await workflowAxiosInstance.delete(`/DeleteWorkflow/${id}`);
  } catch (error) {
    console.error('Error deleting workflow:', error);
    throw error;
  }
};

export default deleteWorkflow;
