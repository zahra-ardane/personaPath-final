// components/QuestionDetails.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Button, Link, Divider } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import getQuestionById from '../api/getQuestionById';
import getTestById from 'src/sections/tests/api/getTestById';

const QuestionDetails = () => {
  const router = useRouter();
  const { id, testId } = router.query;

  const [questionData, setQuestionData] = useState(null);
  const [testData, setTestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const question = await getQuestionById(id);
        setQuestionData(question);

        const test = await getTestById(testId);
        setTestData(test);

        setIsLoading(false);
      } catch (error) {
        console.error('Error while fetching quesiton and test data', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, testId]);

  if ((!questionData || !testData) && !isLoading) {
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
            {testData?.name}
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', fontSize: '1.2rem', color: '#666' }}>
                - {testData?.level} levels
            </Typography>
        </Typography>

      <Divider sx={{ my: 2 }} />


      <Typography sx={{ mb: 2}}>
        English Title: {questionData?.questionText?.english}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Persian Title: {questionData?.questionText?.persian || ''}
        </Typography>
      </Box>

      <Typography variant="body1">
        Level: {questionData?.level}
      </Typography>

      <Typography variant="body1">
        Type: {questionData?.type == '0' ? 'Multiple Choice' : (questionData?.type == '1' ? 'Descriptive' : 'Ranged')}
      </Typography>

      {questionData?.type == '0' && (
        <Typography variant="body1">
          Number of answers user can choose: {questionData?.answerCount}
        </Typography>
      )}

      {questionData?.options && questionData?.options?.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Options:
          </Typography>
          <ul>
            {questionData?.options?.map((option, index) => (
              <li key={index}>
                {option?.english} - {option?.persian || 'Not available'}
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
