// components/QuestionList.js
import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteQuestionDialog from './DeleteQuestionDialog';
import deleteQuestion from '../api/deleteQuestion'
import { useRouter } from 'next/router';

const QuestionList = ({ questions, test }) => {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 0:
        return 'Multiple Choice';
      case 1:
        return 'Descriptive';
      case 2:
        return 'Ranged';
      default:
        return 'Unknown';
    }
  };

  const handleEditClick = (event, question, test) => {
    event.stopPropagation();
    router.push(`/questions/editQuestion/${question.id}?testId=${test.id}`);
  };

  const handleDeleteClick = (event, question, test) => {
    event.stopPropagation();
    setSelectedQuestion(question);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteQuestion(selectedQuestion.id);

      router.reload()
    } catch (error) {
      console.error("error deleting data", error);
    } finally {
      // Close the delete confirmation dialog
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // open question's details page
  const handleQuestionClick = (question) => {
    router.push(`/questions/details/${question?.id}?testId=${test?.id}`);
  };


  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%' }}>Index</TableCell>
              <TableCell>Question</TableCell>
              <TableCell align="right" sx={{ width: '5%' }}>Level</TableCell>
              <TableCell align="right" sx={{ width: '15%' }}>Type</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question, index) => (
              <TableRow key={question.id} onClick={() => handleQuestionClick(question)}>
                <TableCell sx={{ width: '5%' }}>{index + 1}</TableCell>
                <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {question?.questionText?.english}
                </TableCell>
                <TableCell align="right">{question.level}</TableCell>
                <TableCell align="right">{getQuestionTypeLabel(question.type)}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={(event) => handleEditClick(event, question, test)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={(event) => handleDeleteClick(event, question, test)}
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
      {selectedQuestion && (
        <DeleteQuestionDialog
          isOpen={isDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          questionName={selectedQuestion?.questionText?.english}
        />
      )}
    </>
  );
};

export default QuestionList;
