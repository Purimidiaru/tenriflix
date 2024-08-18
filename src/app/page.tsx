'use client';

import { useEffect, useState, useRef } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import ChannelRow from './components/ChannelRow';
import VideoPlayer from './components/VideoPlayer';

export default function Home() {
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/jp.m3u')
      .then(response => response.text())
      .then(data => {
        const parsedChannels = parseM3U(data);
        setChannels(parsedChannels);
        setSelectedChannel(parsedChannels[0]);
      });
  }, []);

  const parseM3U = (data: string) => {
    const lines = data.split('\n');
    const channels: any[] = [];
    let channel: any = {};
  
    lines.forEach(line => {
      if (line.startsWith('#EXTINF:')) {
        const name = line.match(/,([^,]+)$/)?.[1]?.trim();
        channel = {
          name,
          image: `${name.toLowerCase().replace(/\s+/g, '-')}.png`,
        };
      } else if (line.startsWith('http')) {
        channel.url = line;
        channels.push(channel);
      }
    });
  
    return channels;
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
      <VideoPlayer selectedChannel={selectedChannel} />
      <VStack spacing={10} mt="5vh" p={5}>
        <ChannelRow title="TV チャンネル" channels={channels} onSelectChannel={setSelectedChannel} scrollRef={scrollRef} scrollLeft={scrollLeft} scrollRight={scrollRight} />
      </VStack>
    </Box>
  );
}
