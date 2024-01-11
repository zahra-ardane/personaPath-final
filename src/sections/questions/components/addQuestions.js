import { useCallback, useState } from 'react';
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
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import postQuestion from '../api/postQuestion';


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

export const AddQuestions = () => {
  const [values, setValues] = useState({
    level: 1,
    type: 1,
    englishText: '',
    persianText: '',
    answerCount: 1,
    options: [], 
  });
  
  const router = useRouter();
  const { testData } = router.query;

  // Decode the base64-encoded data
  const decodedData = atob(testData);

  // Parse the JSON string to get the test object
  const test = JSON.parse(decodeURIComponent(decodedData));
  // Parse the test data from the query parameter
  

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
      } else {
        setValues((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    },
    [values.type, values.options]
  );
  

  const handleAddOption = () => {
    // Add two new empty options to the options array for multiple choice
    if (values.type === '0') {
      setValues((prevState) => ({
        ...prevState,
        options: [
          ...prevState.options,
          { egnlish: '', persian: '' }        ],
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
  };


  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        // Check if required fields are filled
        if (!values.englishText || !values.level) {
          // You can provide user feedback here, e.g., show an error message
          // console.error('Please fill in the required fields.');
          alert('Please fill in the required fields.');
          return;
        }

        // Your submission logic goes here
        const questionData = {
          // englishText: values.englishText,
          // persianText: values.persianText,
          questionText: {
            english: values.englishText,
            persian: values.persianText
          },
          level: Number(values.level),
          type: Number(values.type),
          answerCount: values.answerCount,
          options: values.options
        };

        // Call the API to post the question data
        const apiResponse = await postQuestion(test.id, questionData);

        // Navigate based on the button clicked
        if (event.target.innerText === 'Finish') {
          // Go back to the test details page
          const testData = JSON.stringify(test);
          const encodedTestData = btoa(testData);
      
          router.push(`/test/${test.id}?data=${encodedTestData}`);
        } else if (event.target.innerText === 'Save & Add Another') {
          // Reload the current page to add another question
          router.reload();
        }
      } catch (error) {
        console.error('Error submitting the question:', error);
        // Handle error feedback to the user if needed
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
          title={`Test ${test?.name}`}
        />
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
                label="English Title"
                name="englishText"
                onChange={handleChange}
                multiline  
                rows={4} 
                required
                value={values.englishText}
              />
            </Grid>
            <Grid 
            xs={12} 
            md={12}
            >
              <TextField
                fullWidth
                label="Persian Title"
                name="persianText"
                onChange={handleChange}
                multiline  
                rows={4}  
                value={values.persianText}
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
                  value={values.level}
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
                  value={values.type}
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

              <Grid
                xs={12}
                md={12}
              >
                {/* Radio buttons for multiple-choice options */}
                {values.type == '0' && (

                  <div>
                    <Typography variant="body1" sx={{ color: '#777', mb: 1 }}>
                      Multiple Choice Type:
                    </Typography>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="multipleChoiceType"
                          value="yesNo"
                          onChange={handleMultipleChoiceType}
                        />
                        Yes/No
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="multipleChoiceType"
                          value="agreeDisagreeNeutral"
                          onChange={handleMultipleChoiceType}
                        />
                        Agree/Disagree/Neutral
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="multipleChoiceType"
                          value="completelyDisagreeAgree"
                          onChange={handleMultipleChoiceType}
                        />
                        Completely Disagree/Disagree/Neutral/Agree/Completely Agree
                      </label>
                    </div>
                  </div>
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
                  value={values.answerCount}
                  helperText="Number of answers user can choose"
                  style={{ display: values.type === '0' ? 'block' : 'none' }}
                />
              </Grid>
              
              {/* Add Option Button */}
              <Grid
                xs={12}
                md={6}
              >
                <Button variant="contained" onClick={handleAddOption} style={{ display: values.type === '0' ? 'block' : 'none' }}>
                  Add Option
                </Button>
              </Grid>
              
              {/* Render Options */}
              {values.options.map((option, index) => (
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
                      value={option.english}
                      style={{ display: values.type === '0' ? 'block' : 'none' }}
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
                      value={option.persian}
                      style={{ display: values.type === '0' ? 'block' : 'none' }}
                    />
                  </Grid>
                </>

                
              ))}

            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Finish
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save & Add Another
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
