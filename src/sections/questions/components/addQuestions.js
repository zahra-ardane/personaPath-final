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
  const test = JSON.parse(decodedData);
  // Parse the test data from the query parameter

  console.log("valeus in AddQuestions:", values);

  

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
              { englishOptionText: '', persianOptionText: '' },
              { englishOptionText: '', persianOptionText: '' },
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
          { englishOptionText: '', persianOptionText: '' }        ],
      }));
    } else {
      // For other types, add a single empty option
      setValues((prevState) => ({
        ...prevState,
        options: [...prevState.options, { englishOptionText: '', persianOptionText: '' }],
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
          englishText: values.englishText,
          persianText: values.persianText,
          level: Number(values.level),
          type: Number(values.type),
          answerCount: values.answerCount,
          options: values.options
        };

        // Call the API to post the question data
        const apiResponse = await postQuestion(test.id, questionData);
        console.log("response data ", apiResponse);
        console.log("event.target is ", event.target.innerText);

        // Navigate based on the button clicked
        if (event.target.innerText === 'Finish') {
          // Go back to the test details page
          const testData = JSON.stringify(test);
          const encodedTestData = btoa(testData);
      
          router.push(`/test/${test.id}?data=${encodedTestData}`);
        } else if (event.target.innerText === 'Save & Add Another') {
          console.log("n save");
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
                      name={`option${index + 1}-englishOptionText`}
                      onChange={handleChange}
                      value={option.englishText}
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
                      name={`option${index + 1}-persianOptionText`}
                      onChange={handleChange}
                      value={option.persianText}
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
