import React, { useState, useEffect, useCallback } from 'react';
import { Button, MenuItem, Select, Typography, TextField, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';

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
  position: 'relative', // Added for positioning the delete button
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
  const [values, setValues] = useState({
    name: ''
  });
  const [steps, setSteps] = useState([{ type: 'test', data: '' }, { type: 'prompt', data: '', ifCondition: 'yes', jumpTo: '' }]);
  const [testList, setTestList] = useState([]);
  const [promptList, setPromptList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestList = async () => {
      try {
        const tests = await getTestList();
        setTestList(tests);
      } catch (error) {
        console.log('error while fetching tests', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPromptList = async () => {
      try {
        const prompts = await getPrompts();
        setPromptList(prompts);
      } catch (error) {
        console.log('error while fetching prompt list', error);
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
        { type: 'prompt', data: lastPromptValue },
      ];
    });
  };

  const handleStepTypeChange = (event, index) => {
    const updatedSteps = [...steps];
    const newType = event.target.value;

    updatedSteps[index].type = newType;

    updatedSteps[index].data = '';

    // Add default values for ifCondition and jumpTo when changing to 'prompt'
    if (newType === 'prompt') {
      updatedSteps[index].ifCondition = 'yes';
      updatedSteps[index].jumpTo = '';
    }

    setSteps(updatedSteps);
  };

  const handleDataChange = (event, index) => {
    const updatedSteps = [...steps];
    updatedSteps[index].data = event.target.value;
    setSteps(updatedSteps);
  };

  const handleIfConditionChange = (event, index) => {
    const updatedSteps = [...steps];
    updatedSteps[index].ifCondition = event.target.value;
    setSteps(updatedSteps);
  };

  const handleJumpToChange = (event, index) => {
    const updatedSteps = [...steps];
    updatedSteps[index].jumpTo = event.target.value;
    setSteps(updatedSteps);
  };

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleDeleteStep = (index) => {
    setSteps((prevSteps) => {
      // Remove the step at the given index
      return [...prevSteps.slice(0, index), ...prevSteps.slice(index + 1)];
    });
  };

  console.log("steps are ", steps);


  return (
    <Container>
      <TextField sx={{ marginBottom: '20px' }}
        fullWidth
        label="Workflow Name"
        name="name"
        onChange={handleChange}
        required
        value={values.name}
      />
      {steps.map((step, index) => (
        <StepCard key={index} style={{ background: step.type === 'test' ? '#e4e9ed' : '#d9cfe6' }}>

          {/* Icon */}
          <StepIcon>
            {step.type === 'test' ? (
              <img src="/assets/test.png" alt="Test Icon" style={{ width: '100%', height: '100%' }} />
            ) : (
              <img src="/assets/comment.png" alt="Prompt Icon" style={{ width: '100%', height: '100%' }} />
            )}
          </StepIcon>
          <Typography variant="h6" sx={{ color: '#07010f', marginRight: '10px' }}>{`${index + 1}.`}</Typography>

          {/* Prompt / Test */}
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

          {/* prompt/test options */}
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
          {step.type === 'prompt' && index !== steps.length - 1 && (
            <>
              <Typography sx={{ color: '#07010f', marginRight: '10px', marginLeft: '30px' }}>if</Typography>
              <Select
                value={step.ifCondition}
                onChange={(e) => handleIfConditionChange(e, index)}
                style={{ margin: '0 10px' }}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
              <Select
                value={step.jumpTo}
                onChange={(e) => handleJumpToChange(e, index)}
                style={{ margin: '0 10px' }}
              >
                {steps.slice(index + 1).map((jumpToStep, jIndex) => (
                  <MenuItem key={jIndex} value={jIndex + index + 2}>{`Step ${jIndex + index + 2}`}</MenuItem>
                ))}
              </Select>
            </>
          )}

          {index !== 0 && index !== steps.length - 1 && ( // Only show delete button for intermediate steps
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteStep(index)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '40px',
                transform: 'translateY(-50%)', // Center vertically
                padding: '4px', // Adjust padding as needed
                background: 'rgba(255, 255, 255, 0.8)', // Add a background for better visibility
                borderRadius: '50%', // Make it circular
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}


        </StepCard>
      ))
      }
      <Button variant="contained" onClick={handleAddStep}>
        New Step
      </Button>
    </Container >
  );
};


