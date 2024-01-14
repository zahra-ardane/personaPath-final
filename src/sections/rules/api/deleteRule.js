// api/deleteTest.js
import axiosInstance from '../../../lib/axiosInstance';

const deleteRule = async (ruleId) => {
  try {
    // console.log("in delete rule api", questionId);
    await axiosInstance.delete(`/rules/deleteRuleById/${ruleId}`);
  } catch (error) {
    console.error('Error deleting rule:', error);
    throw error;
  }
};

export default deleteRule;
