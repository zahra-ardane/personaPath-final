import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Button, MenuItem, Select, Typography, TextField, CircularProgress, Box,
  Card, CardContent, RadioGroup, FormControlLabel, Radio, Unstable_Grid2 as Grid
} from '@mui/material';
import { styled } from '@mui/system';

// ** API imports
import getTestById from '../../tests/api/getTestById';
import getQuestions from '../../questions/api/getQuestions';
import editRule from '../api/editRule'

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const EditRule = () => {

  const router = useRouter();
  const { testId, data } = router.query;

  const [values, setValues] = useState({
    report: {
      english: '',
      persian: ''
    },
    type: 0,
    groupSize: 3,
    levelQuestions: 1,
  });
  const [test, setTest] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conditions, setConditions] = useState([{ question: [], option: { english: '', persian: '' }, optionNo: null }]);
  const [rule, setRule] = useState(null);
  const [initialData, setInitialData] = useState(null);

  const [groupedQuestions, setGroupedQuestions] = useState([]);


  const filteredQuestions = questions.filter((question) => question.type == 0 && question.level == values.levelQuestions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const test = await getTestById(testId);
        setTest(test);

        const questions = await getQuestions(testId);
        setQuestions(questions);

        // Both test and questions have been loaded, set isLoading to false
        setIsLoading(false);
      } catch (error) {
        console.log('Error while fetching data', error);
        setIsLoading(false); // Handle error and set isLoading to false
      }
    };

    fetchData();
  }, [testId]);

  useEffect(() => {
    if (data) {
      try {
        // Decode the base64-encoded data
        const decodedData = atob(data);
        // Parse the JSON string to get the question and test data
        const rule = JSON.parse(decodeURIComponent(decodedData));

        setConditions(rule.items);
        setValues({
          ...values,
          report: rule.report,
          type: rule.type,
          levelQuestions: rule.levelQuestions
        });

        // Set the data to the state
        setRule(rule);
        setInitialData(rule);
      } catch (error) {
        console.error('Error decoding or parsing data:', error);
      }
    }
  }, [data]);

  useEffect(() => {
    if (initialData) {
      setConditions(initialData.items);
      setValues({
        ...values,
        report: initialData.report,
        type: initialData.type,
        levelQuestions: initialData.levelQuestions
      });
      setInitialData(null)
    } else {
      if (values.type == 1 && filteredQuestions.length > 0) {
        // This is the logic for the second useEffect when initial data has been loaded
        const grouped = [];
        for (let i = 0; i < filteredQuestions.length; i += parseInt(values.groupSize, 10)) {
          grouped.push(filteredQuestions.slice(i, i + parseInt(values.groupSize, 10)));
        }

        const existingOptionNos = [];

        for (let i = 0; i < conditions.length ; i++) {
          existingOptionNos.push(conditions[i].optionNo);
        }

        // Update the groupedQuestions state
        setGroupedQuestions(grouped.map((group, index) => ({
          questions: group,
          optionNo: existingOptionNos[index],
        })));

        // Set default conditions for grouped questions
        setConditions(grouped.map((group, index) => ({
          question: group,
          option: { english: '', persian: '' },
          optionNo: groupedQuestions[index]?.optionNo,
        })));

      }
      else {
        const existingQuestions = [];
        const existingOptions = [];
        const existingOptionNos = [];

        // Extract the first four questions collectively from all conditions
        for (let i = 0; i < conditions.length && existingQuestions.length < 4; i++) {
          const questionsInCondition = conditions[i].question;
          existingOptions.push(conditions[i].option);
          existingOptionNos.push(conditions[i].optionNo);

          // Add each question, option, and optionNo from the condition to the respective arrays
          for (let j = 0; j < questionsInCondition.length && existingQuestions.length < 4; j++) {
            existingQuestions.push(questionsInCondition[j]);
          }
        }

        // Update conditions based on existing questions, options, and optionNos
        setConditions([
          { question: [existingQuestions[0]], option: existingOptions[0], optionNo: existingOptionNos[0] },
          { question: [existingQuestions[1]], option: existingOptions[1], optionNo: existingOptionNos[1] },
          { question: [existingQuestions[2]], option: existingOptions[2], optionNo: existingOptionNos[2] },
          { question: [existingQuestions[3]], option: existingOptions[3], optionNo: existingOptionNos[3] },
        ]);
      }
    }

  }, [questions, values.type, values.groupSize, values.levelQuestions]);

  const addCondition = () => {
    setConditions((prevConditions) => [
      ...prevConditions,
      { question: [filteredQuestions[0]], option: filteredQuestions[0].options[0], optionNo: 0 },
    ]);
  };

  const handleConditionQuestionChange = (event, index) => {
    const selectedQuestionId = event.target.value;
    const question = filteredQuestions.find((q) => q.id == selectedQuestionId);

    setConditions((prevConditions) => {
      const updatedConditions = [...prevConditions];
      updatedConditions[index] = {
        question: [question],
        option: question?.options[0] || { english: '', persian: '' },
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
        if (values.type == 1) {
          currentCondition.option = { english: '', persian: '' };
        } else {
          currentCondition.option = currentCondition.question[0].options[selectedOptionIndex];
        }
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

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        if (!values.report.english) {
          alert('Please fill in the required fields.');
          return;
        }

        const ruleData = {
          items: conditions,
          type: values.type,
          report: values.report,
          levelQuestions: values.levelQuestions
        };

        // Call the API to post the rule
        const createdRule = await editRule(ruleData, testId, rule.id);
        // console.log("edited rule is ", createdRule);

        // router.reload();
        router.push(`/rules/ruleList/${testId}`)

      } catch (error) {
        console.error('Error submitting the test:', error);
        // Handle error feedback to the user if needed
      }
    },
    [values, router, conditions]
  );


  if (!test) {
    return (
      <div>
        Test not found.
      </div>
    );
  }

  // console.log("conditions is", conditions);
  // console.log("values is", values);


  return (
    <>
      {
        !isLoading ?
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
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Test Level"
                        name="levelQuestions"
                        onChange={handleChange}
                        // required
                        select
                        SelectProps={{ native: true }}
                        value={values.levelQuestions}
                      >
                        {/* Dynamically generate options based on test levels */}
                        {Array.from({ length: test.level }).map((_, index) => {
                          const levelValue = test.level - index;
                          return (
                            <option key={levelValue} value={levelValue}>
                              {`Level ${levelValue}`}
                            </option>
                          );
                        })}
                      </TextField>
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
                <Grid container spacing={2} alignItems="center" key={index}>
                  <Grid item xs={6}>
                    {values.type == 0 ? (
                      <Select
                        value={condition?.question[0]?.id || ''}
                        onChange={(e) => handleConditionQuestionChange(e, index)}
                        sx={{ width: '100%' }}
                        MenuProps={{ PaperProps: { style: { maxWidth: '50ch' } } }}
                      >
                        {filteredQuestions.map((question, qIndex) => (
                          <MenuItem key={question.id} value={question.id}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {`${qIndex + 1}. ${question.questionText.english}`}
                            </div>
                          </MenuItem>
                        ))}
                      </Select>

                    ) : (
                      <Select
                        value={condition?.question?.map((q) => q?.id).join(',') || ''}
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value={condition?.question?.map((q) => q?.id).join(',')}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {`Questions ${condition?.question?.map((q, qIndex) => index * values.groupSize + qIndex + 1).join(', ')}`}
                          </div>
                        </MenuItem>
                      </Select>
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    <Select
                      value={condition.optionNo != null ? condition.optionNo : 0}
                      onChange={(e) => handleConditionOptionChange(e, index)}
                      disabled={!condition.question}
                      sx={{ width: '100%' }}
                      MenuProps={{ PaperProps: { style: { maxWidth: '50ch' } } }}
                    >
                      {values.type == 0 ? (
                        condition?.question &&
                        condition?.question[0]?.options.map((option, optionIndex) => (
                          <MenuItem key={optionIndex} value={optionIndex}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {`${optionIndex + 1}. ${option.english}`}
                            </div>
                          </MenuItem>
                        ))
                      ) : (
                        (() => {
                          // Calculate the common minimum number of options across all questions in the condition
                          const commonOptionCount = Math.min(...condition?.question?.map(q => q?.options.length));
                          // Generate menu items for the common options
                          return Array.from({ length: commonOptionCount }, (_, optionIndex) => (
                            <MenuItem key={optionIndex} value={optionIndex}>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {`Option ${optionIndex + 1}`}
                              </div>
                            </MenuItem>
                          ));
                        })()
                      )}
                    </Select>
                  </Grid>
                </Grid>
              ))}


              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, marginTop: 16 }}>
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
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Persian Report"
                name="report-persian"
                onChange={handleChange}
                multiline
                // required
                rows={4}
                value={values.report.persian}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Edit Rule
                </Button>
              </div>

            </Container>
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
