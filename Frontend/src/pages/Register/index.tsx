import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Box,
  Text,
  Flex,
  Title,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import styles from "@/styles/Home.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [visible, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      conPassword: "",
    },
    validate: {
      name: (value) => !value && "กรุณากรอกชื่อ",
      lastname: (value) => !value && "กรุณากรอกนามสกุล",
      email: (value) => !value && "กรุณากรอกอีเมล์",
      phone: (value) => !value && "กรุณากรอกเบอร์โทรศัพท์",
      password: (value) => !value && "กรุณากรอกรหัสผ่าน",
      conPassword: (value) => !value && "กรุณากรอกรหัสผ่านอีกครั้ง",
    },
  });

  const handleRegister = async (
    name: any,
    lastname: any,
    email: any,
    phone: any,
    password: any,
    conPassword: any
  ) => {
    notifications.show({
      withCloseButton: true,
      onClose: () => console.log("unmounted"),
      onOpen: () => console.log("mounted"),
      autoClose: 5000,
      title: "เข้าสู่ระบบสำเร็จ!",
      message: "Hey there, your code is awesome! 🤥",
      color: "green",
      loading: false,
    });
    router.push("/HomePage");
  };

  return (
    <>
      <Head>
        <title>Register | Connetwork</title>
        <meta name="description" content="Create by Suchanart" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main}`}>
        <Box className={styles.boxReg}>
          <Title fz={{ base: "1.46rem", xl: "1.8rem" }} align="center" mb="xs">
            สมัครสมาชิก
          </Title>
          <form
            onSubmit={form.onSubmit((value) => {
              handleRegister(
                value.name,
                value.lastname,
                value.email,
                value.phone,
                value.password,
                value.conPassword
              );
            })}
          >
            <Flex
              direction={{
                base: "column",
                md: "row",
                lg: "row",
                xl: "row",
              }}
              gap="md"
            >
              <TextInput
                label="ชื่อ"
                placeholder="ชื่อ"
                {...form.getInputProps("name")}
              />
              <TextInput
                label="นามสกุล"
                placeholder="นามสกุล"
                {...form.getInputProps("lastname")}
              />
            </Flex>
            <TextInput
              mt="md"
              label="อีเมล์"
              placeholder="connetwork@gmail.com"
              {...form.getInputProps("email")}
            />
            <TextInput
              mt="md"
              label="เบอร์โทรศัพท์"
              placeholder="09xxxxxxxx"
              {...form.getInputProps("phone")}
            />
            <Stack mt="md">
              <Flex
                gap="md"
                direction={{
                  base: "column",
                  md: "row",
                  lg: "row",
                  xl: "row",
                }}
              >
                <PasswordInput
                  w={"100%"}
                  label="รหัสผ่าน"
                  visible={visible}
                  placeholder="********"
                  onVisibilityChange={toggle}
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  w={"100%"}
                  label="ยืนยันรหัสผ่าน"
                  visible={visible}
                  placeholder="********"
                  onVisibilityChange={toggle}
                  {...form.getInputProps("conPassword")}
                />
              </Flex>
            </Stack>

            <Text mt="2rem" fz="xs" align="center">
              ฉันได้อ่านและยอมรับข้อตกลงในการใช้งาน
            </Text>

            <Group position="center" mt="sm">
              <Button
                fullWidth
                type="submit"
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
              >
                ทดลองใช้งานฟรี
              </Button>
              <Flex gap="sm">
                <Text fz="xs">มีบัญชีกับเราแล้ว?</Text>
                <Text
                  color="blue"
                  fz="xs"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  ลงชื่อเข้าใช้งาน
                </Text>
              </Flex>
            </Group>
          </form>
        </Box>
      </main>
    </>
  );
}
