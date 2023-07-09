import Head from "next/head";
import styles from "@/styles/HomePage.module.css";
import { Title } from "@mantine/core";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>HomePage | Connetwork</title>
      </Head>

      <main className={styles.main}>
        <Title>Dashboard</Title>
      </main>
    </>
  );
}
