// api/postWorkflow.js
import workflowAxiosInstance from '../../../lib/workflowAxiosInstance';

const postWorkflow = async (data) => {
  try {
    console.log("data being sent in postWorkflow is ", data);
    const response = await workflowAxiosInstance.post(`/PostWorkflow/`, data);
    return response.data;
    // return (
    //   { id: 3, name: 'test', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called test" }
    // )

  } catch (error) {
    throw error.response.data;
  }
};

export default postWorkflow;
