// api/deleteTest.js
import axiosInstance from '../../../lib/axiosInstance';

const deleteRule = async (ruleId, testId) => {
  try {
    // console.log("in delete rule api", questionId);
    await axiosInstance.delete(`/rules/deleteRuleById/${ruleId}/${testId}`);
  } catch (error) {
    console.error('Error deleting rule:', error);
    throw error;
  }
};

export default deleteRule;
