// api/editRule.js
import axiosInstance from '../../../lib/axiosInstance';

const editRule = async (data, testId, ruleId) => {
  try {
    console.log("data being sent in editRule is ", data);

    const response = await axiosInstance.put(`/rules/updateRuleById/${ruleId}/${testId}`, data);
    return response.data;
    // return (
    //   { id: 3, name: 'test', created: '2023-11-04 12:56', levels: '2', about: "This is a personality test called test" }
    // )

  } catch (error) {
    throw error.response.data;
  }
};

export default editRule;
