import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Button, Group, Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
    },
  });

  const handleLogin = () => {
    notifications.show({
      withCloseButton: true,
      onClose: () => console.log('unmounted'),
      onOpen: () => console.log('mounted'),
      autoClose: 5000,
      title: "เข้าสู่ระบบสำเร็จ!",
      message: 'Hey there, your code is awesome! 🤥',
      color: 'green',
      loading: false,
    });
    router.push("/HomePage");
  };

  return (
    <>
      <Head>
        <title>Connetwork Project</title>
        <meta name="description" content="Create by Suchanart" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main}`}>
        <p className={styles.subtitle}>Welcome to</p>
        <h1 className={styles.title}>Connetwork</h1>
        <Box className={styles.box}>
          <TextInput
            label="Username"
            placeholder="640xxxx"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            mt="md"
            label="Password"
            placeholder="******"
            {...form.getInputProps("password")}
          />

          <Group position="center" mt="lg" px="lg">
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 60 }}
              onClick={() => {
                handleLogin();
              }}
            >
              Login
            </Button>
          </Group>
        </Box>
      </main>
    </>
  );
}
