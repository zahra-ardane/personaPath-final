// pages/questions/questionDetails.js
import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import QuestionDetails from '../../sections/questions/components/questionDetails'; // Import the QuestionDetails component

const QuestionDetailsPage = () => (
  <>
    <Head>
      <title>Question Details</title>
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
            <Typography variant="h4">
              Question Details
            </Typography>
          </div>
          <div>
            <Grid
              xs={12}
              md={6}
              lg={8}
            >
              <QuestionDetails />
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

QuestionDetailsPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default QuestionDetailsPage;
