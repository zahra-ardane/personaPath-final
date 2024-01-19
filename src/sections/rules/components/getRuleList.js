// components/RuleList.js
import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box } from '@mui/material';
import DeleteRuleDialog from './deleteRuleDialog';
import deleteRule from '../api/deleteRule'
import getRuleList from '../api/getRuleList'
import { useRouter } from 'next/router';

const RuleList = () => {
  const router = useRouter();
  const [rules, setRules] = useState(null)
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const { testId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rules = await getRuleList(testId);
        setRules(rules);

        setIsLoading(false);
      } catch (error) {
        console.log('Error while fetching rules data', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [testId]);


  const getRuleTypeString = (type) => {
    switch (type) {
      case 0:
        return 'Individual';
      case 1:
        return 'Grouped';
      default:
        return 'Unknown';
    }
  };

  const handleEditClick = (event, rule, test) => {
    event.stopPropagation();

    const tempData = {
      question,
      rule
    }

    const encodedData = btoa(encodeURIComponent(JSON.stringify(tempData)));

    router.push(`/rules/editRule?data=${encodedData}`);
  };

  const handleDeleteClick = (event, rule, test) => {
    event.stopPropagation();
    setSelectedElement(rule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {

    try {
      await deleteRule(selectedElement.id, testId);

      router.reload()

    } catch (error) {
      console.log("error while deleting rule");
    } finally {
      setDeleteDialogOpen(false);
    }

  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleElementClick = (rule) => {
    const encodedData = btoa(encodeURIComponent(JSON.stringify(rule)));

    router.push(`/rules/details/${testId}?data=${encodedData}`);
  };



  return (
    <>
      {
        !isLoading ?
          <>

            {/* Set the title dynamically to the test's name */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}>
              Rules
            </Typography>



            <TableContainer component={Paper} sx={{ mt: 5 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '5%' }}>Index</TableCell>
                    <TableCell>Rule</TableCell>
                    <TableCell align="right" sx={{ width: '5%' }}>Level</TableCell>
                    <TableCell align="right" sx={{ width: '10%' }}>Type</TableCell>
                    <TableCell align="right" sx={{ width: '20%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rules?.map((rule, index) => (
                    <TableRow key={rule.id} onClick={() => handleElementClick(rule)}>
                      <TableCell sx={{ width: '5%' }}>{index + 1}</TableCell>
                      <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {rule?.report?.english}
                      </TableCell>
                      <TableCell align="right">{rule.levelQuestions}</TableCell>
                      <TableCell align="right">{getRuleTypeString(rule.type)}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={(event) => handleEditClick(event, rule)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={(event) => handleDeleteClick(event, rule)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Delete Confirmation Dialog */}
            {selectedElement && (
              <DeleteRuleDialog
                isOpen={isDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
              // questionName={selectedElement?.questionText?.english}
              />
            )}
          </>

          : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography variant="h5" gutterBottom>
                Loading
              </Typography>
              <CircularProgress />
            </Box>
          )
      }

    </>
  );

};

export default RuleList;
