'use client';

import { useEffect, useState, useRef } from 'react';
import { Box, VStack, Heading } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import ChannelRow from './components/ChannelRow';
import VideoPlayer from './components/VideoPlayer';

export default function Home() {
  const [primaryChannels, setPrimaryChannels] = useState<any[]>([]);
  const [backupChannels, setBackupChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any | null>(null);
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
  }, []);

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

  const handleChannelSelection = (channel: any) => {
    const backupChannel = backupChannels.find((ch) => ch.name === channel.name);
    setSelectedChannel({
      ...channel,
      backupUrl: backupChannel ? backupChannel.url : undefined
    });
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
      <Navbar />
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
        {selectedChannel && (
          <VideoPlayer url={selectedChannel.url} backupUrl={selectedChannel.backupUrl} />
        )}
      </Box>
      <VStack spacing={10} mt="5vh" p={5}>
        <ChannelRow title="テレビチャンネル" channels={primaryChannels} onSelectChannel={handleChannelSelection} scrollRef={scrollRef} scrollLeft={scrollLeft} scrollRight={scrollRight} />
      </VStack>
    </Box>
  );
}
