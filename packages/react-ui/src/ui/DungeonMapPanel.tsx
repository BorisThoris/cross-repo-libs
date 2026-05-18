export type DungeonRoomType =
  | 'start'
  | 'normal'
  | 'enemy'
  | 'treasure'
  | 'puzzle'
  | 'boss'
  | 'secret'
  | 'shop'
  | 'library'
  | 'trap';

export interface DungeonMapRoom {
  id: string;
  label?: string;
  locked?: boolean;
  type?: DungeonRoomType;
  visited?: boolean;
  x: number;
  y: number;
}

export interface DungeonMapConnection {
  from: string;
  to: string;
}

export interface DungeonMapPanelProps {
  algorithm?: string;
  compact?: boolean;
  connections?: readonly DungeonMapConnection[];
  currentRoomId?: string;
  mapLabel?: string;
  rooms: readonly DungeonMapRoom[];
  subtitle?: string;
}

const roomTypeLabels: Record<DungeonRoomType, string> = {
  boss: 'Boss',
  enemy: 'Enemy',
  library: 'Library',
  normal: 'Normal',
  puzzle: 'Puzzle',
  secret: 'Secret',
  shop: 'Shop',
  start: 'Start',
  trap: 'Trap',
  treasure: 'Treasure'
};

function getBounds(rooms: readonly DungeonMapRoom[]) {
  if (rooms.length === 0) {
    return {
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0
    };
  }

  const xs = rooms.map((room) => room.x);
  const ys = rooms.map((room) => room.y);
  return {
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
    minX: Math.min(...xs),
    minY: Math.min(...ys)
  };
}

function getLine(roomLookup: Map<string, DungeonMapRoom>, connection: DungeonMapConnection) {
  const from = roomLookup.get(connection.from);
  const to = roomLookup.get(connection.to);

  if (!from || !to) {
    return null;
  }

  return {
    x1: from.x,
    x2: to.x,
    y1: from.y,
    y2: to.y
  };
}

export function DungeonMapPanel({
  algorithm = 'Branching dungeon',
  compact = false,
  connections = [],
  currentRoomId,
  mapLabel = 'Ghost Dungeon',
  rooms,
  subtitle = 'Generated run map'
}: DungeonMapPanelProps) {
  const bounds = getBounds(rooms);
  const roomLookup = new Map(rooms.map((room) => [room.id, room]));
  const currentRoom = rooms.find((room) => room.id === currentRoomId) ?? rooms.find((room) => room.type === 'start') ?? rooms[0];
  const visitedCount = rooms.filter((room) => room.visited || room.id === currentRoom?.id).length;
  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;

  return (
    <section className={`crui-dungeon-map-panel ${compact ? 'crui-dungeon-map-panel--compact' : ''}`} aria-label={mapLabel}>
      <header className="crui-dungeon-map-panel__header">
        <div>
          <span>{subtitle}</span>
          <strong>{mapLabel}</strong>
        </div>
        <small>{visitedCount}/{rooms.length} rooms</small>
      </header>
      <div className="crui-dungeon-map-panel__body">
        <div
          className="crui-dungeon-map"
          style={{
            '--crui-map-height': height,
            '--crui-map-width': width
          } as CSSProperties}
        >
          <svg className="crui-dungeon-map__routes" viewBox={`${bounds.minX - 0.5} ${bounds.minY - 0.5} ${width} ${height}`} aria-hidden="true">
            {connections.map((connection) => {
              const line = getLine(roomLookup, connection);
              return line ? <line key={`${connection.from}-${connection.to}`} {...line} /> : null;
            })}
          </svg>
          {rooms.map((room) => {
            const type = room.type ?? 'normal';
            const stateClass = [
              room.id === currentRoom?.id ? 'crui-dungeon-map__room--current' : '',
              room.visited ? 'crui-dungeon-map__room--visited' : '',
              room.locked ? 'crui-dungeon-map__room--locked' : ''
            ].filter(Boolean).join(' ');

            return (
              <span
                className={`crui-dungeon-map__room crui-dungeon-map__room--${type} ${stateClass}`}
                key={room.id}
                style={{
                  '--crui-room-x': room.x - bounds.minX + 1,
                  '--crui-room-y': room.y - bounds.minY + 1
                } as CSSProperties}
                title={`${room.label ?? roomTypeLabels[type]} room`}
              >
                {room.label ?? roomTypeLabels[type].slice(0, 1)}
              </span>
            );
          })}
        </div>
        <aside className="crui-dungeon-map-panel__details">
          <div>
            <span>Current Room</span>
            <strong>{currentRoom ? roomTypeLabels[currentRoom.type ?? 'normal'] : 'Unknown'}</strong>
          </div>
          <div>
            <span>Position</span>
            <strong>{currentRoom ? `${currentRoom.x}, ${currentRoom.y}` : '0, 0'}</strong>
          </div>
          <div>
            <span>Algorithm</span>
            <strong>{algorithm}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
import type { CSSProperties } from 'react';
