import Head from "next/head";
import {
  Flex,
  Grid,
  Text,
  Box,
  Card,
  Image,
  Input,
  Tooltip,
  Avatar,
  Title,
  Button,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import styles from "@/styles/HomePage.module.css";

export default function HomePage() {
  const item = [
    {
      id: 1,
      name: "Project 1",
      description: "Project Description",
      image:
        "https://cdn.pixabay.com/photo/2023/06/12/01/22/lotus-8057438_1280.jpg",
    },
    {
      id: 2,
      name: "Project 2",
      description: "Project Description",
      image:
        "https://cdn.pixabay.com/photo/2023/06/14/21/16/flowers-8064007_1280.jpg",
    },
    {
      id: 3,
      name: "Project 3",
      description: "Project Description",
      image:
        "https://cdn.pixabay.com/photo/2023/04/19/12/50/flowers-7937665_1280.jpg",
    },
    {
      id: 4,
      name: "Project 4",
      description: "Project Description",
      image:
        "https://cdn.pixabay.com/photo/2023/04/19/12/50/flowers-7937665_1280.jpg",
    },
    {
      id: 5,
      name: "Project 5",
      description: "Project Description",
      image:
        "https://cdn.pixabay.com/photo/2023/04/19/12/50/flowers-7937665_1280.jpg",
    },
    {
      id: 6,
      name: "Project 6",
      description: "Project Description",
      image:
        "https://cdn.pixabay.com/photo/2023/04/19/12/50/flowers-7937665_1280.jpg",
    },
    {
      id: 7,
      name: "Project 7",
      description: "Project Description",
      image:
        "https://cdn.pixabay.com/photo/2023/04/19/12/50/flowers-7937665_1280.jpg",
    },
  ];

  return (
    <>
      <Head>
        <title>HomePage | Connetwork Project</title>
      </Head>

      <main className={styles.main}>
        <Grid gutter={22}>
          <Grid.Col xs={12}>
            <Flex gap="lg" justify="flex-end" align="center">
              <Input
                icon={<IconSearch size="1.2rem" />}
                placeholder="Serach"
                radius="xl"
                w={500}
              />
              <Avatar src="bg.jpg" radius="xl" />
              <Text fw={600}>Your Name</Text>
            </Flex>
          </Grid.Col>

          <Grid.Col xs={9}>
            <Box
              mah={660}
              p={20}
              sx={(theme) => ({
                backgroundColor: "#fff",
                borderRadius: theme.radius.lg,
              })}
            >
              <Flex gap="lg" align="center">
                <Title order={2}>Your Project</Title>
                <Tooltip label="Add Project" position="right-start">
                  <ActionIcon
                    color="gray"
                    size="xl"
                    variant="default"
                    radius="xl"
                  >
                    <IconPlus size="1.8rem" />
                  </ActionIcon>
                </Tooltip>
              </Flex>

              <ScrollArea scrollbarSize={6} h={580}>
                <Grid gutter={16} mt={8} w={"100%"}>
                  {item.map((item) => (
                    <MyCard key={item.id} item={item} />
                  ))}
                </Grid>
              </ScrollArea>
            </Box>
          </Grid.Col>

          <Grid.Col xs={3} mt={24}>
            <Flex direction="column">
              {/* <Box
                h={300}
                sx={(theme) => ({
                  borderRadius: theme.radius.lg,
                  borderColor: theme.colors.gray[4],
                  borderWidth: 1,
                  borderStyle: "solid",
                })}
              ></Box> */}
              <Image
                maw={300}
                mah={"100%"}
                radius="md"
                src="https://cdn.pixabay.com/photo/2023/04/19/12/50/flowers-7937665_1280.jpg"
              />

              <Title
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  margin: 20,
                }}
              >
                Project name
              </Title>
              <Text fz="xs">
                Project Description. Do you love me tonight?Tell me you love me,
                you love me, you love me tonightIt feels like(Tonight) tell me
                you love me, you love me.
              </Text>

              <Button
                m={20}
                variant="filled"
                color="dark"
                size="md"
                radius="xl"
                uppercase
              >
                E d i t
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </main>
    </>
  );
}

function MyCard({ item }: any) {
  return (
    <>
      <Grid.Col xs={4}>
        <Card shadow="sm" padding="xl" radius="lg">
          <Card.Section>
            <Image src={item.image} height={160} alt="No way!" />
          </Card.Section>

          <Text weight={700} size="lg" mt="md">
            {item.name}
          </Text>

          <Text mt="xs" color="dimmed" size="xs">
            {item.description}
          </Text>
        </Card>
      </Grid.Col>
    </>
  );
}
