import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, AlertTriangle } from 'lucide-react';

type Detection = {
  id: number;
  label: string;
  score: number;
  timestamp: string;
};

type Props = {
  history: Detection[];
  onClear: () => void;
};

const DetectionLog = ({ history, onClear }: Props) => {
  return (
    <div className="absolute top-4 right-4 w-80 h-[calc(100vh-2rem)] rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-10 duration-700 z-40">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={18} />
            <h2 className="font-semibold text-white tracking-wider text-sm uppercase">Intel Feed</h2>
        </div>
        <span className="text-xs text-white/40">{history.length} Events</span>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
            {history.length === 0 && (
                <div className="text-center text-white/30 text-xs py-10">
                    No threats detected.
                    <br />
                    System monitoring...
                </div>
            )}
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white capitalize">{item.label}</span>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-white/10 text-white/70">
                    {(item.score * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                  <Clock size={10} />
                  <span>{item.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
        
        {history.length > 0 && (
            <div className="p-2 border-t border-white/10">
                <button 
                    onClick={onClear}
                    className="w-full py-2 text-xs text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    Clear History
                </button>
            </div>
        )}
    </div>
  );
};

export default DetectionLog;
