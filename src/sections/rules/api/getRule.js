// api/getRule.js
import axiosInstance from '../../../lib/axiosInstance';

const getRule = async (ruleId, testId) => {
  try {
    // console.log("test id in getQuestions ", testId);
    const response = await axiosInstance.get(`/rules/getRuleById/${ruleId}/${testId}`);
    return response.data;

  } catch (error) {
    throw error;
  }
};

export default getRule;

