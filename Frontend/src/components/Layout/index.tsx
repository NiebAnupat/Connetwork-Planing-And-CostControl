import React, { PropsWithChildren, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/lib/userStore";
import { useAccountStore } from "@/lib/accountStore";
import {
  Grid,
  Flex,
  Text,
  Menu,
  Input,
  Title,
  Burger,
  Header,
  Avatar,
  AppShell,
  Indicator,
  MediaQuery,
  useMantineTheme,
} from "@mantine/core";
import {
  IconUser,
  IconSearch,
  IconSettings,
  IconCreditCard,
} from "@tabler/icons-react";
import MyNavbar from "./Navbar/MyNavbar";
import { LoadingScreen } from "./LoadingScreen";

export default function Layout({ children }: PropsWithChildren) {
  const user = useUserStore((state) => state.user);
  const account = useAccountStore((state) => state.isAccount);
  const isLogout = useUserStore((state) => state.isLogout);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const isIndex = router.pathname === "/";
  const isRegis = router.pathname === "/Register";

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (isLogout) return <LoadingScreen />;
  return (
    <AppShell
      hidden={isIndex || isRegis}
      padding={0}
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      // Navbar
      navbarOffsetBreakpoint="sm"
      navbar={<MyNavbar opened={!opened} />}
      // Header
      header={
        <Header height={{ base: 50, md: 60 }} p="md">
          <div
            style={{
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Grid w={"100%"}>
              <Grid.Col span={6}>
                <Title order={2} pl={"md"}>
                  Connetwork Project
                </Title>
              </Grid.Col>

              <Grid.Col span={6}>
                <Flex gap="lg" justify="flex-end" align="center">
                  <Input
                    icon={<IconSearch size="1.2rem" />}
                    placeholder="ค้นหา"
                    radius="xl"
                    w={{ xs: 200, sm: 300, md: 500 }}
                  />
                  <Avatar src="bg.jpg" size="2.6rem" radius="xl" />
                  <MyMenu />
                </Flex>
              </Grid.Col>
            </Grid>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}

function MyMenu() {
  return (
    <Menu withArrow position="bottom-end" offset={24}>
      <Menu.Target>
        <Text style={{ cursor: "pointer" }} fs={{ xs: "200" }}>
          สุชานาถ คุ้มบุ่งคล้า
        </Text>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>จัดการบัญชี</Menu.Label>
        <Menu.Item icon={<IconUser size={14} />}>บัญชีของฉัน</Menu.Item>
        <Menu.Item
          icon={<IconCreditCard size={14} />}
          component="a"
          href="/Account/Payment"
        >
          <Indicator color="red" size={10} offset={-2} position="top-end">
            การชำระเงิน
          </Indicator>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>จัดการระบบ</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />}>ตั้งค่า</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
