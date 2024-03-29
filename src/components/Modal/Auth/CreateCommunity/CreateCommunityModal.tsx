import { auth, firestore } from '@/src/firebase/clientApp';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import React, { ChangeEvent, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ open, handleClose }) => {
  const [communityName, setCommunityName] = useState('');
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState('public');
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);

    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommunityTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCommunityType(event.target.name);
  };

  const handleCreateCommunity = async () => {
    if (error) setError('');

    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(communityName) || communityName.length < 3)
      throw new Error(`Sorry, /r${communityName} is taken. Try another.`);

    setLoading(true);

    try {
      const communityDocRef = doc(firestore, 'communities', communityName);

      await runTransaction(firestore, async (transaction) => {
        // check if community exists
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists())
          return setError(`Sorry, /r${communityName} is taken. Try another.`);

        // create a new community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        // crate community snippet on user
        transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
          communityId: communityName,
          isModerator: true,
        });
      });
    } catch (err: any) {
      console.log('[handleCreateCommunity] Error', err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" flexDirection="column" fontSize={15} padding={3}>
            Create a Community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0">
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color="grey.500">
                Community names including capitalization cannot be changed
              </Text>
              <Text position="relative" top="28px" left="10px" width={20} color="gray.400">
                r/
              </Text>
              <Input
                position="relative"
                value={communityName}
                size="sm"
                pl={22}
                onChange={handleChange}
              />
              <Text fontSize="9pt" color={charsRemaining === 0 ? 'red' : 'gray.500'}>
                {charsRemaining} Characters remaining
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={communityType === 'public'}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Public
                      </Text>
                      <Text fontSize={8} color="gray.500" pt={1}>
                        Anyone can view, post and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={communityType === 'restricted'}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize={8} color="gray.500" pt={1}>
                        Anyone can view this community, but only approved users can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={communityType === 'private'}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />

                      <Text fontSize="10pt" mr={1}>
                        Private
                      </Text>
                      <Text fontSize={8} color="gray.500" pt={1}>
                        Only approved users can view and submit to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>
          <ModalFooter bg="gray.100" borderRadius="0 0 10px 10px">
            <Button variant="outline" height={30} mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button height={30} onClick={handleCreateCommunity} isLoading={loading}>
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
