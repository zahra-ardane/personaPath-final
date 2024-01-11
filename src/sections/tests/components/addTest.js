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
import postTest from '../api/postTest';


export const AddTest = () => {
  const [values, setValues] = useState({
    levels: '1',
    testName: '',
    about: ''
  });

  const router = useRouter();

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
  
      try {
        // Check if required fields are filled
        if (!values.testName || !values.levels) {
          // You can provide user feedback here, e.g., show an error message
          // console.error('Please fill in the required fields.');
          alert('Please fill in the required fields.');
          return;
        }
  
        // Your submission logic goes here
        const testData = {
          name: values.testName,
          level: values.levels,
          about: values.about,
        };
  
        // Call the API to post the test data
        const createdTest = await postTest(testData);
  
        // Encode the createdTest object
        const encodedTest = btoa(JSON.stringify(createdTest));
  
        // Navigate to different routes based on the button clicked
        if (event.target.innerText === 'Finish') {
          router.push('/');
        } else if (event.target.innerText === 'Add Questions') {
          // Pass the encoded test data as a route parameter
          router.push('/questions/addQuestion/[testId]', `/questions/addQuestion/${createdTest.id}?testData=${encodeURIComponent(encodedTest)}`);
        }
      } catch (error) {
        console.error('Error submitting the test:', error);
        // Handle error feedback to the user if needed
      }
    },
    [values, router]
  );


  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          title="Personality Test"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Name"
                  name="testName"
                  onChange={handleChange}
                  required  // Make the Name field required
                  value={values.testName}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Number of levels"
                  name="levels"
                  onChange={handleChange}
                  type="number"
                  value={values.levels}
                  required  // Make the Number of levels field required
                  helperText="Number of levels (stages) your test have"
                />
              </Grid>
              <Grid
                xs={12}
                md={12}
              >
                <TextField
                  fullWidth
                  label="About"
                  name="about"
                  onChange={handleChange}
                  multiline
                  rows={4}
                  value={values.about}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Finish
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Add Questions
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};