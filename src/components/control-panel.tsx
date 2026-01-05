import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Camera, FlipHorizontal, Moon, Sun, Video, Volume2, PersonStanding, Settings2 } from 'lucide-react';
import { Rings } from 'react-loader-spinner';
import { ModeToggle } from './theme-toggle';

type Props = {
  isRecording: boolean;
  autoRecordEnabled: boolean;
  volume: number;
  onSnapshot: () => void;
  onRecord: () => void;
  onToggleAutoRecord: () => void;
  onFlip: () => void;
  onVolumeChange: (val: number) => void;
};

const ControlPanel = ({
  isRecording,
  autoRecordEnabled,
  volume,
  onSnapshot,
  onRecord,
  onToggleAutoRecord,
  onFlip,
  onVolumeChange
}: Props) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 p-4 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-500 z-50">
      
      {/* Theme Toggle Wrapper - we might need to adjust ModeToggle to fit the style or just use it as is */}
      <div className="flex items-center gap-2 border-r border-white/10 pr-4">
        <ModeToggle />
      </div>

      <div className="flex items-center gap-3">
        {/* Flip Camera */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onFlip}
          className="rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all"
        >
          <FlipHorizontal size={20} />
        </Button>

        {/* Snapshot */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSnapshot}
          className="rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all"
        >
          <Camera size={20} />
        </Button>

        {/* Manual Record */}
        <Button
          variant={isRecording ? 'destructive' : 'ghost'}
          size="icon"
          onClick={onRecord}
          className={`rounded-full transition-all ${isRecording ? 'animate-pulse ring-2 ring-red-500/50' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
        >
          <Video size={20} />
        </Button>

        {/* Auto Record */}
        <Button
          variant={autoRecordEnabled ? 'default' : 'ghost'}
          size="icon"
          onClick={onToggleAutoRecord}
          className={`rounded-full transition-all ${autoRecordEnabled ? 'bg-red-500 hover:bg-red-600 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
          title="Auto Record on Person Detection"
        >
          {autoRecordEnabled ? <Rings color="white" height={24} width={24} /> : <PersonStanding size={20} />}
        </Button>

        {/* Volume */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all"
            >
              <Volume2 size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 border-white/10 bg-black/80 backdrop-blur-md">
            <Slider
              max={1}
              min={0}
              step={0.1}
              defaultValue={[volume]}
              onValueCommit={(val) => onVolumeChange(val[0])}
              className="my-2"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ControlPanel;
