// api/editWorkflow.js
import workflowAxiosInstance from '../../../lib/workflowAxiosInstance';

const editWorkflow = async (data, id) => {
  try {
    // console.log("data being sent in editWorkflow is ", data);
    // console.log("id being sent in editWorkflow is ", id);

    const response = await workflowAxiosInstance.put(`/UpdateWorkflow/${id}`, data);
    return response.data;
    // return (
    //   { id: 3, name: 'test', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called test" }
    // )

  } catch (error) {
    throw error.response.data;
  }
};

export default editWorkflow;
