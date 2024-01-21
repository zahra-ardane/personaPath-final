// api/getWorkflow.js
import workflowAxiosInstance from '../../../lib/workflowAxiosInstance';

const getWorkflow = async (id) => {
  try {
    // console.log("test id in getQuestions ", testId);
    const response = await workflowAxiosInstance.get(`/GetWorkflow/${id}`);
    return response.data;

    // return ([
    //   { id: 1, englishText: 'Question 1', persianText: 'سوال ۱', level: '2', type: "1", options: [] },
    //   { id: 2, englishText: 'Question 2', persianText: '', level: '3', type: "0", options: [{englishText: 'option 1', persianText: 'گزینه ۱'}] }
    // ])

  } catch (error) {
    throw error;
  }
};

export default getWorkflow;

