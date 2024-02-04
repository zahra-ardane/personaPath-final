// components/QuestionDetails.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import getRule from '../api/getRule';

const RuleDetails = () => {
  const router = useRouter();
  const { id, testId } = router.query;

  const [rule, setRule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rule = await getRule(id, testId);
        setRule(rule);

        setIsLoading(false);
      } catch (error) {
        console.error('Error while fetching rule data', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, testId]);


  return (
    <>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}>
        {getRuleTypeString(rule?.type)} Type
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', fontSize: '1.2rem', color: '#666' }}>
          - level {rule?.levelQuestions}
        </Typography>
      </Typography>

      <Divider sx={{ my: 2 }} />

      {rule?.items && rule?.items.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Conditions:
          </Typography>
          <ul>
            {rule?.items?.map((item, index) => (
              <>
                <li key={index}>
                  {item?.question?.map((itemQuestion, index) => (
                    <Typography key={index} variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#666' }}>
                      {itemQuestion.questionText.english}
                    </Typography>
                  ))}
                </li>
                <Typography>
                  <span>
                    <Typography component="span" sx={{ fontWeight: 'bold' }}>
                      Option {item.optionNo + 1}
                    </Typography>
                    {rule?.type == '0'
                      ? "-" + item.option.english || 'Not Available' 
                      : ''
                    }
                  </span>
                </Typography>

                <Divider sx={{ my: 2 }} />
              </>

            ))}
          </ul>
        </>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        English Report:
      </Typography>
      <Typography>
        {rule?.report?.english}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Persian Report:
      </Typography>
      <Typography>
        {rule?.report?.persian}
      </Typography>


    </>
  );
};

export default RuleDetails;
