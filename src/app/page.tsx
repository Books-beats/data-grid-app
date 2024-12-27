import Head from "next/head";
import { NuqsAdapter } from "nuqs/adapters/next";
import Grid from "./components/Grid";

const Home = () => {
  return (
    <>
      <NuqsAdapter>
        <Head>
          <title>Data Grid Application</title>
        </Head>
        <main>
          <h1>Data Grid Application</h1>
          <Grid />
        </main>
      </NuqsAdapter>
    </>
  );
};

export default Home;
