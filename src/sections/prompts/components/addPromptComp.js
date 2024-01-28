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
import postPrompt from '../api/postPrompt';


export const AddPrompt = () => {
  const [values, setValues] = useState({
    text: '',
    title: ''
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
        if (!values?.text || !values?.title) {
          alert('Please fill in the required fields.');
          return;
        }

        // Call the API to post the test data
        const createdPrompt = await postPrompt(values);
        // Encode the createdTest object
        const encodedPrompt = btoa(JSON.stringify(createdPrompt));

        // Navigate to different routes based on the button clicked
        // if (event.target.innerText === 'Finish') {
        //   router.push('/');
        // } else if (event.target.innerText === 'Add Questions') {
          // Pass the encoded test data as a route parameter
        router.push('/prompts/promptList');
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
          title="New Prompt"
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
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Finish
          </Button>
          {/* <Button variant="contained" onClick={handleSubmit}>
            Add Questions
          </Button> */}
        </CardActions>
      </Card>
    </form>
  );
};