// api/getWorkflowList.js
import workflowAxiosInstance from '../../../lib/workflowAxiosInstance';

const getWorkflowList = async () => {
  try {
    const response = await workflowAxiosInstance.get('/GetWorkflows/'); 
    // console.log("tests are ", response.data);
    return response.data;

    // return ([
    //     { id: 1, name: 'Personality Test 1', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called personality test 1" },
    //     { id: 2, name: 'Personality Test 2', created: '2023-12-12 18:04', levels: '3', about: "This is a personality test called personality test 2" }
    // ])

  } catch (error) {
    console.error('Error fetching workflow list:', error);
    throw error;
  }
};

export default getWorkflowList;
