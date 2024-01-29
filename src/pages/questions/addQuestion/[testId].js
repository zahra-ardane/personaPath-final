import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AddQuestions } from 'src/sections/questions/components/addQuestions';

const Page = () => (
  <>
    <Head>
      <title>
        Create questions
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
              Create your test's questions here!
            </Typography>
          </div>
          <div>
            <Grid
              xs={12}
              md={6}
              lg={8}
            >
              <AddQuestions />
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
