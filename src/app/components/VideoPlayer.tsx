import { Box, Heading } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ selectedChannel }: { selectedChannel: any }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (selectedChannel && videoRef.current) {
      if (playerRef.current) {
        playerRef.current.src({ src: selectedChannel.url, type: 'application/x-mpegURL' });
        playerRef.current.play();
      } else {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          preload: 'auto',
          sources: [{ src: selectedChannel.url, type: 'application/x-mpegURL' }],
        });
      }
    }
  }, [selectedChannel]);

  return (
    <Box
      height="60vh"
      bg="black"
      position="relative"
      mt={{ base: "13vh", md: "10vh" }}
    >
      <Box position="absolute" bottom={10} left={0} zIndex={10} px={4} width="100%">
        <Heading
          as="h2"
          fontSize={{ base: 'md', md: '6xl' }}
          mb={3}
          textAlign="left"
          maxWidth="100%"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {selectedChannel ? selectedChannel.name : 'ロード中'}
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
  );
};

export default VideoPlayer;
