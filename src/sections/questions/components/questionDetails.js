// components/QuestionDetails.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Button, Link, Divider } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const QuestionDetails = () => {
  const router = useRouter();
  const { data } = router.query;

  const [questionData, setQuestionData] = useState(null);
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    if (data) {
      try {
        // Decode the base64-encoded data
        const decodedData = atob(data);
        // Parse the JSON string to get the question and test data
        const { question, test } = JSON.parse(decodeURIComponent(decodedData));

        // Set the data to the state
        setQuestionData(question);
        setTestData(test);
      } catch (error) {
        console.error('Error decoding or parsing data:', error);
        // Handle error decoding or parsing data if needed
      }
    }
  }, [data]);

  if (!questionData || !testData) {
    // Handle case when data is not available
    return (
      <div>
        Data not found.
      </div>
    );
  }


  return (
    <>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}>
            {testData.name}
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', fontSize: '1.2rem', color: '#666' }}>
                - {testData.level} levels
            </Typography>
        </Typography>

      <Divider sx={{ my: 2 }} />


      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        English Title: {questionData?.questionText?.english}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Persian Title: {questionData?.questionText?.persian || ''}
        </Typography>
      </Box>

      <Typography variant="body1">
        Level: {questionData.level}
      </Typography>

      <Typography variant="body1">
        Type: {questionData.type == '0' ? 'Multiple Choice' : (questionData.type == '1' ? 'Descriptive' : 'Ranged')}
      </Typography>

      {questionData.type == '0' && (
        <Typography variant="body1">
          Number of answers user can choose: {questionData.answerCount}
        </Typography>
      )}

      {questionData.options && questionData.options.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Options:
          </Typography>
          <ul>
            {questionData.options.map((option, index) => (
              <li key={index}>
                {option.english} - {option.persian || 'Not available'}
              </li>
            ))}
          </ul>
        </>
      )}


      {/* <NextLink href={`/questions/editQuestion?data=${encodeURIComponent(data)}`} passHref>
        <Link underline="none">
          <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
            Edit Question
          </Button>
        </Link>
      </NextLink> */}
    </>
  );
};

export default QuestionDetails;
