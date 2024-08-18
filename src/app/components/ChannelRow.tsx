import { VStack, Heading, Flex, Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

const ChannelRow = ({ title, channels, onSelectChannel, scrollRef, scrollLeft, scrollRight }: { title: string, channels: any[], onSelectChannel: (channel: any) => void, scrollRef: any, scrollLeft: () => void, scrollRight: () => void }) => {
  return (
    <VStack align="start" w="100%" position="relative">
      <Heading as="h3" size="md" mb={3}>{title}</Heading>
      <Flex
        ref={scrollRef}
        overflowX="scroll"
        w="100%"
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}
      >
        {channels.map((channel, i) => (
          <Box
            key={i}
            flex="none"
            w={{ base: '225px', md: '300px' }}
            h={{ base: '150px', md: '200px' }}
            mr={5}
            bg="gray.800"
            position="relative"
            cursor="pointer"
            onClick={() => onSelectChannel(channel)}
          >
            <Image 
              src={`/images/channels/${channel.image}`} 
              alt={channel.name} 
              layout="fill" 
              objectFit="contain"
              style={{ padding: '5%', maxWidth: '100%', maxHeight: '100%' }}
            />
            <Box position="absolute" bottom={0.5} left={0.5}>
              <Text fontSize="lg" fontWeight="bold" color="white">{channel.name}</Text>
            </Box>
          </Box>
        ))}
      </Flex>
      <HStack w="100%" justifyContent="center" mt={3}>
        <IconButton
          aria-label="左にスクロール"
          icon={<FaArrowLeft />}
          onClick={scrollLeft}
          zIndex={10}
          variant="ghost"
          colorScheme="whiteAlpha"
        />
        <IconButton
          aria-label="右にスクロール"
          icon={<FaArrowRight />}
          onClick={scrollRight}
          zIndex={10}
          variant="ghost"
          colorScheme="whiteAlpha"
        />
      </HStack>
    </VStack>
  );
};

export default ChannelRow;