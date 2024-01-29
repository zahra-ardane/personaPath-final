// sections/tests/components/TestDetailsMain.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Button, Link, Card, CardContent, Box, CircularProgress } from '@mui/material';
import getQuestions from '../../questions/api/getQuestions';
import QuestionList from '../../questions/components/questionList';
import NextLink from 'next/link';
import getTestById from '../api/getTestById';

const TestDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const test = await getTestById(id);
        setTest(test);

        fetchQuestions(test?.id);

      } catch (error) {
        console.log('Error while fetching test data', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);


  const fetchQuestions = async (testId) => {
    try {
      const fetchedQuestions = await getQuestions(testId);
      setQuestions(fetchedQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  if (!test && !isLoading) {
    return (
      <div>
        Test not found.
      </div>
    );
  }

  return (
    <>
      {
        !isLoading ?
          <>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}>
              {test?.name}
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', fontSize: '1.2rem', color: '#666' }}>
                - {test?.level} levels
              </Typography>
            </Typography>

            <Typography variant="body1" sx={{ color: '#777', my: 2 }}>
              {test?.about}
            </Typography>

            <Card sx={{ mb: 2, backgroundColor: '#e4e9ed' }}>
              <CardContent>
                <Link href={`/rules/ruleList/${test?.id}`} sx={{ textDecoration: 'none' }}>
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                    Rules
                  </Typography>
                </Link>
              </CardContent>
            </Card>

            {/* Question List */}
            <QuestionList questions={questions} test={test} />

            {/* addQuestion button */}
            <NextLink href={`/questions/addQuestion/${test.id}`} passHref>
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

          : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography variant="h5" gutterBottom>
                Loading
              </Typography>
              <CircularProgress />
            </Box>
          )
      }

    </>
  );
};

export default TestDetails;
