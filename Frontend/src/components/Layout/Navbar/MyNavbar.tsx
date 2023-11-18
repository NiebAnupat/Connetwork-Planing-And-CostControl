import React from "react";
import { useRouter } from "next/router";
import {
  Navbar,
  UnstyledButton,
  Group,
  ThemeIcon,
  Text,
  Divider,
} from "@mantine/core";
import {
  IconHome,
  IconTable,
  IconChartArrows,
  IconLogout,
} from "@tabler/icons-react";
import NavLink from "./_NavLink";

export default function MyNavbar({ opened }: { opened: boolean }) {
  const router = useRouter();

  const NavLinkData = [
    {
      icon: <IconHome size="1rem" />,
      color: "blue",
      label: "แดชบอร์ด",
      href: "/HomePage",
    },
    {
      icon: <IconChartArrows size="1rem" />,
      color: "red",
      label: "ตารางการทำงาน",
      href: "/GanntChart",
    },
    {
      icon: <IconTable size="1rem" />,
      color: "teal",
      label: "โปรเจคทั้งหมด",
      href: "/AllProject",
    },
  ];

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 230 }}
    >
      <Navbar.Section grow>
        {NavLinkData.map((link) => (
          <NavLink
            key={link.label}
            icon={link.icon}
            color={link.color}
            label={link.label}
            href={link.href}
          />
        ))}
      </Navbar.Section>
      <Divider my={"md"} />
      <Navbar.Section>
        <UnstyledButton
          onClick={() => router.push("/")}
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colors["red"][theme.colorScheme === "dark" ? 9 : 0],
            },
          })}
        >
          <Group>
            <ThemeIcon color={"red.5"} variant="light">
              <IconLogout />
            </ThemeIcon>

            <Text size="sm">ออกจากระบบ</Text>
          </Group>
        </UnstyledButton>
      </Navbar.Section>
    </Navbar>
  );
}
