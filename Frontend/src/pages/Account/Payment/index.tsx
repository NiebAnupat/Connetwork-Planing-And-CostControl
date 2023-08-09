import React, { useState } from "react";
import Head from "next/head";
import styles from "@/styles/Account.module.css";
import { Box, Title, Text, SimpleGrid  } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath  } from "@mantine/dropzone";

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
          <Title>Payment</Title>
          <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
        <Text align="center">Drop images here</Text>
      </Dropzone>

      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        mt={previews.length > 0 ? 'xl' : 0}
      >
        {previews}
      </SimpleGrid>
        </Box>
      </main>
    </>
  );
}
