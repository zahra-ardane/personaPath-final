import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { PromptList } from 'src/sections/prompts/components/promptListComp';

const Page = () => (
  <>
    <Head>
      <title>
        Your Prompts
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
                Create the prompts of your test here!
            </Typography>
          </div>
          <div>
            <Grid
              xs={12}
              md={6}
              lg={8}
            >
              <PromptList />
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
