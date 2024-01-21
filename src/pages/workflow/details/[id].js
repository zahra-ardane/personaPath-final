// pages/workflow/[id].js
import React from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import WorkflowDetails from '../../../sections/workflow/components/workflowDetails';

const page = () => (
  <>
    <Head>
      {/* Remove the title from here, it will be set dynamically in the addRule component */}
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
            <WorkflowDetails />
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default page;
