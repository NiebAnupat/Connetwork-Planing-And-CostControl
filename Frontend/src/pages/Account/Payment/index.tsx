import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Account.module.css";
import { Box, Title, Text, Group, Image, rem, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";

export default function PaymentPage() {
  const [files, setFiles] = useState<FileWithPath[]>([]);



  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  return (
    <>
      <Head>
        <title>Payment | Connetwork</title>
        <meta name="description" content="Create by Suchanart" />
      </Head>

      <main className={`${styles.main}`}>
        <Box>
          <Title>การชำระเงิน</Title>
          <Box
            sx={(theme) => ({
              width: "100%",
              height: "100%",
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.colors.gray[0],
              borderRadius: theme.radius.sm,
              border: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
              padding: rem(20),
              margin: rem(20),
            })}
          >
            <Text>วันหมดอายุ</Text>
            <Text>29 พฤษภาคม 2567 เวลา 00:39</Text>
            <Button
              variant="outline"
              color="dark"
              radius="xl"
              sx={(theme) => ({
                ":hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[9]
                      : theme.colors.red[7],

                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[0]
                      : theme.colors.red[0],

                  borderColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[9]
                      : theme.colors.red[7],
                },
              })}
            >
              ชำระค่าสมาชิก
            </Button>
          </Box>
          {/* <Dropzone
            accept={IMAGE_MIME_TYPE}
            onDrop={setFiles}
            onReject={(files) => console.log("Reject files", files)}
            maxFiles={1}
            maxSize={2 * 1024 * 1024}
            style={{
              width: rem(250),
              height: rem(350)
            }}
          >
            <Group position="center" spacing="xl">
              <div>
                {files.length === 0 ? (
                  <Text>Drop image here</Text>
                ) : (
                  <div>{previews}</div>
                )}
              </div>
            </Group>
          </Dropzone> */}
        </Box>
      </main>
    </>
  );
}
