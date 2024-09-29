import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import AudioRecorder from "./components/AudioRecorder";
import Dialogues from "./components/Dialogues";
import { DialoguesProvider } from "./context/DialoguesContext";
import testVideo from './video/testvideo.mp4';

const App = () => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (progress) => {
    setCurrentTime(progress.playedSeconds);
  };

  return (
    <DialoguesProvider>
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center">
          <ReactPlayer
            ref={playerRef}
            url={testVideo}
            playing={playing}
            controls={true}
            onProgress={handleProgress}
            width="100%"
          />
          <button
            className="bg-blue-500 text-white p-2 mt-4 rounded"
            onClick={handlePlayPause}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <AudioRecorder />
          <Dialogues currentTime={currentTime} />
        </div>
      </div>
    </DialoguesProvider>
  );
};

export default App;
