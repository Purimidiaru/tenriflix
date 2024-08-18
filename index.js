import { Box, Heading, Text, Flex, VStack, Link } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState(null)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/luongz/Japan-IPTV/main/jp.m3u')
      .then(response => response.text())
      .then(data => {
        const parsedChannels = parseM3U(data)
        setChannels(parsedChannels)
        setSelectedChannel(parsedChannels[0]) // Sélectionne la première chaîne par défaut
      })
  }, [])

  const parseM3U = (data) => {
    const lines = data.split('\n')
    const channels = []
    let channel = {}

    lines.forEach(line => {
      if (line.startsWith('#EXTINF:')) {
        channel = {
          name: line.match(/,([^,]+)$/)[1],
        }
      } else if (line.startsWith('http')) {
        channel.url = line
        channels.push(channel)
      }
    })

    return channels
  }

  return (
    <Flex direction="row" p={5}>
      {/* Menu latéral pour la sélection des chaînes */}
      <VStack w="250px" p={3} align="start" spacing={3} borderRight="1px solid #ccc">
        <Heading as="h3" size="md">Channels</Heading>
        {channels.length === 0 ? (
          <Text>Loading channels...</Text>
        ) : (
          channels.map((channel, index) => (
            <Link key={index} onClick={() => setSelectedChannel(channel)} cursor="pointer">
              <Text fontSize="md" color={selectedChannel?.name === channel.name ? 'blue.500' : 'black'}>
                {channel.name}
              </Text>
            </Link>
          ))
        )}
      </VStack>

      {/* Affichage de la chaîne sélectionnée */}
      <Box flex="1" p={3}>
        {selectedChannel ? (
          <Box>
            <Heading as="h1" size="lg" mb={5}>
              {selectedChannel.name}
            </Heading>
            <Box as="iframe"
              src={selectedChannel.url}
              width="100%"
              height="600px"
              border="none"
              allowFullScreen
            />
          </Box>
        ) : (
          <Text>Select a channel to watch</Text>
        )}
      </Box>
    </Flex>
  )
}
