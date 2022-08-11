import "./styles.css";
import Player from "./Player";
import { Flex, Heading } from "@chakra-ui/react";

export default function App() {
  return (
    <Flex flexDir="column" px="1rem" className="App">
      <Heading mb="2rem">Video player</Heading>
      <Player src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
    </Flex>
  );
}
