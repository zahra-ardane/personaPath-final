import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  CircularProgress,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Unstable_Grid2 as Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import editQuestion from '../api/editQuestion';
import getQuestionById from '../api/getQuestionById';
import getTestById from 'src/sections/tests/api/getTestById';


const questionTypes = [
  {
    value: '1',
    label: 'descriptive'
  },
  {
    value: '0',
    label: 'multiple choice'
  },
  {
    value: '2',
    label: 'ranged'
  }
];

export const EditQuestion = () => {

  const [values, setValues] = useState(null);
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [multipleChoiceType, setMultipleChoiceType] = useState('');
  const [expanded, setExpanded] = useState(false);


  const router = useRouter();
  const { id, testId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const question = await getQuestionById(id);
        setValues(question);

        const test = await getTestById(testId);
        setTest(test);

        setIsLoading(false);
      } catch (error) {
        console.error('Error while fetching quesiton and test data', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, testId]);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      if (name === 'type') {
        // When the question type changes, reset options to an empty array
        setValues((prevState) => ({
          ...prevState,
          type: value,
          options: [],
        }));

        // Automatically add two options for multiple choice
        if (value === '0') {
          setValues((prevState) => ({
            ...prevState,
            options: [
              { english: '', persian: '' },
              { english: '', persian: '' },
            ],
          }));
        }
      } else if (name.startsWith('option')) {
        // Handle changes for individual options
        const [optionIndexStr, language] = name.split('-');
        const optionIndex = parseInt(optionIndexStr.replace('option', ''), 10);
        const updatedOptions = values.options.map((option, index) => {
          if (index === optionIndex - 1) {
            return {
              ...option,
              [language]: value,
            };
          }
          return option;
        });

        setValues((prevState) => ({
          ...prevState,
          options: updatedOptions,
        }));
      } else if (name.startsWith('questionText')) {
        // Handle changes for individual options
        const [questionTextPart, language] = name.split('.');
        setValues((prevState) => ({
          ...prevState,
          [questionTextPart]: {
            ...prevState[questionTextPart],
            [language]: value,
          },
        }));

      } else {
        setValues((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    },
    [values]
  );


  const handleAddOption = () => {
    // Add two new empty options to the options array for multiple choice
    if (values.type === '0') {
      setValues((prevState) => ({
        ...prevState,
        options: [
          ...prevState.options,
          { english: '', persian: '' }],
      }));
    } else {
      // For other types, add a single empty option
      setValues((prevState) => ({
        ...prevState,
        options: [...prevState.options, { english: '', persian: '' }],
      }));
    }
  };

  const handleMultipleChoiceType = (event) => {
    const { value } = event.target;

    // Handle changes based on the selected multiple-choice type
    switch (value) {
      case 'yesNo':
        setValues((prevState) => ({
          ...prevState,
          options: [
            { english: 'Yes', persian: 'بلی' },
            { english: 'No', persian: 'خیر' },
          ],
        }));
        break;
      case 'agreeDisagreeNeutral':
        setValues((prevState) => ({
          ...prevState,
          options: [
            { english: 'Agree', persian: 'موافق' },
            { english: 'Neither Agree nor Disagree', persian: 'خنثی' },
            { english: 'Disagree', persian: 'مخالف' },
          ],
        }));
        break;
      case 'completelyDisagreeAgree':
        setValues((prevState) => ({
          ...prevState,
          options: [
            { english: 'Strongly Disagree', persian: 'کاملاً مخالف' },
            { english: 'Disagree', persian: 'مخالف' },
            { english: 'Neither Agree nor Disagree', persian: 'خنثی' },
            { english: 'Agree', persian: 'موافق' },
            { english: 'Strongly Agree', persian: 'کاملاً موافق' },
          ],
        }));
        break;
      default:
        // Default case: Add a generic empty option
        setValues((prevState) => ({
          ...prevState,
          options: [
            { english: '', persian: '' },
          ],
        }));
    }

    setMultipleChoiceType(value);
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        // Check if required fields are filled
        if (!values?.questionText?.english || !values?.level) {
          alert('Please fill in the required fields.');
          return;
        }

        const questionData = {
          // englishText: values.englishText,
          // persianText: values.persianText,
          questionText: values.questionText,
          level: Number(values.level),
          type: Number(values.type),
          answerCount: Number(values.answerCount),
          options: values.options
        };

        // Call the API to post the question data
        const apiResponse = await editQuestion(values.id, questionData);

        // Navigate based on the button clicked
        if (event.target.innerText === 'Finish') {
          router.push(`/test/${test.id}`);
        }

      } catch (error) {
        console.error('Error submitting the question:', error);
      }
    },
    [values, test, router]
  );


  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          title={`${test?.name}`}
        />
        {values ? (
          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={12}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="English Title"
                    name="questionText.english"
                    onChange={handleChange}
                    required
                    value={values?.questionText?.english}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={12}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Persian Title"
                    name="questionText.persian"
                    onChange={handleChange}
                    value={values?.questionText?.persian}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Question Level"
                    name="level"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values?.level}
                  >
                    {/* Dynamically generate options based on test levels */}
                    {Array.from({ length: test?.level }).map((_, index) => {
                      const levelValue = test?.level - index;
                      return (
                        <option key={levelValue} value={levelValue}>
                          {`Level ${levelValue}`}
                        </option>
                      );
                    })}
                  </TextField>

                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Question Type"
                    name="type"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values?.type}
                  >
                    {questionTypes.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid xs={12} md={12}>
                  {/* Radio buttons for multiple-choice options */}
                  {values?.type == '0' && (
                    <Accordion expanded={expanded} onChange={handleAccordionChange}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ fontSize: 32 }} />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          Multiple Choice Option Type
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {values?.type == '0' && (
                          <div>
                            <RadioGroup
                              name="multipleChoiceType"
                              value={multipleChoiceType}
                              onChange={handleMultipleChoiceType}
                            >
                              <FormControlLabel
                                value="yesNo"
                                control={<Radio />}
                                label="Yes/No"
                              />
                              <FormControlLabel
                                value="agreeDisagreeNeutral"
                                control={<Radio />}
                                label="Agree/Disagree/Neutral"
                              />
                              <FormControlLabel
                                value="completelyDisagreeAgree"
                                control={<Radio />}
                                label="Completely Disagree/Disagree/Neutral/Agree/Completely Agree"
                              />
                            </RadioGroup>
                          </div>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Number of Answers"
                    name="answerCount"
                    onChange={handleChange}
                    type="number"
                    value={values?.answerCount}
                    helperText="Number of answers user can choose"
                    style={{ display: values?.type == '0' ? 'block' : 'none' }}
                  />
                </Grid>
                {/* Add Option Button */}
                <Grid
                  xs={12}
                  md={6}
                >
                  <Button variant="contained" onClick={handleAddOption} style={{ display: values?.type == '0' ? 'block' : 'none' }}>
                    Add Option
                  </Button>
                </Grid>

                {/* Render Options */}
                {values?.options?.map((option, index) => (
                  <>
                    <Grid
                      key={`${index}-english`}
                      xs={12}
                      md={6}
                    >
                      <TextField
                        fullWidth
                        label={`Option ${index + 1} - English`}
                        name={`option${index + 1}-english`}
                        onChange={handleChange}
                        value={option?.english}
                        style={{ display: values?.type == '0' ? 'block' : 'none' }}
                      />
                    </Grid>
                    <Grid
                      key={`${index}-persian`}
                      xs={12}
                      md={6}
                    >
                      <TextField
                        fullWidth
                        label={`Option ${index + 1} - Persian`}
                        name={`option${index + 1}-persian`}
                        onChange={handleChange}
                        value={option?.persian}
                        style={{ display: values?.type == '0' ? 'block' : 'none' }}
                      />
                    </Grid>
                  </>

                ))}

              </Grid>
            </Box>
          </CardContent>
        ) : (
          <CardContent>
            <CircularProgress />
          </CardContent>
        )}
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Finish
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
