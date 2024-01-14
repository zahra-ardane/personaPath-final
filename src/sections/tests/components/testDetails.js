// sections/tests/components/TestDetailsMain.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Button, Link } from '@mui/material';
import getQuestions from '../../questions/api/getQuestions';
import QuestionList from '../../questions/components/questionList';
import NextLink from 'next/link';

const TestDetails = () => {
  const router = useRouter();
  const { id, data } = router.query;

  // State to hold the decoded test data
  const [test, setTest] = useState(null);
  // State to hold questions
  const [questions, setQuestions] = useState([]);
  

  useEffect(() => {
    if (data) {
      // Decode the base64-encoded data
      const decodedData = decodeURIComponent(atob(data));

      // Parse the JSON string to get the test object
      const testObject = JSON.parse(decodedData);

      // Set the test object to the state
      setTest(testObject);

      // Fetch questions for the test
      fetchQuestions(testObject.id);
    }
  }, [data]);

  const fetchQuestions = async (testId) => {
    try {
      const fetchedQuestions = await getQuestions(testId);
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Handle error fetching questions if needed
    }
  };

  if (!test) {
    // Handle case when test is not found
    return (
      <div>
        Test not found.
      </div>
    );
  }



  return (
    <>
      {/* Set the title dynamically to the test's name */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}>
        {test.name}
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', fontSize: '1.2rem', color: '#666' }}>
          - {test.level} levels
        </Typography>
      </Typography>
  
      <Typography variant="body1" sx={{ color: '#777', my: 2 }}>
        {test.about}
      </Typography>

      {/* Ruels section */}
      {/* testData is temporary, later ill call the needed api in getRuleList itself */}
      <NextLink href={`/rules/ruleList/${test.id}`} passHref>
        <Link underline="none">
            Rules
        </Link>
      </NextLink>
  
      {/* Quesiton List */}
      <QuestionList questions={questions} test={test}/>

      {/* encoded data is sent */}
      <NextLink href={`/questions/addQuestion/${test.name}?testData=${encodeURIComponent(data)}`} passHref>
        <Link underline="none">
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, alignSelf: 'left', width: '20%' }}
          >
            Add Question
          </Button>
        </Link>
      </NextLink>

    </>
  );
};

export default TestDetails;
