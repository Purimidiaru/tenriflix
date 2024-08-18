'use client'

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Box, Flex, Heading, VStack, Link, HStack, IconButton, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  const [primaryChannels, setPrimaryChannels] = useState<any[]>([]);
  const [backupChannels, setBackupChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/jp-primary.m3u').then(response => response.text()),
      fetch('/jp.m3u').then(response => response.text())
    ])
    .then(([primaryData, backupData]) => {
      const parsedPrimaryChannels = parseM3U(primaryData);
      const parsedBackupChannels = parseM3U(backupData);
      setPrimaryChannels(parsedPrimaryChannels);
      setBackupChannels(parsedBackupChannels);
      setSelectedChannel(parsedPrimaryChannels[0]);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedChannel && videoRef.current) {
      playChannel(selectedChannel.url);
    }
  }, [selectedChannel]);

  const parseM3U = (data: string) => {
    const lines = data.split('\n');
    const channels: any[] = [];
    let channel: any = {};

    lines.forEach(line => {
      if (line.startsWith('#EXTINF:')) {
        channel = {
          name: line.match(/,([^,]+)$/)?.[1],
        };
      } else if (line.startsWith('http')) {
        channel.url = line;
        channels.push(channel);
      }
    });

    return channels;
  };

  const playChannel = (url: string, fallbackUrl?: string) => {
    if (playerRef.current) {
      playerRef.current.src({ src: url, type: 'application/x-mpegURL' });
      playerRef.current.play().catch((error: any) => {
        console.error('Primary stream failed, trying backup', error);
        if (fallbackUrl) {
          playerRef.current.src({ src: fallbackUrl, type: 'application/x-mpegURL' });
          playerRef.current.play();
        }
      });
    } else {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        sources: [{ src: url, type: 'application/x-mpegURL' }],
      });
    }
  };

  const handleChannelSelection = (channel: any) => {
    const backupChannel = backupChannels.find((ch) => ch.name === channel.name);
    setSelectedChannel({
      ...channel,
      backupUrl: backupChannel ? backupChannel.url : undefined
    });
    playChannel(channel.url, backupChannel ? backupChannel.url : undefined);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <Box bg="black" color="white" minHeight="100vh" overflow="hidden">
      <Flex justify="space-between" align="center" p={5} bg="rgba(0, 0, 0, 0.8)" position="fixed" top={0} w="100%" zIndex={1000}>
        <HStack spacing={8}>
          <Heading as="h1" size="lg" letterSpacing="wider">Fakeflix</Heading>
          <HStack spacing={8}>
            <Link href="#" _hover={{ textDecoration: 'none', color: 'red.500' }}>Movies</Link>
            <Link href="#" _hover={{ textDecoration: 'none', color: 'red.500' }}>TV Series</Link>
            <Link href="#" _hover={{ textDecoration: 'none', color: 'red.500' }}>Television</Link>
          </HStack>
        </HStack>
      </Flex>

      <Box height="60vh" bg="black" position="relative" mt="10vh">
        <Box position="absolute" bottom={10} left={0} zIndex={10} px={4} width="100%">
          <Heading
            as="h2"
            size="2xl"
            mb={3}
            textAlign="left"
            maxWidth="100%"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {selectedChannel ? selectedChannel.name : '読み込み中'}
          </Heading>
        </Box>
        <Box position="relative" top="10%" left="0" width="100%" height="100%" zIndex={1}>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin"
            controls
            preload="auto"
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
      </Box>

      <VStack spacing={10} mt="5vh" p={5}>
        <ChannelRow title="テレビチャンネル" channels={primaryChannels} onSelectChannel={handleChannelSelection} scrollRef={scrollRef} scrollLeft={scrollLeft} scrollRight={scrollRight} />
      </VStack>
    </Box>
  );
}

function ChannelRow({ title, channels, onSelectChannel, scrollRef, scrollLeft, scrollRight }: { title: string, channels: any[], onSelectChannel: (channel: any) => void, scrollRef: any, scrollLeft: () => void, scrollRight: () => void }) {
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
            <Image src="/images/placeholder.jpg" alt={channel.name} layout="fill" objectFit="cover" />
            <Box position="absolute" bottom={3} left={3}>
              <Text fontSize="lg" fontWeight="bold">{channel.name}</Text>
            </Box>
          </Box>
        ))}
      </Flex>
      <HStack w="100%" justifyContent="center" mt={3}>
        <IconButton
          aria-label="Scroll Left"
          icon={<FaArrowLeft />}
          onClick={scrollLeft}
          zIndex={10}
          variant="ghost"
          colorScheme="whiteAlpha"
        />
        <IconButton
          aria-label="Scroll Right"
          icon={<FaArrowRight />}
          onClick={scrollRight}
          zIndex={10}
          variant="ghost"
          colorScheme="whiteAlpha"
        />
      </HStack>
    </VStack>
  );
}
