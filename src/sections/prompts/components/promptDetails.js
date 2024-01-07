// components/promptDetails.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { useRouter } from 'next/router';

const PromptDetails = () => {
  const router = useRouter();
  const { data } = router.query;

  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    if (data) {
      try {
        // Decode the base64-encoded data
        const decodedData = atob(data);
        // Parse the JSON string to get the prompt data
        const prompt = JSON.parse(decodeURIComponent(decodedData));

        setPrompt(prompt);
      } catch (error) {
        console.error('Error decoding or parsing data:', error);
      }
    }
  }, [data]);

  if (!prompt) {
    return (
      <div>
        Data not found.
      </div>
    );
  }


  return (
    <>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        {prompt.title}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Text: 
      </Typography>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        {prompt.text}
      </Typography>

    </>
  );
};

export default PromptDetails;
