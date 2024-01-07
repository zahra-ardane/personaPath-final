import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Select, Typography } from '@mui/material';
import { styled } from '@mui/system';

// ** API imports
import getTestList from '../tests/api/getTestList';
import getPrompts from '../prompts/api/getPrompts';



const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StepContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Step = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& > *': {
      margin: theme.spacing(1), // Add margin to the Select components
    },
  }));
  

const Arrow = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
  fontSize: '1.5rem',
}));



// ... (previous imports and styled components)

export const AddWorkflow = () => {
  const [steps, setSteps] = useState([{ type: 'test', data: '' }, { type: 'prompt', data: '' }]);
  const [testList, setTestList] = useState([]);
  const [promptList, setPromptList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestList = async () => {
      try {
        const tests = await getTestList();
        setTestList(tests);
      } catch (error) {
        console.log("error while fetching tests", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPromptList = async () => {
      try {
        const prompts = await getPrompts();
        setPromptList(prompts);
      } catch (error) {
        console.log("error while fetching prompt list", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestList();
    fetchPromptList();
  }, []);

  const handleAddStep = () => {
    setSteps((prevSteps) => {
      const lastPromptValue = prevSteps[prevSteps.length - 1].data;
      return [
        ...prevSteps.slice(0, -1),
        { type: 'test', data: '' },
        { type: 'prompt', data: lastPromptValue }, // Retain the last prompt value
      ];
    });
  };

  const handleStepTypeChange = (event, index) => {
    const updatedSteps = [...steps];
    updatedSteps[index].type = event.target.value;

    // Clear the data when changing the type
    updatedSteps[index].data = '';

    setSteps(updatedSteps);
  };

  const handleDataChange = (event, index) => {
    const updatedSteps = [...steps];
    updatedSteps[index].data = event.target.value;
    setSteps(updatedSteps);
  };

  return (
    <Container>
      {steps.map((step, index) => (
        <StepContainer key={index}>
          <Step>
            <Select
              value={step.type}
              onChange={(e) => handleStepTypeChange(e, index)}
              disabled={index === 0 || index === steps.length - 1}
            >
              <MenuItem value="test">Test</MenuItem>
              <MenuItem value="prompt" disabled={index === steps.length - 1}>
                Prompt
              </MenuItem>
            </Select>
            <Select value={step.data} onChange={(e) => handleDataChange(e, index)}>
              {step.type === 'test'
                ? testList.map((test, i) => {
                    if (test.level > 1) {
                      // Display multiple levels as separate options
                      const levels = Array.from({ length: test.level }, (_, j) => j + 1);
                      return levels.map((level) => (
                        <MenuItem key={`${i}-${level}`} value={`${test.name} - Level ${level}`}>
                          {`${test.name} - Level ${level}`}
                        </MenuItem>
                      ));
                    } else {
                      // Display single level option
                      return (
                        <MenuItem key={i} value={test.name}>
                          {test.name}
                        </MenuItem>
                      );
                    }
                  })
                : promptList.map((prompt, i) => (
                    <MenuItem key={i} value={prompt.title}>
                      {prompt.title}
                    </MenuItem>
                  ))}
            </Select>
          </Step>
          {index < steps.length - 1 && <Arrow variant="h5">&#8595;</Arrow>}
        </StepContainer>
      ))}
      <Button variant="contained" onClick={handleAddStep}>
        New Step
      </Button>
    </Container>
  );
};





