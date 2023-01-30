import { AuthModalState } from '@/src/atoms/autmModalAtom';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { useRecoilState } from 'recoil';

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(AuthModalState);

  const handleClose = () => setModalState((prev) => ({ ...prev, open: false }));
  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>BOdy</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
