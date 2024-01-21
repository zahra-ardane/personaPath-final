// components/workflowDetails.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider, CircularProgress } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import getWorkflow from '../api/getWorkflow';
import getTestById from '../../tests/api/getTestById';
import getPromptById from '../../prompts/api/getPromptById';

const WorkflowDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [workflow, setWorkflow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [routinesLoading, setRoutinesLoading] = useState(true);
  const [renderedRoutines, setRenderedRoutines] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const workflow = await getWorkflow(id);
        setWorkflow(workflow);
      } catch (error) {
        console.log("error fetching workflow ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  const getTestDetailsById = async (testId) => {
    try {
      const testDetails = await getTestById(testId);
      return testDetails;
    } catch (error) {
      console.error("Error fetching test details in workflow ", error);
      return null;
    }
  };

  const getPromptDetailsById = async (promptId) => {
    try {
      const promptDetails = await getPromptById(promptId);
      console.log("this is prompts' details right ?", promptDetails);
      return promptDetails;
    } catch (error) {
      console.error("Error fetching prompt details in workflow", error);
      return null;
    }
  };

  const isValidObjectId = (id) => {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
  };

  useEffect(() => {
    const renderRoutines = async () => {
      const routines = workflow?.routin;
      if (!routines || routines.length === 0) return null;

      const renderedRoutines = await Promise.all(
        routines.map(async (item, index) => {
          const tests = await Promise.all(
            (item?.tests || []).map(async (test, index) => {
              const [testId, testLevel] = test.split('/');
              const testDetails = await getTestDetailsById(testId);
              return (
                <li>
                  <Typography key={index} variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#666' }}>
                    {`${testDetails?.name} - Level ${testLevel}`}
                  </Typography>
                </li>
              );
            })
          );

          const promptYes =
            isValidObjectId(item?.prompt.yes)
              ? `Execute prompt "${(await getPromptDetailsById(item?.prompt.yes))?.title}"`
              : `Jump to routine ${item?.prompt.yes + 1}`;

          const promptNo =
            isValidObjectId(item?.prompt.no)
              ? `Execute prompt "${(await getPromptDetailsById(item?.prompt.no))?.title}"`
              : `Jump to routine ${item?.prompt.no + 1}`;

          return (
            <>
              {
                setRoutinesLoading(false)
              }
              <React.Fragment key={index}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, pl: 2 }}>
                  Routine {item.id + 1}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', pl: 4 }}>
                  Tests:
                </Typography>
                <Typography sx={{ pl: 8, pt: 2 }}>
                  {tests}
                </Typography>

                <Typography sx={{ pl: 4 }}>
                  <span>
                    <Typography component="span" sx={{ fontWeight: 'bold' }}>
                      Prompt:
                    </Typography>
                    <Typography sx={{ pl: 3 }}>
                      If Yes: {promptYes}
                    </Typography>
                    <Typography sx={{ pl: 3 }}>
                      If No: {promptNo}
                    </Typography>
                  </span>
                </Typography>
                <Divider sx={{ my: 2 }} />
              </React.Fragment>
            </>

          );
        })
      );

      setRenderedRoutines(renderedRoutines);
    };

    renderRoutines();
  }, [workflow]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}>
        {workflow?.workflowName}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {!isLoading && !routinesLoading ? (
        renderedRoutines
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default WorkflowDetails;
