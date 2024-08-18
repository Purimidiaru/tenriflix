'use client'

import { useEffect, useState, useRef } from 'react';
import { Box, VStack } from '@chakra-ui/react';
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
      fetch('/jp-backup.m3u').then(response => response.text())
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
        let name = line.match(/,([^,]+)$/)?.[1];
        name = name?.trim().toLowerCase().replace(/\s+/g, '-');
        name = name?.endsWith('-') ? name.slice(0, -1) : name;
        channel = {
          name,
          image: `${name}.png`,
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

      {selectedChannel && (
        <VideoPlayer selectedChannel={selectedChannel} />
      )}

      <VStack spacing={10} mt="5vh" p={5}>
        <ChannelRow 
          title="テレビチャンネル" 
          channels={primaryChannels} 
          onSelectChannel={handleChannelSelection} 
          scrollRef={scrollRef} 
          scrollLeft={scrollLeft} 
          scrollRight={scrollRight} 
        />
      </VStack>
    </Box>
  );
}
