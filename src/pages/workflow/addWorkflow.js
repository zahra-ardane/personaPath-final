import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AddWorkflow } from '../../sections/workflow/components/addWorkFlowComp'

const Page = () => (
  <>
    <Head>
      <title>
        Create Workflow
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Workflow Creation
            </Typography>
          </div>
          <div>
            <Grid
              xs={12}
              md={6}
              lg={8}
            >
              <AddWorkflow />
            </Grid>
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
