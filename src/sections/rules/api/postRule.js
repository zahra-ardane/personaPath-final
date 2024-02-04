// api/postRule.js
import axiosInstance from '../../../lib/axiosInstance';

const postRule = async (ruleData, testId) => {
  try {
    // console.log("data being sent in createRule is ", ruleData);
    const response = await axiosInstance.post(`/rules/createRules/${testId}`, ruleData);
    return response.data;
    // return (
    //   { id: 3, name: 'test', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called test" }
    // )

  } catch (error) {
    throw error.response.data;
  }
};

export default postRule;
