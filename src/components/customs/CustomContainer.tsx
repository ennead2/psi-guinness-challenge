import { Stack, type StackProps } from "@chakra-ui/react";

type CustomContainerProps = Omit<StackProps, "type"> & {
  type?: "main" | "auth" | "post";
};

export const CustomContainer = ({
  type = "main",
  children,
  ...props
}: CustomContainerProps) => {
  const styles = {
    main: {
      w: "100%",
      h: "auto",
      minH: "100%",
      bg: "green.200",
      align: "center",
      justify: "center",
      p: 2,
    },
    auth: {
      w: "100%",
      h: "auto",
      minH: "100%",
      bg: "teal.200",
      align: "center",
      justify: "center",
      p: 2,
    },
    post: {
      w: "100%",
      h: "auto",
      minH: "100%",
      bg: "blue.200",
      align: "center",
      justify: "center",
      p: 2,
    },
  };

  return (
    <Stack {...styles[type]} {...props}>
      {children}
    </Stack>
  );
};
