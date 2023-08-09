import React, { use, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import User from "../models/User";
import { useUserStore } from "@/lib/userStore";
import {
  Box,
  Text,
  Flex,
  Title,
  Group,
  Button,
  TextInput,
  Notification,
  PasswordInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  const user: User | null = useUserStore((state) => state.user);
  const username = useUserStore((state) => state.user?.username);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: username,
      password: "",
    },
    validate: {
      username: (value) => !value && "กรุณากรอกชื่อผู้ใช้งาน",
      password: (value) => !value && "กรุณากรอกรหัสผ่าน",
    },
  });

  const handleLogin = async (username: any, password: any) => {
    setLoading(true);
    try {
      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: "เข้าสู่ระบบสำเร็จ!",
        message: "Hey there, your code is awesome! 🤥",
        color: "green",
        loading: false,
      });
      setLoading(true);
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/HomePage");
    } catch (e: any) {
      setLoading(false);
      notifications.show({
        withCloseButton: true,
        autoClose: 5000,
        title: "เข้าสู่ระบบไม่สำเร็จ!",
        message: "Hey there, your code is awesome! 🤥",
        color: "red",
        loading: false,
      });
      form.reset();
    }
  };

  const renderLoading = () => {
    <Notification
      color="blue"
      radius="md"
      loading
      title="กำลังเข้าสู่ระบบ"
      sx={(theme) => ({
        textAlign: "center",
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        margin: "auto",
        marginBottom: theme.spacing.lg,
        width: "80%",
        zIndex: 2,
        opacity: loading ? 1 : 0,
        transition: "opacity 0.5s",
      })}
      withCloseButton={false}
    >
      กรุณารอสักครู่
    </Notification>;
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
        <h1 className={styles.title}>Connetwork Project</h1>
        <Box className={styles.box}>
          <Title fz={{ base: "1.46rem", xl: "1.8rem" }} align="center" mb="xs">
            ลงชื่อเข้าใช้งาน
          </Title>
          <form
            onSubmit={form.onSubmit((values) => {
              handleLogin(values.username, values.password);
            })}
          >
            <TextInput
              label="ชื่อผู้ใช้"
              placeholder="640xxxx"
              {...form.getInputProps("username")}
            />
            <PasswordInput
              mt="md"
              label="รหัสผ่าน"
              placeholder="******"
              {...form.getInputProps("password")}
            />

            <Text
              align="right"
              mt={2}
              color="blue"
              fz="xs"
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push("/ForgotPassword");
              }}
            >
              ลืมรหัสผ่าน?
            </Text>

            <Group position="center" mt="lg">
              <Button
                fullWidth
                type="submit"
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
              >
                เข้าสู่ระบบ
              </Button>
              <Flex gap="sm">
                <Text fz="xs">ยังไม่มีบัญชีผู้ใช้?</Text>
                <Text
                  color="blue"
                  fz="xs"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    router.push("/Register");
                  }}
                >
                  สมัครสมาชิก
                </Text>
              </Flex>
            </Group>
          </form>
        </Box>
      </main>
    </>
  );
}
