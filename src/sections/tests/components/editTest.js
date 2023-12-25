import React, { useCallback, useState, useEffect } from 'react';
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
  Unstable_Grid2 as Grid
} from '@mui/material';
import editTest from '../api/editTest';

export const EditTest = () => {
  const [values, setValues] = useState(null);

  useEffect(() => {
    // Get the test data from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const encodedTestData = urlParams.get('data');

    if (encodedTestData) {
      // Decode the base64 string to a JSON string
      const testData = atob(encodedTestData);

      // Parse the JSON string into an object
      const test = JSON.parse(testData);

      // Store the test data in the testData state variable
      setValues(test);
    }
  }, []);

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
        // Your submission logic goes here
        const testData = {
          id: values.id,
          name: values.name,
          // levels: values.levels,
          //change back later
          level: values.level,
          about: values.about,
        };

        // Call the API to post the test data
        await editTest(testData);

        // Navigate to different routes based on the button clicked
        if (event.target.innerText === 'Finish') {
          router.push('/');
        } else if (event.target.innerText === 'Add Questions') {
          router.push('/questions/addQuestion/[id]', `/questions/addQuestion/${values.id}`);
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
        {values ? (
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
                    name="name"
                    onChange={handleChange}
                    required
                    value={values.name}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Number of levels *"
                    name="level"
                    onChange={handleChange}
                    type="number"
                    value={values.level}
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
          {/* <Button variant="contained" onClick={handleSubmit}>
            Edit Questions
          </Button> */}
        </CardActions>
      </Card>
    </form>
  );
};
