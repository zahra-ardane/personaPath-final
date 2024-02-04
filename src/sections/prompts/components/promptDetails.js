// components/promptDetails.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { useRouter } from 'next/router';

import getPromptById from '../api/getPromptById';

const PromptDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [prompt, setPrompt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prompt = await getPromptById(id);
        setPrompt(prompt);

        setIsLoading(false);
      } catch (error) {
        console.error('Error while fetching prompt data', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);


  if (!prompt && !isLoading) {
    return (
      <div>
        Data not found.
      </div>
    );
  }


  return (
    <>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        {prompt?.title}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Text: 
      </Typography>
      <Typography sx={{ mb: 2}}>
        {prompt?.text}
      </Typography>

    </>
  );
};

export default PromptDetails;
