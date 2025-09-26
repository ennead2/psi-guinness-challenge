import { Button, type ButtonProps } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";

type CustomButtonProps = Omit<ButtonProps, "type"> & {
  type?: "ok" | "back" | "photo";
};

export const CustomButton = ({
  type = "ok",
  children,
  ...props
}: CustomButtonProps) => {
  const styles = {
    ok: {
      w: "90%",
      p: 6,
      bg: "teal.600",
      _hover: {
        bg: "teal.500",
      },
    },
    back: {
      bg: "transparent",
      color: "black",
      _hover: {
        opacity: 0.8,
      },
    },
    photo: {
      bg: "gray.600",
      _hover: {
        bg: "gray.500",
      },
    },
  };

  return (
    <Button {...styles[type]} {...props}>
      {type === "back" ? <FaArrowLeft /> : children}
    </Button>
  );
};
