// components/QuestionList.js
import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import NextLink from 'next/link';
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

    const tempData = {
      question,
      test
    }

    const encodedQuestionData = btoa(encodeURIComponent(JSON.stringify(tempData)));

    router.push(`/questions/editQuestion?data=${encodedQuestionData}`);
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
      // Handle error
    } finally {
      // Close the delete confirmation dialog
      setDeleteDialogOpen(false);
    }

  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleQuestionClick = (question) => {

    const tempData = {
      question,
      test
    }

    const encodedQuestionData = btoa(encodeURIComponent(JSON.stringify(tempData)));

    router.push(`/questions/details?data=${encodedQuestionData}`);
  };



  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell align="right">Level</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id} onClick={() => handleQuestionClick(question)}>
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
