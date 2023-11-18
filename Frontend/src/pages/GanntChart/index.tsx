import Head from "next/head";
import styles from "@/styles/HomePage.module.css";
import { Title } from "@mantine/core";

export default function New() {
  return (
    <>
      <Head>
        <title>Gannt Chart | Connetwork Project</title>
      </Head>

      <main className={styles.main}>
        <Title>Gannt Chart</Title>
      </main>
    </>
  );
}
