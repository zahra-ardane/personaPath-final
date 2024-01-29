import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { EditQuestion } from '../../../sections/questions/components/editQuestion'

const Page = () => (
  <>
    <Head>
      <title>
        Edit Question
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
              Edit your tests question here!
            </Typography>
          </div>
          <div>
            <Grid
              xs={12}
              md={6}
              lg={8}
            >
              <EditQuestion />
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
