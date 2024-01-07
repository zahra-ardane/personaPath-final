import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Select, Typography } from '@mui/material';
import { styled } from '@mui/system';

// ** API imports
import getTestList from '../tests/api/getTestList';
import getPrompts from '../prompts/api/getPrompts';



const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StepCard = styled('div')(({ theme, type }) => ({
  background: type === 'test' ? theme.palette.primary.main : theme.palette.secondary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));

const StepIcon = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(3),
  marginLeft: theme.spacing(2),
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center', 
  overflow: 'hidden',
}));


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
        <StepCard key={index} style={{ background: step.type === 'test' ? '#e4e9ed' : '#d9cfe6' }}>
          <StepIcon>
            {step.type === 'test' ? (
              <img src="/assets/test.png" alt="Test Icon" style={{ width: '100%', height: '100%' }} />
            ) : (
              <img src="/assets/comment.png" alt="Prompt Icon" style={{ width: '100%', height: '100%' }} />
            )}
          </StepIcon>       
          <Typography variant="h6" sx={{ color: "#07010f", marginRight: "10px" }} >{`${index + 1}.`}</Typography>
          <Select
            value={step.type}
            onChange={(e) => handleStepTypeChange(e, index)}
            disabled={index === 0 || index === steps.length - 1}
            style={{ margin: '0 10px' }}
          >
            <MenuItem value="test">Test</MenuItem>
            <MenuItem value="prompt" disabled={index === steps.length - 1}>
              Prompt
            </MenuItem>
          </Select>
          <Select
            value={step.data}
            onChange={(e) => handleDataChange(e, index)}
            style={{ margin: '0 10px' }}
          >
            {step.type === 'test'
              ? testList.map((test, i) => {
                  if (test.level > 1) {
                    const levels = Array.from({ length: test.level }, (_, j) => j + 1);
                    return levels.map((level) => (
                      <MenuItem key={`${i}-${level}`} value={`${test.name} - Level ${level}`}>
                        {`${test.name} - Level ${level}`}
                      </MenuItem>
                    ));
                  } else {
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
        </StepCard>
      ))}
      <Button variant="contained" onClick={handleAddStep}>
        New Step
      </Button>
    </Container>
  );
};


