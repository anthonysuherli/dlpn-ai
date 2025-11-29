'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const AudioComponent = ({ node, selected }: NodeViewProps) => {
  const { src, title } = node.attrs as { src: string; title?: string };
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  return (
    <NodeViewWrapper className="my-4">
      <div className={`flex items-center gap-3 p-3 rounded-lg bg-zinc-800 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />

        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
          <Music className="w-5 h-5 text-zinc-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm text-zinc-200 truncate">{title || 'Audio file'}</div>

          <div className="flex items-center gap-2 mt-1">
            <button onClick={togglePlay} className="p-1 rounded hover:bg-zinc-700">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <div
              className="flex-1 h-1.5 bg-zinc-700 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-xs text-zinc-500 tabular-nums">
              {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}
            </span>

            <button onClick={toggleMute} className="p-1 rounded hover:bg-zinc-700">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const AudioNode = Node.create({
  name: 'audio',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'audio[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes(HTMLAttributes, { controls: true })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioComponent);
  },
});
