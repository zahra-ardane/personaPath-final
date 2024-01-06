// components/promptListComp.js
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import getPrompts from '../api/getPrompts';
import deletePrompt from '../api/deletePrompt';
import DeletePromptDialog from './deletePromptDialog';

export const PromptList = () => {
  const router = useRouter();
  const [promptList, setPromptList] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchPromptList = async () => {
      try {
        const prompts = await getPrompts();
        setPromptList(prompts);
      } catch (error) {
        // Handle error
        console.log("error while fetching prompt list", error);
      } finally {
        // Set loading to false once the data is fetched
        setIsLoading(false);
      }
    };

    fetchPromptList();
  }, []);

  const handleEditClick = (event, prompt) => {
    // Stop event propagation to prevent the row click event
    event.stopPropagation();

    // Convert the prompt object to a JSON string
    const promptData = JSON.stringify(prompt);
    // Encode the JSON string to base64
    const encodedPromptData = btoa(promptData);

    router.push(`/prompts/editPrompt?data=${encodedPromptData}`);
  };

  const handlePromptClick = (prompt) => {
    const promptData = JSON.stringify(prompt);
    const encodedPromptData = btoa(promptData);

    router.push(`/prompts/${prompt.id}?data=${encodedPromptData}`);
  };
  

  const handleDeleteClick = (event, prompt) => {
    event.stopPropagation();
    setSelectedPrompt(prompt);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePrompt(selectedPrompt.id);

      const prompts = await getPrompts();
      setPromptList(prompts);
    } catch (error) {
      console.log("error while deleting promot", error);
    } finally {
      // Close the delete confirmation dialog
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    // Close the delete confirmation dialog without performing deletion
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Head>
        <title>Prompts</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Prompts</Typography>
            </div>
            {isLoading ? (
              // Display a loading message or spinner while fetching data
              <Typography variant="body1">Loading prompts...</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>prompt</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promptList.map((prompt) => (
                      <TableRow
                        key={prompt.id}
                        onClick={() => handlePromptClick(prompt)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row">
                          {prompt.text}
                        </TableCell>
                        <TableCell align="right">
                          {new Date(prompt.dateTime).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={(event) => handleEditClick(event, prompt)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={(event) => handleDeleteClick(event, prompt)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <NextLink href="/prompts/addPrompt" passHref>
              <Link underline="none">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, alignSelf: 'left', width: '20%' }}
                >
                  Add Prompt
                </Button>
              </Link>
            </NextLink>
          </Stack>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      {selectedPrompt && (
        <DeletePromptDialog
          isOpen={isDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          // testName={selectedTest.name} 
        />
      )}
    </>
  );
};