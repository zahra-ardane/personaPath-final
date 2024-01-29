// components/workflowList.js
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
import getWorkflowList from '../api/getWorkflowList';
import deleteWorkflow from '../api/deleteWorkflow';
import DeleteWorkflowDialog from './deleteWorkflowDialog';

export const WorkflowList = () => {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchList = async () => {
      try {
        const workflows = await getWorkflowList();
        setList(workflows);
      } catch (error) {
        console.log("error fetching workflow list", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchList();
  }, []);

  const handleEditClick = (event, item) => {
    // Stop event propagation to prevent the row click event
    event.stopPropagation();
    router.push(`/workflow/edit/${item._id}`);
  };

  const handleItemClick = (item) => {
    router.push(`/workflow/details/${item._id}`);
  };

  const handleDeleteClick = (event, item) => {
    event.stopPropagation();
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteWorkflow(selectedItem._id);

      const data = await getWorkflowList();
      setList(data);
    } catch (error) {
      console.log("error deleting workflow", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    // Close the delete confirmation dialog without performing delete action
    setDeleteDialogOpen(false);
  };

  // console.log("this is list ", list);

  return (
    <>
      <Head>
        <title>Workflows</title>
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
              <Typography variant="h4">Workflows</Typography>
            </div>
            {isLoading ? (
              // Display a loading message or spinner while fetching data
              <Typography variant="body1">Loading workflows...</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Routines</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => (
                      <TableRow
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row">
                          {item.workflowName}
                        </TableCell>
                        <TableCell align="right">
                          {item.routin.length}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={(event) => handleEditClick(event, item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={(event) => handleDeleteClick(event, item)}
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
            <NextLink href="/workflow/addWorkflow" passHref>
              <Link underline="none">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, alignSelf: 'left', width: '20%' }}
                >
                  Add Workflow
                </Button>
              </Link>
            </NextLink>
          </Stack>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      {selectedItem && (
        <DeleteWorkflowDialog
          isOpen={isDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          name={selectedItem.workflowName}
        />
      )}
    </>
  );
};