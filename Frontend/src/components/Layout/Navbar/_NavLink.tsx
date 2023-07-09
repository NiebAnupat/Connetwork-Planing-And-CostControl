import React from "react";
import { useRouter } from "next/router";
import { UnstyledButton, Group, ThemeIcon, Text } from "@mantine/core";

interface Props {
  icon: React.ReactNode;
  color: string;
  label: string;
  href?: string;
}

export default function NavLink({ icon, color, label, href }: Props) {
  const router = useRouter();

  const handleLinkClick = () => {
    href && router.push(href);
  };

  return (
    <>
      <UnstyledButton
        onClick={handleLinkClick}
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </>
  );
}
