import { auth } from '@/src/firebase/clientApp';
import { Flex, Image } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';

const NavBar = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <Flex bg="white" height="44px" padding="6px 12px">
      <Flex alignItems="center">
        <Image src="/images/redditFace.svg" alt="redditFace" height="30px" />
        <Image
          src="/images/redditText.svg"
          alt="redditText"
          height="46px"
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      {/* <Directory /> */}
      <SearchInput />
      <RightContent user={user} />
    </Flex>
  );
};
export default NavBar;
