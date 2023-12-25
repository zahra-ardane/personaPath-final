// sections/tests/components/TestDetailsMain.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Link } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
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
      const decodedData = atob(data);

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
  
      {/* <TableContainer component={Paper} sx={{ mt: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell align="right">Level</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {question.englishText}
                </TableCell>
                <TableCell align="right">{question.level}</TableCell>
                <TableCell align="right">{question.type}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="primary" sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

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
