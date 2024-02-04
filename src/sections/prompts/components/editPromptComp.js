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
import getPromptById from '../api/getPromptById';

export const EditPrompt = () => {

  const router = useRouter();
  const { id } = router.query;

  const [values, setValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prompt = await getPromptById(id);
        setValues(prompt);

        setIsLoading(false);
      } catch (error) {
        console.error('Error while fetching prompt data', error);
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

        const data = {
          text: values.text,
          title: values.title
        }

        await editPrompt(values.id, data);

        router.reload();
        // router.push('/prompts/promptList');
      } catch (error) {
        console.error('Error editting prompt:', error);
      }
    },
    [values, router]
  );

  return (
    <>
      {!isLoading ? (
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
                        value={values?.title}
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
                        value={values?.text}
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
            </CardActions>
          </Card>
        </form>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  );

}
