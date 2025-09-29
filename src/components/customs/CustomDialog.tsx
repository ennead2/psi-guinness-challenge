import { Dialog, Portal, CloseButton } from "@chakra-ui/react";

export const CustomDialog = (args: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { children, isOpen, setIsOpen } = args;

  return (
    <Dialog.Root
      size="cover"
      placement="center"
      motionPreset="slide-in-bottom"
      open={isOpen}
      onInteractOutside={() => setIsOpen(false)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              {/* <Dialog.Title>Dialog Title</Dialog.Title> */}
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" onClick={() => setIsOpen(false)} />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>{children}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
