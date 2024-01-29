// pages/test/[id].js
import React from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import RuleDetails from '../../../sections/rules/components/ruleDetails';

const page = () => (
  <>
    <Head>
      <title>
        Rule Details
      </title>
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
