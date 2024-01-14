// pages/test/[id].js
import React from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import RuleDetails from '../../../sections/rules/components/ruleDetails';

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
            {/* The title is now set dynamically in the addRule component */}
          </div>
          <div>
            <RuleDetails />
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
