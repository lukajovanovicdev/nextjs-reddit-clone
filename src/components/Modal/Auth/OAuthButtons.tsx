import { auth } from '@/src/firebase/clientApp';
import { Button, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  return (
    <Flex direction="column" mb={4} width="100%">
      <Button variant="oauth" mb={2} onClick={() => signInWithGoogle()} isLoading={loading}>
        <Image src="/images/googlelogo.png" height="20px" mr={4} />
        Continue with Google
      </Button>
      <Button variant="oauth">Some Other Provider</Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
};
export default OAuthButtons;
