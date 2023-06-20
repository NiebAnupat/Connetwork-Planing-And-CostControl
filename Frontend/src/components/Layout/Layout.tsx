import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import MyNavbar from "./Navbar/MyNavbar";
import { AppShell } from "@mantine/core";

export default function Layout({ children }: PropsWithChildren) {
  const isIndex = useRouter().pathname === "/";

  return (
    <AppShell navbar={<MyNavbar />} padding={0} hidden={isIndex}>
      {children}
    </AppShell>
  );
}
