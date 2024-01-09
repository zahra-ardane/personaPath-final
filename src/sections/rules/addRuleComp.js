import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Button, MenuItem, Select, Typography, TextField,
  Card, CardContent, RadioGroup, FormControlLabel, Radio, Unstable_Grid2 as Grid
} from '@mui/material';
import { styled } from '@mui/system';

// ** API imports
import getTestById from '../tests/api/getTestById';
import getQuestions from '../questions/api/getQuestions';

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const AddRule = () => {

  const router = useRouter();
  const { testId } = router.query;

  const [values, setValues] = useState({
    report: {
      english: '',
      persian: ''
    },
    type: 0,
    groupSize: 3,
  });
  const [test, setTest] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conditions, setConditions] = useState([{ question: null, option: null, optionNo: null }]);
  const [initialQuestionsFetched, setInitialQuestionsFetched] = useState(false);

  const filteredQuestions = questions.filter((question) => question.type === 0);


  useEffect(() => {
    const fetchTest = async () => {
      try {
        const test = await getTestById(testId);
        setTest(test);
      } catch (error) {
        console.log('error while fetching test', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, []);

  useEffect(() => {
    const fetchQuesitons = async () => {
      try {
        const questions = await getQuestions(testId);
        setQuestions(questions);
      } catch (error) {
        console.log('error while fetching questions', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuesitons();
  }, [test]);


  useEffect(() => {
    // Set default values for each condition based on the first elements available
    if (!initialQuestionsFetched && filteredQuestions.length > 0) {
      setConditions((prevConditions) => [
        { question: filteredQuestions[0], option: filteredQuestions[0].options[0], optionNo: 0 },
        { question: filteredQuestions[0], option: filteredQuestions[0].options[0], optionNo: 0 },
      ]);
      setInitialQuestionsFetched(true);
    }
  }, [filteredQuestions, initialQuestionsFetched]);

  const addCondition = () => {
    setConditions((prevConditions) => [
      ...prevConditions,
      { question: filteredQuestions[0], option: filteredQuestions[0].options[0], optionNo: 0 },
    ]);
  };

  const handleConditionQuestionChange = (event, index) => {
    const selectedQuestionId = event.target.value;
    const question = filteredQuestions.find((q) => q.id === selectedQuestionId);

    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      updatedConditions[index] = {
        question,
        option: question?.options[0] || null,
        optionNo: question ? 0 : null,
      };
      return updatedConditions;
    });
  };

  const handleConditionOptionChange = (event, index) => {
    const selectedOptionIndex = event.target.value;

    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      const currentCondition = updatedConditions[index];

      if (currentCondition.question) {
        currentCondition.option = currentCondition.question.options[selectedOptionIndex];
        currentCondition.optionNo = selectedOptionIndex;
      }

      return updatedConditions;
    });
  };

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name.startsWith('report')) {
      const [, language] = name.split('-');
      setValues((prevState) => ({
        ...prevState,
        report: {
          ...prevState.report,
          [language]: value,
        },
      }));
    } else {
      setValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }, []);


  if (!test) {
    return (
      <div>
        Test not found.
      </div>
    );
  }

  console.log("conditions is", conditions);
  console.log("values is", values);


  return (
    <>
      {/* Set the title dynamically to the test's name */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}>
        {test.name}
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', fontSize: '1.2rem', color: '#666' }}>
          - {test.level} levels
        </Typography>
      </Typography>


      <Container>

        <Card variant="outlined" sx={{ backgroundColor: '#e4e9ed' }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Rule Type:
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <RadioGroup
                  aria-label="rule-type"
                  name="type"
                  value={values.type.toString()}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value="0"
                    control={<Radio color="primary" />}
                    label="Individual Questions"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio color="primary" />}
                    label="Grouped Questions"
                  />
                </RadioGroup>
              </Grid>
              {values.type == 1 && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Group Size"
                    name="groupSize"
                    onChange={handleChange}
                    type="number"
                    value={values.groupSize}
                    required
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>


        {/* Display Question and Option labels in a row for the first condition */}
        {conditions.length > 0 && (
          <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 1, marginTop: 2 }}>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                Question:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                Option:
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* Display conditions */}
        {conditions.map((condition, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <Select value={condition.question?.id || ''} onChange={(e) => handleConditionQuestionChange(e, index)}>
                {filteredQuestions.map((question, qIndex) => (
                  <MenuItem key={question.id} value={question.id}>
                    {`${qIndex + 1}. ${question.questionText.english.substring(0, 70)}...`}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <Select
              value={condition.optionNo !== null ? condition.optionNo : ''}
              onChange={(e) => handleConditionOptionChange(e, index)}
              disabled={!condition.question}
              sx={{ marginLeft: "20px" }}
            >
              {condition.question &&
                condition.question.options.map((option, optionIndex) => (
                  <MenuItem key={optionIndex} value={optionIndex}>
                    {`${optionIndex + 1}. ${option.english.substring(0, 70)}...`}
                  </MenuItem>
                ))}
            </Select>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button variant="contained" color="primary" onClick={addCondition}>
            Add Condition
          </Button>
        </div>

        <TextField
          fullWidth
          label="English Report"
          name="report-english"
          onChange={handleChange}
          multiline
          required
          rows={4}
          value={values.report.english}
        />
        <TextField
          fullWidth
          label="Persian Report"
          name="report-persian"
          onChange={handleChange}
          multiline
          required
          rows={4}
          value={values.report.persian}
        />

      </Container>

    </>

  );
};
