// pages/editRUle/[id].js
import React from 'react';
import Head from 'next/head';
import { Box, Container, Stack } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { EditRule } from '../../../sections/rules/components/editRuleComp';

const Page = () => (
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
            <EditRule />
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
