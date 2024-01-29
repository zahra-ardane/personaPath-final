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
import getTestById from '../api/getTestById';

export const EditTest = () => {
  const [values, setValues] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const test = await getTestById(id);
        setValues(test);

      } catch (error) {
        console.log('Error while fetching test data', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
        const testData = {
          id: values.id,
          name: values.name,
          level: values.level,
          about: values.about,
        };

        // Call the API to edit the test data
        await editTest(testData);

        // Navigate to different routes based on the button clicked
        if (event.target.innerText === 'Finish') {
          router.push('/');
        } 
        // else if (event.target.innerText === 'Edit Questions') {
        //   router.push('/questions/editQuestion/[id]', `/questions/editQuestion/${values.id}`);
        // }
      } catch (error) {
        console.error('Error editing the test:', error);
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
          title="Test Information"
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
