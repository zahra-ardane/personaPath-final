// components/testList.js
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
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import getTestList from '../api/getTestList';
import deleteTest from '../api/deleteTest';
import DeleteTestDialog from './DeleteTestDialog';

export const TestList = () => {
  const router = useRouter();
  const [testList, setTestList] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchTestList = async () => {
      try {
        const tests = await getTestList();
        setTestList(tests);
      } catch (error) {
        // Handle error
      } finally {
        // Set loading to false once the data is fetched
        setIsLoading(false);
      }
    };

    fetchTestList();
  }, []);

  const handleEditClick = (event, test) => {
    // Stop event propagation to prevent the row click event
    event.stopPropagation();

    // Convert the test object to a JSON string
    const testData = JSON.stringify(test);
    // Encode the JSON string to base64
    const encodedTestData = btoa(testData);

    router.push(`/test/editTest?data=${encodedTestData}`);
  };

  const handleAddRuleClick = (event, test) => {
    event.stopPropagation();
    router.push(`/rules/addRule/${test.id}`);
  };

  const handleTestClick = (test) => {
    const testData = JSON.stringify(test);
    const encodedTestData = btoa(testData);

    router.push(`/test/${test.id}?data=${encodedTestData}`);
  };
  

  const handleDeleteClick = (event, test) => {
    event.stopPropagation();
    setSelectedTest(test); // Set the whole test object
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTest(selectedTest.id); // Pass the test ID for deletion

      const tests = await getTestList();
      setTestList(tests);
    } catch (error) {
      // Handle error
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
        <title>Tests</title>
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
              <Typography variant="h4">Tests</Typography>
            </div>
            {isLoading ? (
              // Display a loading message or spinner while fetching data
              <Typography variant="body1">Loading tests...</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testList.map((test) => (
                      <TableRow
                        key={test.id}
                        onClick={() => handleTestClick(test)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row">
                          {test.name}
                        </TableCell>
                        <TableCell align="right">
                          {new Date(test.dateTime).toLocaleString('en-US', {
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
                            color="success"
                            sx={{ mr: 1 }}
                            onClick={(event) => handleAddRuleClick(event, test)}
                          >
                            Add Rule
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={(event) => handleEditClick(event, test)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={(event) => handleDeleteClick(event, test)}
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
            <NextLink href="/test/addTest" passHref>
              <Link underline="none">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, alignSelf: 'left', width: '20%' }}
                >
                  Add Test
                </Button>
              </Link>
            </NextLink>
          </Stack>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      {selectedTest && (
        <DeleteTestDialog
          isOpen={isDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          testName={selectedTest.name} 
        />
      )}
    </>
  );
};