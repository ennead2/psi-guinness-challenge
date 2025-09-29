import {
  Button,
  Stack,
  type ButtonProps,
  type StackProps,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

type CustomButtonProps = Omit<ButtonProps, "type"> & {
  type?: "ok" | "cancel" | "back" | "photo" | "select";
};

export const CustomButton = ({
  type = "ok",
  children,
  ...props
}: CustomButtonProps) => {
  return (
    <>
      {type === "ok" ? (
        <Button
          w={"90%"}
          p={6}
          bg={"teal.600"}
          color={"white"}
          _hover={{
            bg: "teal.500",
          }}
          {...props}
        >
          {children}
        </Button>
      ) : type === "cancel" ? (
        <Button
          w={"90%"}
          p={6}
          bg={"gray.600"}
          color={"white"}
          _hover={{
            bg: "gray.500",
          }}
          {...props}
        >
          {children}
        </Button>
      ) : type === "back" ? (
        <Button
          bg={"transparent"}
          color={"black"}
          _hover={{
            opacity: 0.8,
          }}
          {...props}
        >
          <FaArrowLeft />
        </Button>
      ) : type === "photo" ? (
        <Stack
          bg={"gray.600"}
          color={"white"}
          p={6}
          rounded={"full"}
          cursor={"pointer"}
          _hover={{ bg: "gray.500" }}
          {...(props as StackProps)}
        >
          <FaCamera size={50} />
        </Stack>
      ) : type === "select" ? (
        <Button
          p={6}
          bg={"blue.600"}
          color={"white"}
          _hover={{
            bg: "blue.500",
          }}
          {...props}
        >
          {children}
        </Button>
      ) : null}
    </>
  );
};

// <Button {...styles[type]} {...props}>
//   {type === "back" ? (
//     <FaArrowLeft />
//   ) : type === "photo" ? (
//     <IconContext.Provider value={{ size: "200px" }}>
//       <FaCamera size={"200px"} />
//     </IconContext.Provider>
//   ) : (
//     children
//   )}
// </Button>
