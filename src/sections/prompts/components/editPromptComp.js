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
import editPrompt from '../api/editPrompt';

export const EditPrompt = () => {
  const [values, setValues] = useState(null);

  useEffect(() => {
    // Get the prompt data from URL
    const urlParams = new URLSearchParams(window.location.search);
    const encodedPromptData = urlParams.get('data');

    if (encodedPromptData) {
      // Decode the base64 string to a JSON string
      const promptData = atob(encodedPromptData);
      // Parse the JSON string into an object
      const prompt = JSON.parse(promptData);
      // Store the prompt data in state variable
      setValues(prompt);
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

        const data = {
          text: values.text,
          title: values.title
        }

        await editPrompt(values.id, data);

        // Navigate to different routes based on the button clicked
        // if (event.target.innerText === 'Finish') {
        router.push('/prompts/promptList');
        // } else if (event.target.innerText === 'Add Questions') {
        //   router.push('/questions/addQuestion/[id]', `/questions/addQuestion/${values.id}`);
        // }
      } catch (error) {
        console.error('Error submitting prompt:', error);
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
          title="Edit Prompt"
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
                    label="Title"
                    name="title"
                    onChange={handleChange}
                    required
                    value={values.title}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={12}
                >
                  <TextField
                    fullWidth
                    label="Text"
                    name="text"
                    onChange={handleChange}
                    multiline
                    required
                    rows={8}
                    value={values.text}
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
