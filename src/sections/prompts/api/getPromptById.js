// api/getPromptById.js
import axiosInstance from '../../../lib/axiosInstance';

const getPromptById = async (id) => {
  try {
    const response = await axiosInstance.get(`/prompt/getPromptById/${id}`); 
    return response.data;

    // return ([
    //     { id: 1, text: 'Prompt one', dateTime: '2023-11-04 12:56' },
    //     { id: 2, text: 'Prompt two', dateTime: '2023-12-12 18:04' }
    // ])

  } catch (error) {
    console.error('Error fetching prompt :', error);
    throw error;
  }
};

export default getPromptById;
