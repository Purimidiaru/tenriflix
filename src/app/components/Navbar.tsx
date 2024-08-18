import { Flex, Heading, HStack, Link } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <Flex justify="space-between" align="center" p={5} bg="rgba(0, 0, 0, 0.8)" position="fixed" top={0} w="100%" zIndex={1000}>
      <HStack spacing={8}>
        <Heading as="h1" size="lg" letterSpacing="wider">Tenriflix</Heading>
        <HStack spacing={8}>
          <Link href="#" _hover={{ textDecoration: 'none', color: 'red.500' }}>映画</Link>
          <Link href="#" _hover={{ textDecoration: 'none', color: 'red.500' }}>テレビシリーズ</Link>
          <Link href="#" _hover={{ textDecoration: 'none', color: 'red.500' }}>テレビ</Link>
        </HStack>
      </HStack>
    </Flex>
  );
};

export default Navbar;
