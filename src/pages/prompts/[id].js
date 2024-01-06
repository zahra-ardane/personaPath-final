// pages/prompts/[id].js
import React from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import PromptDetails from '../../sections/prompts/components/promptDetails';

const PromptDetailsPage = () => (
  <>
    <Head>
      {/* Remove the title from here, it will be set dynamically in the promptDetails component */}
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <PromptDetails />
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

PromptDetailsPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PromptDetailsPage;
