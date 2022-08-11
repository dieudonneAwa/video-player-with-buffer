import { Button, Flex, Spinner } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import PlayIcon from "./PlayIcon";
import PauseIcon from "./PauseIcon";
import ElapsedTimeTracker from "./ElapsedTimeTracker";
import PlaybackRate from "./PlaybackRate";

const Video = styled.video`
  flex-shrink: 1;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

interface Props {
  src: string;
  muted?: boolean;
  autoPlay?: boolean;
}

const Player = (props: Props) => {
  const { src, autoPlay, muted } = props;
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [durationSec, setDurationSec] = useState(1);
  const [elapsedSec, setElapsedSec] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const onWaiting = () => {
      if (isPlaying) setIsPlaying(false);
      setIsWaiting(true);
    };

    const onPlay = () => {
      if (isWaiting) setIsWaiting(false);
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsWaiting(false);
    };

    const element = videoRef.current;

    const onProgress = () => {
      if (!element.buffered || !bufferRef.current) return;
      if (!element.buffered.length) return;
      const bufferedEnd = element.buffered.end(element.buffered.length - 1);
      const duration = element.duration;
      if (bufferRef && duration > 0) {
        bufferRef.current.style.width = (bufferedEnd / duration) * 100 + "%";
      }
    };

    const onTimeUpdate = () => {
      setIsWaiting(false);
      if (!element.buffered || !progressRef.current) return;
      const duration = element.duration;
      setDurationSec(duration);
      setElapsedSec(element.currentTime);
      if (progressRef && duration > 0) {
        progressRef.current.style.width =
          (element.currentTime / duration) * 100 + "%";
      }
    };

    element.addEventListener("progress", onProgress);
    element.addEventListener("timeupdate", onTimeUpdate);

    element.addEventListener("waiting", onWaiting);
    element.addEventListener("play", onPlay);
    element.addEventListener("playing", onPlay);
    element.addEventListener("pause", onPause);

    // clean up
    return () => {
      element.removeEventListener("waiting", onWaiting);
      element.removeEventListener("play", onPlay);
      element.removeEventListener("playing", onPlay);
      element.removeEventListener("pause", onPause);
      element.removeEventListener("progress", onProgress);
      element.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoRef.current]);

  // This is where the playback rate is set on the video element.
  useEffect(() => {
    if (!videoRef.current) return;
    if (videoRef.current.playbackRate === playbackRate) return;
    videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const handlePlayPauseClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const seekToPosition = (pos: number) => {
    if (!videoRef.current) return;
    if (pos < 0 || pos > 1) return;

    const durationMs = videoRef.current.duration * 1000 || 0;

    const newElapsedMs = durationMs * pos;
    const newTimeSec = newElapsedMs / 1000;
    videoRef.current.currentTime = newTimeSec;
  };

  return (
    <Flex
      flexDir="column"
      cursor="pointer"
      align="center"
      justify="center"
      pos="relative"
      rounded="10px"
      overflow="hidden"
      _hover={{
        ".timeline-container": {
          opacity: 1,
        },
      }}
    >
      {isWaiting && <Spinner pos="absolute" color="white" />}
      <Video
        autoPlay={autoPlay}
        muted={muted}
        src={src}
        onClick={handlePlayPauseClick}
        ref={videoRef}
      />
      <Flex
        w="full"
        h="100px"
        bg="linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))"
        pos="absolute"
        opacity={0}
        transition="opacity 0.5s linear"
        className="timeline-container"
        left={0}
        bottom={0}
        align="flex-end"
        px="1rem"
      >
        <Flex flexDir="column" w="full" align="center">
          <Flex
            w="full"
            transition="height 0.1s linear"
            className="timeline"
            h="4px"
            mb="0.5rem"
            rounded="10px"
            bg="rgba(193, 193, 193, 0.5)"
            _hover={{ height: "5px" }}
            overflow="hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              const { left, width } = e.currentTarget.getBoundingClientRect();
              const clickedPos = (e.clientX - left) / width;
              seekToPosition(clickedPos);
            }}
          >
            <Flex pos="relative" w="full" h="full">
              <Flex
                h="full"
                className="play-progress"
                bg="#0CAADC"
                zIndex={1}
                ref={progressRef}
              />
              <Flex
                pos="absolute"
                h="full"
                className="buffer-progress"
                bg="#FDFFFC"
                ref={bufferRef}
              />
            </Flex>
          </Flex>
          <Flex w="full" justify="space-between" align="center">
            <Flex align="center">
              <Button
                maxW="25px"
                minW="25px"
                w="25px"
                p="0"
                mr="0.4rem"
                maxH="25px"
                h="25px"
                rounded="4px"
                colorScheme="transparent"
                bg="transparent"
                mb="0.5rem"
                _hover={{
                  bg: "rgba(0, 0, 0, 0.4)",
                }}
                onClick={handlePlayPauseClick}
              >
                {!isPlaying ? <PlayIcon /> : <PauseIcon />}
              </Button>

              <ElapsedTimeTracker
                totalSec={durationSec}
                elapsedSec={elapsedSec}
              />
            </Flex>

            <PlaybackRate
              playbackRate={playbackRate}
              setPlaybackRate={setPlaybackRate}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Player;
