import React from "react";
import Head from "next/head";
import styles from "@/styles/HomePage.module.css";
import {
  Title,
  Accordion,
  Grid,
  TextInput,
  Textarea,
  Box,
  Button
} from "@mantine/core";
import ProjectTable from "@/components/Layout/boqTable/ProjectTable";

export default function AllProject() {
  return (
    <>
      <Head>
        <title>BOQ Table | Connetwork</title>
      </Head>

      <main className={styles.main}>
        <Title ml="xl">สร้างโปรเจค</Title>
        <Accordion
          variant="contained"
          radius="lg"
          my="xl"
        >
          <Accordion.Item value="prjectInfo">
            <Accordion.Control>ข้อมูลโปรเจค</Accordion.Control>
            <Accordion.Panel p={"md"}>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput label={"ชื่อโปรเจค"} withAsterisk />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput label={"ชื่อลูกค้า"} withAsterisk />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Textarea label={"รายละเอียดโปรเจค"} minRows={6} autosize />
                </Grid.Col>
                <Grid.Col
                  span={6}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "1em",
                  }}
                >
                  <TextInput label={"ช่องทางการติดต่อลูกค้า"} withAsterisk />
                  <TextInput label={"หมายเหตุ"} />
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {/* Table */}
        <Box mt={35} p="sm">
          <ProjectTable />
        </Box>
      </main>
    </>
  );
}
