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
  const [steps, setSteps] = useState([{ type: 'test', data: { id: '', name: '' }, level: 0 }, { type: 'prompt', data: { id: '', title: '' }, ifYes: '', ifNo: '' }]);
  const [testList, setTestList] = useState([]);
  const [promptList, setPromptList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [routines, setRoutines] = useState([]);

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


  useEffect(() => {
    const groupStepsIntoRoutines = (steps) => {
      const routines = [];
      let currentRoutine = [];
      steps.forEach((step) => {
        if (step.type === 'test') {
          currentRoutine.push(step);
        } else if (step.type === 'prompt') {
          currentRoutine.push(step);
          routines.push(currentRoutine);
          currentRoutine = []; // Reset currentRoutine for the next routine
        }
      });

      return routines;
    };

    setRoutines(groupStepsIntoRoutines(steps));
  }, [steps]);


  const handleAddStep = () => {
    setSteps((prevSteps) => {
      const lastPromptValue = prevSteps[prevSteps.length - 1].data;
      const lastPromptId = prevSteps[prevSteps.length - 1].id;
      return [
        ...prevSteps.slice(0, -1),
        { type: 'test', data: { id: '', name: '' }, level: 0 },
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
      updatedSteps[index].ifYes = '';
      updatedSteps[index].ifNo = '';
      // updatedSteps[index].jumpTo = '';
    } else {
      updatedSteps[index].level = '';
    }


    setSteps(updatedSteps);
  };

  const handleDataChange = (selectedValue, index) => {
    console.log("selectedVlaue is ", selectedValue);
    console.log("index is ", index);

    const updatedSteps = [...steps];
    const currentStep = updatedSteps[index];

    if (currentStep.type === 'test') {
      const selectedTest = testList.find((test) => test.id === selectedValue);
      currentStep.data = { id: selectedTest.id, name: selectedTest.name }; //, level: selectedTest.level
    } else if (currentStep.type === 'prompt') {
      const selectedPrompt = promptList.find((prompt) => prompt.id === selectedValue);
      currentStep.data = { id: selectedPrompt.id, title: selectedPrompt.title };
    }

    setSteps(updatedSteps);
  };

  const handleIfYesChange = (event, index) => {
    const updatedSteps = [...steps];
    updatedSteps[index].ifYes = event.target.value;
    setSteps(updatedSteps);
  };

  const handleIfNoChange = (event, index) => {
    const updatedSteps = [...steps];
    updatedSteps[index].ifNo = event.target.value;
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
      return [...prevSteps.slice(0, index), ...prevSteps.slice(index + 1)];
    });
  };

  const LevelDropdown = ({ selectedLevel, levels, onSelect }) => (
    <Select
      value={selectedLevel}
      onChange={(e) => onSelect(e.target.value)}
      style={{ margin: '0 10px' }}
    >
      {levels.map((level) => (
        <MenuItem key={level} value={level}>
          {`Level ${level}`}
        </MenuItem>
      ))}
    </Select>
  );

  // Handle level change
  const handleLevelChange = (selectedLevel, index) => {
    const updatedSteps = [...steps];
    const currentStep = updatedSteps[index];

    if (currentStep.type === 'test') {
      currentStep.level = selectedLevel;
    }

    setSteps(updatedSteps);
  };


  console.log("routines are ", routines);
  console.log("values are ", values);


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
      {routines.map((routine, routineIndex) => (
        <div key={routineIndex}>
          {routine.map((step, index) => {
            const adjustedIndex =
              routines.reduce((acc, curr, i) => (i < routineIndex ? acc + curr.length : acc), 0) + index + 1;

            return (
              <React.Fragment key={index}>
                {index === 0 && routineIndex > 0 && (
                  <div style={{ border: '1px solid #000', marginBottom: '10px' }}></div>
                )}
                <StepCard key={index} style={{ background: step.type === 'test' ? '#e4e9ed' : '#d9cfe6' }}>
                  {/* Icon */}
                  <StepIcon>
                    {step.type === 'test' ? (
                      <img src="/assets/test.png" alt="Test Icon" style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <img src="/assets/comment.png" alt="Prompt Icon" style={{ width: '100%', height: '100%' }} />
                    )}
                  </StepIcon>
                  <Typography variant="h6" sx={{ color: '#07010f', marginRight: '10px' }}>
                    {`${adjustedIndex}.`}
                  </Typography>
                  {/* Prompt / Test */}
                  <Select
                    value={step.type}
                    onChange={(e) => handleStepTypeChange(e, adjustedIndex - 1)}
                    disabled={adjustedIndex - 1 === 0 || adjustedIndex - 1 === steps.length - 1}
                    style={{ margin: '0 10px' }}
                  >
                    <MenuItem value="test">Test</MenuItem>
                    <MenuItem
                      value="prompt"
                      disabled={adjustedIndex - 1 === steps.length - 1}
                    >
                      Prompt
                    </MenuItem>
                  </Select>

                  {/* prompt/test options */}
                  {step.type === 'test' ? (
                    <>
                      <Select
                        value={step.data ? step.data.id : ''}
                        onChange={(e) => handleDataChange(e.target.value, adjustedIndex - 1)}
                        style={{ margin: '0 10px' }}
                      >
                        {testList.map((test, i) => (
                          <MenuItem key={i} value={test.id}>
                            {test.name}
                          </MenuItem>
                        ))}
                      </Select>

                      {/* Display level dropdown if the test has more than one level */}
                      {step.data && testList.some((test) => test.id === step.data.id && test.level > 1) && (
                        <LevelDropdown
                          selectedLevel={step.level || 1}
                          levels={Array.from({ length: testList.find((test) => test.id === step.data.id).level }, (_, j) => j + 1)}
                          onSelect={(selectedLevel) => handleLevelChange(selectedLevel, adjustedIndex - 1)}
                        />
                      )}
                    </>
                  ) : (
                    // Prompt options dropdown
                    <Select
                      value={step.data ? step.data.id : ''}
                      onChange={(e) => handleDataChange(e.target.value, adjustedIndex - 1)}
                      style={{ margin: '0 10px' }}
                    >
                      {promptList.map((prompt, i) => (
                        <MenuItem key={i} value={prompt.id}>
                          {prompt.title}
                        </MenuItem>
                      ))}
                    </Select>
                  )}

                  {step.type === 'prompt' && adjustedIndex - 1 !== steps.length - 1 && (
                    <>
                      <Typography sx={{ color: '#07010f', marginRight: '10px', marginLeft: '30px' }}>if yes</Typography>
                      <Select
                        value={step.ifYes}
                        onChange={(e) => handleIfYesChange(e, adjustedIndex - 1)}
                        style={{ margin: '0 10px' }}
                      >
                        {routines.slice(routineIndex + 1).map((jumpToRoutine, jIndex) => (
                          <MenuItem key={jIndex} value={jIndex + routineIndex + 1}>{`Routine ${jIndex + routineIndex + 2}`}</MenuItem>
                        ))}
                      </Select>
                      <Typography sx={{ color: '#07010f', marginRight: '10px', marginLeft: '30px' }}>if no</Typography>
                      <Select
                        value={step.ifNo}
                        onChange={(e) => handleIfNoChange(e, adjustedIndex - 1)}
                        style={{ margin: '0 10px' }}
                      >
                        {routines.slice(routineIndex + 1).map((jumpToRoutine, jIndex) => (
                          <MenuItem key={jIndex} value={jIndex + routineIndex + 1}>{`Routine ${jIndex + routineIndex + 2}`}</MenuItem>
                        ))}
                      </Select>
                    </>
                  )}


                  {adjustedIndex - 1 !== 0 && adjustedIndex - 1 !== steps.length - 1 && ( // Only show delete button for intermediate steps
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteStep(adjustedIndex - 1)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '40px',
                        transform: 'translateY(-50%)', // Center vertically
                        padding: '4px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '50%',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}


                </StepCard>
              </React.Fragment>
            );
          })}
        </div>
      ))}
      <Button variant="contained" onClick={handleAddStep}>
        New Step
      </Button>

    </Container >
  );
};


