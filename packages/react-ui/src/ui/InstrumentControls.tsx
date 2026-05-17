export interface PianoKeyboardProps {
  activeNotes?: readonly string[];
  notes?: readonly string[];
  onNotePress?: (note: string) => void;
}

const defaultPianoNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function PianoKeyboard({ activeNotes = ['C', 'E', 'G'], notes = defaultPianoNotes, onNotePress }: PianoKeyboardProps) {
  return (
    <div className="crui-piano-keyboard" role="group" aria-label="Piano keyboard">
      {notes.map((note) => {
        const sharp = note.includes('#');
        const active = activeNotes.includes(note);
        return (
          <button
            aria-pressed={active}
            className={sharp ? 'crui-piano-keyboard__key crui-piano-keyboard__key--sharp' : 'crui-piano-keyboard__key'}
            key={note}
            onClick={() => onNotePress?.(note)}
            type="button"
          >
            {note}
          </button>
        );
      })}
    </div>
  );
}

export interface DrumPad {
  id: string;
  label: string;
  tone?: 'kick' | 'snare' | 'hat' | 'perc';
}

export interface DrumPadGridProps {
  activeId?: string;
  pads?: readonly DrumPad[];
  onPadPress?: (pad: DrumPad) => void;
}

const defaultPads: DrumPad[] = [
  { id: 'kick', label: 'Kick', tone: 'kick' },
  { id: 'snare', label: 'Snare', tone: 'snare' },
  { id: 'hat', label: 'Hat', tone: 'hat' },
  { id: 'clap', label: 'Clap', tone: 'perc' },
  { id: 'tom', label: 'Tom', tone: 'perc' },
  { id: 'rim', label: 'Rim', tone: 'snare' }
];

export function DrumPadGrid({ activeId = 'kick', pads = defaultPads, onPadPress }: DrumPadGridProps) {
  return (
    <div className="crui-drum-pad-grid" role="group" aria-label="Drum pads">
      {pads.map((pad) => (
        <button
          aria-pressed={pad.id === activeId}
          className={`crui-drum-pad-grid__pad crui-drum-pad-grid__pad--${pad.tone ?? 'perc'}`}
          key={pad.id}
          onClick={() => onPadPress?.(pad)}
          type="button"
        >
          {pad.label}
        </button>
      ))}
    </div>
  );
}

export interface TambourinePadProps {
  active?: boolean;
  label?: string;
  onShake?: () => void;
}

export function TambourinePad({ active = false, label = 'Tambourine', onShake }: TambourinePadProps) {
  return (
    <button
      aria-pressed={active}
      className="crui-tambourine-pad"
      onClick={onShake}
      type="button"
    >
      <span className="crui-tambourine-pad__ring" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <i key={index} style={{ transform: `rotate(${index * 36}deg) translateY(-42px)` }} />
        ))}
      </span>
      <strong>{label}</strong>
    </button>
  );
}
