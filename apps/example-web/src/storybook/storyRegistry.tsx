import { Canvas } from '@react-three/fiber';
import {
  AeroLiquidBackground,
  Button,
  Callout,
  ControlHints,
  DeviceRackPanel,
  DisplayTitle,
  DrumPadGrid,
  DungeonMapPanel,
  EmptyState,
  EnergyCore,
  FlipTile,
  GameHudOverlay,
  IconGlyph,
  InstrumentPicker,
  InventorySlotGrid,
  LevelMeter,
  LibraryCard,
  LibraryToolbar,
  DungeonCardFace,
  MemoryHudStrip,
  MiniTimeline,
  ModalDialog,
  OverlayActionDock,
  PaletteSwatchGrid,
  Panel,
  PianoKeyboard,
  PreviewCard,
  RelicChoiceGrid,
  ResourceMeter,
  ScanlineOverlay,
  SelectionCheckbox,
  StatTile,
  StepGrid,
  TagEditor,
  TambourinePad,
  TexturePresetCard,
  TexturePreviewTile,
  TimerBadge,
  TransportControls
} from '@cross-repo-libs/react-ui';
import {
  Brazier,
  Barrel,
  Bridge,
  Candle,
  Chain,
  Door,
  DungeonAltar,
  Fence,
  FirstPersonHand,
  HeldItemAnchor,
  ItemOrb,
  Lever,
  MetalGate,
  ParticleField,
  Pillar,
  PressurePlate,
  ProjectileOrb,
  ProjectileTrail,
  Spikes,
  Statue,
  Table,
  TreasureChest,
  Web,
  Torch
} from '@cross-repo-libs/three-primitives';
import {
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
  useNotificationActions
} from '@cross-repo-libs/notifications';
import type { StoryRecord, StoryVariant } from './types.js';

const noop = () => undefined;

const showcaseStoryOrder = [
  'aero-liquid-background',
  'projectile-effects',
  'first-person-hand',
  'item-orb',
  'torch',
  'brazier',
  'dungeon-props',
  'trap-and-effects',
  'environment-props',
  'scene-controls',
  'game-hud',
  'memory-dungeon-kit',
  'dungeon-map-panel',
  'spellcaster-hud',
  'instrument-controls',
  'music-workspace',
  'device-rack-panel',
  'texture-kit',
  'modal-dialog',
  'library-toolbar',
  'preview-card',
  'instrument-picker',
  'library-card',
  'empty-state',
  'panel',
  'button',
  'icon-glyph',
  'tag-editor',
  'flip-tile',
  'stat-tile',
  'overlay-action-dock',
  'callout',
  'display-title',
  'notifications'
] as const;

function sortStoriesForShowcase(stories: readonly StoryRecord[]) {
  const rank = new Map(showcaseStoryOrder.map((id, index) => [id, index]));
  return [...stories].sort((left, right) => (rank.get(left.id) ?? 999) - (rank.get(right.id) ?? 999));
}

function ButtonsStory({ variant }: { variant: StoryVariant }) {
  if (variant.id === 'icon-only') {
    return (
      <div className="story-inline">
        <Button aria-label="Save" icon={<span aria-hidden="true">S</span>} variant="primary" />
        <Button aria-label="Flag" icon={<span aria-hidden="true">!</span>} variant="danger" />
        <Button aria-label="Details" icon={<span aria-hidden="true">i</span>} variant="secondary" />
      </div>
    );
  }

  if (variant.id === 'disabled') {
    return (
      <div className="story-inline">
        <Button disabled variant="primary">Primary</Button>
        <Button disabled variant="secondary">Secondary</Button>
        <Button disabled variant="danger">Danger</Button>
      </div>
    );
  }

  if (variant.id === 'sizes') {
    return (
      <div className="story-inline story-inline--baseline">
        <Button size="sm" variant="secondary">Small</Button>
        <Button size="md" variant="primary">Medium</Button>
        <Button size="lg" variant="secondary">Large</Button>
      </div>
    );
  }

  return (
    <div className="story-inline">
      <Button variant="primary" onClick={() => notifySuccess('Primary action fired.')}>Primary</Button>
      <Button variant="secondary" onClick={() => notifyInfo('Secondary action fired.')}>Secondary</Button>
      <Button variant="ghost" onClick={() => notifyWarning('Ghost action fired.')}>Ghost</Button>
      <Button variant="danger" onClick={() => notifyError('Danger action fired.')}>Danger</Button>
    </div>
  );
}

function PanelStory({ variant }: { variant: StoryVariant }) {
  const panelVariant = variant.id === 'strong' ? 'strong' : variant.id === 'accent' ? 'accent' : 'default';
  const padding = variant.id === 'compact' ? 'md' : 'section';

  return (
    <Panel className="story-panel-example" padding={padding} variant={panelVariant}>
      <p className="story-kicker">Workspace</p>
      <h3>Panel supports content-heavy component compositions.</h3>
      <p>It keeps spacing, contrast, and borders consistent across dashboard, editor, and game-facing layouts.</p>
    </Panel>
  );
}

function DisplayTitleStory({ variant }: { variant: StoryVariant }) {
  const role = variant.id === 'hero' ? 'hero' : variant.id === 'screen' ? 'screen' : 'section';

  return (
    <div className="story-title-stack">
      <p className="story-kicker">Launch Surface</p>
      <DisplayTitle role={role}>Component Library</DisplayTitle>
      <Callout compact tone={variant.id === 'accent' ? 'accent' : 'neutral'}>
        Use display titles with callouts to build finished product screens without rebuilding typography rules.
      </Callout>
    </div>
  );
}

function StatTileStory({ variant }: { variant: StoryVariant }) {
  return (
    <div className="story-metric-grid">
      <StatTile density={variant.id === 'dense' ? 'dense' : 'default'} label="Components" value="10" valueAccent valueLg />
      <StatTile density={variant.id === 'minimal' ? 'minimal' : 'default'} label="Packages" value="3" />
      <StatTile label="Stories" value="10" valueFirst={variant.id === 'value-first'} />
    </div>
  );
}

function OverlayActionDockStory({ variant }: { variant: StoryVariant }) {
  const placement = variant.id === 'rail' ? 'rail' : 'dock';
  const disabled = variant.id === 'disabled';

  return (
    <OverlayActionDock
      actions={[
        { label: 'Cancel', onClick: () => notifyInfo('Changes cancelled.'), variant: 'secondary' },
        { label: 'Archive', onClick: () => notifyWarning('Item archived.'), variant: 'danger', disabled },
        { label: 'Publish', onClick: () => notifySuccess('Published successfully.'), variant: 'primary' }
      ]}
      leading={placement === 'dock' ? <span className="story-dock-label">Release controls</span> : undefined}
      placement={placement}
    />
  );
}

function EmptyStateStory({ variant }: { variant: StoryVariant }) {
  const withLink = variant.id === 'help-link';
  const withAction = variant.id !== 'plain';

  return (
    <EmptyState
      action={withAction ? <Button onClick={() => notifyInfo('Create flow opened.')} variant="primary">Create item</Button> : null}
      helpLink={withLink ? { href: 'https://example.com', label: 'View documentation' } : undefined}
      message="There are no saved views in this workspace yet. Create one to keep frequently used filters close at hand."
      title="No saved views"
    />
  );
}

function LibraryCardStory({ variant }: { variant: StoryVariant }) {
  return (
    <div className="story-card-grid">
      {['Button', 'Panel', 'Torch'].map((title, index) => (
        <LibraryCard
          description={`${title} is ready for reusable app surfaces and catalog previews.`}
          key={title}
          meta={[
            { label: 'package', value: index === 2 ? 'three-primitives' : 'react-ui' },
            { label: 'version', value: '0.1' }
          ]}
          onClick={noop}
          selected={variant.id === 'selected' && index === 0}
          title={title}
        />
      ))}
    </div>
  );
}

function LibraryToolbarStory({ variant }: { variant: StoryVariant }) {
  const filters = [
    { label: 'Synth', count: 18, selected: true },
    { label: 'Drums', count: 12, selected: variant.id === 'filtered' },
    { label: 'Favorites', count: 7, selected: variant.id === 'filtered' }
  ];

  return (
    <div className="story-workbench">
      <LibraryToolbar
        actions={<Button size="sm" variant="primary">New preset</Button>}
        filters={filters}
        onFilterChange={noop}
        onSearchChange={noop}
        onSegmentChange={noop}
        searchPlaceholder="Search components, instruments, textures..."
        searchValue={variant.id === 'searching' ? 'analog pad' : ''}
        segmentOptions={[
          { label: 'Grid', value: 'grid' },
          { label: 'List', value: 'list' },
          { label: 'Compact', value: 'compact' }
        ]}
        segmentValue={variant.id === 'compact' ? 'compact' : 'grid'}
      />
      <div className="story-card-grid">
        {['Analog Pad', 'Pattern Stack', 'Texture Brush'].map((title, index) => (
          <LibraryCard
            description="Library-ready item with short metadata and stable selection states."
            key={title}
            meta={[{ label: 'uses', value: index === 2 ? 'texture' : 'audio' }]}
            selected={index === 0}
            title={title}
          />
        ))}
      </div>
    </div>
  );
}

const paletteColors = [
  { name: 'Ink', value: '#17202a' },
  { name: 'Moss', value: '#2aa876' },
  { name: 'Clay', value: '#b26b45' },
  { name: 'Gold', value: '#e6b44c' },
  { name: 'Mist', value: '#d8dee8' },
  { name: 'Signal', value: '#2457c5' },
  { name: 'Rose', value: '#bf3f3f' },
  { name: 'Stone', value: '#6b7280' }
] as const;

function TextureKitStory({ variant }: { variant: StoryVariant }) {
  const selected = variant.id === 'palette' ? '#2aa876' : '#2457c5';

  return (
    <div className="story-texture-workspace">
      <TexturePresetCard
        action={<Button size="sm" variant="primary">Apply</Button>}
        description="Preset card, swatches, and preview tile for texture tools and material browsers."
        preview={
          <TexturePreviewTile
            colors={variant.id === 'warm' ? ['#b26b45', '#e6b44c', '#17202a'] : ['#2457c5', '#2aa876', '#d8dee8']}
            material={variant.id === 'pixel' ? 'pixel grid' : 'procedural'}
            selected
            subtitle="64 px material"
            title={variant.id === 'warm' ? 'Ember stone' : 'Moss ceramic'}
          />
        }
        swatches={variant.id === 'warm' ? ['#b26b45', '#e6b44c', '#17202a'] : ['#2457c5', '#2aa876', '#d8dee8']}
        tags={variant.id === 'pixel' ? ['pixel', 'tile', 'editor'] : ['material', 'preset', 'preview']}
        title="Texture preset"
      />
      <PaletteSwatchGrid colors={paletteColors} onSelectColor={noop} selectedValue={selected} />
    </div>
  );
}

function MusicWorkspaceStory({ variant }: { variant: StoryVariant }) {
  const steps = variant.id === 'dense'
    ? [true, false, true, true, false, true, false, false, true, false, true, false, true, false, false, true]
    : [true, false, false, true, false, true, false, false, true, true, false, false, true, false, true, false];

  return (
    <div className="story-music-workspace">
      <div className="story-music-workspace__top">
        <TransportControls isPlaying={variant.id !== 'paused'} onNext={noop} onPlayPause={noop} onPrevious={noop} onStop={noop} />
        <LevelMeter label="Master" peak={0.86} value={variant.id === 'hot' ? 0.92 : 0.68} />
      </div>
      <StepGrid activeStep={variant.id === 'dense' ? 11 : 5} onStepToggle={noop} steps={steps} />
      <MiniTimeline markers={[{ label: 'intro', position: 0.16 }, { label: 'drop', position: 0.62 }]} progress={variant.id === 'paused' ? 0.38 : 0.7} />
    </div>
  );
}

function AeroLiquidStory({ variant }: { variant: StoryVariant }) {
  const accent = variant.id === 'coral' ? '#ff5c7a' : variant.id === 'violet' ? '#8b5cf6' : '#2aa876';

  return (
    <div className="story-aero-stage">
      <AeroLiquidBackground accent={accent} motion={variant.id === 'still' ? 'still' : 'auto'} />
      <div className="story-aero-stage__content">
        <p className="story-kicker">WebGL Surface</p>
        <DisplayTitle role="section">Aero Liquid</DisplayTitle>
        <p>Animated background for portfolio headers, launch panels, and immersive component presentations.</p>
      </div>
    </div>
  );
}

function ModalDialogStory({ variant }: { variant: StoryVariant }) {
  return (
    <div className="story-dialog-demo">
      <ModalDialog
        footer={
          <>
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">{variant.id === 'danger' ? 'Confirm' : 'Save changes'}</Button>
          </>
        }
        isOpen
        onClose={noop}
        showCloseButton={variant.id !== 'minimal'}
        title={variant.id === 'danger' ? 'Confirm release' : 'Workspace settings'}
      >
        {variant.id === 'form' ? (
          <div className="story-dialog-form">
            <label>
              Name
              <input defaultValue="Showcase preset" />
            </label>
            <label>
              Visibility
              <select defaultValue="public">
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </label>
          </div>
        ) : (
          <p>This dialog keeps focus, actions, and dense content aligned for app-level decision surfaces.</p>
        )}
      </ModalDialog>
    </div>
  );
}

function InstrumentPickerStory({ variant }: { variant: StoryVariant }) {
  return (
    <InstrumentPicker
      description="A compact selection grid for adding layers, devices, presets, or reusable library entries."
      items={[
        { id: 'drums', label: 'Drums', description: 'Percussion and rhythm', icon: 'D' },
        { id: 'bass', label: 'Bass', description: 'Low-end foundation', icon: 'B' },
        { id: 'keys', label: 'Keys', description: 'Chords and pads', icon: 'K' },
        { id: 'texture', label: 'Texture', description: 'Atmosphere layer', icon: 'T' }
      ]}
      onSelect={noop}
      selectedId={variant.id === 'texture' ? 'texture' : 'drums'}
      title={variant.id === 'devices' ? 'Choose a device' : 'Choose a layer'}
    />
  );
}

function GameHudStory({ variant }: { variant: StoryVariant }) {
  const lowHealth = variant.id === 'danger';

  return (
    <div className="story-hud-stage">
      <GameHudOverlay
        bottomLeft={<ControlHints hints={[{ key: 'WASD', action: 'Move' }, { key: 'Space', action: 'Jump' }, { key: 'E', action: 'Interact' }]} />}
        bottomRight={
          <InventorySlotGrid
            items={[
              { id: 'key', label: 'Key', rarity: 'rare', uses: '1' },
              { id: 'torch', label: 'Torch', rarity: 'common', uses: '8' },
              { id: 'gem', label: 'Gem', rarity: 'legendary', uses: '3' },
              { id: 'map', label: 'Map', rarity: 'uncommon' }
            ]}
            selectedId={variant.id === 'inventory' ? 'gem' : 'key'}
          />
        }
        topLeft={
          <div className="story-hud-stack">
            <ResourceMeter label="Health" max={10} tone="health" value={lowHealth ? 2 : 8} />
            <ResourceMeter label="Energy" max={100} tone="energy" value={variant.id === 'inventory' ? 64 : 82} />
          </div>
        }
        topRight={<StatTile density="dense" label="Score" value={variant.id === 'danger' ? '4,120' : '8,640'} valueAccent />}
      />
    </div>
  );
}

function MemoryDungeonKitStory({ variant }: { variant: StoryVariant }) {
  const hidden = variant.id === 'hidden-card';

  if (variant.id === 'relics') {
    return (
      <RelicChoiceGrid
        choices={[
          { id: 'mirror-lens', title: 'Mirror Lens', archetype: 'Recall', description: 'Preview one hidden pair before committing.', impact: '+Controlled reveal', rarity: 'rare' },
          { id: 'ember-cache', title: 'Ember Cache', archetype: 'Scoring', description: 'Bank bonus shards after long match chains.', impact: '+Chain value', rarity: 'uncommon' },
          { id: 'anchor-rune', title: 'Anchor Rune', archetype: 'Defense', description: 'Keep one matched pair stable through shuffle pressure.', impact: '+Board control', rarity: 'common' }
        ]}
        onPick={noop}
      />
    );
  }

  if (variant.id === 'hud') {
    return <MemoryHudStrip floor={12} lives={4} mode="Dungeon Showcase" score="32,780" />;
  }

  return (
    <div className="story-memory-dungeon-kit">
      <MemoryHudStrip floor={7} lives={3} score="18,420" />
      <div className="story-memory-card-row">
        <DungeonCardFace label="07" sigil="diamond" subtitle="Rune mirror" tone="gold" />
        <DungeonCardFace label="12" revealed={!hidden} sigil="hex" subtitle="Ember cache" tone="ember" />
        <DungeonCardFace label="21" sigil="triangle" subtitle="Frost ward" tone="frost" />
      </div>
    </div>
  );
}

function DungeonMapPanelStory({ variant }: { variant: StoryVariant }) {
  const compact = variant.id === 'compact';
  const bossRoute = variant.id === 'boss-route';
  const rooms = bossRoute
    ? [
        { id: 'start', label: 'S', type: 'start' as const, visited: true, x: 0, y: 2 },
        { id: 'enemy-a', label: 'E', type: 'enemy' as const, visited: true, x: 1, y: 2 },
        { id: 'puzzle', label: 'P', type: 'puzzle' as const, visited: true, x: 2, y: 2 },
        { id: 'boss', label: 'B', type: 'boss' as const, x: 3, y: 2 },
        { id: 'secret', label: '?', locked: true, type: 'secret' as const, x: 2, y: 1 },
        { id: 'treasure', label: 'T', type: 'treasure' as const, x: 1, y: 3 }
      ]
    : [
        { id: 'start', label: 'S', type: 'start' as const, visited: true, x: 0, y: 1 },
        { id: 'enemy-a', label: 'E', type: 'enemy' as const, visited: true, x: 1, y: 1 },
        { id: 'shop', label: '$', type: 'shop' as const, x: 1, y: 0 },
        { id: 'library', label: 'L', type: 'library' as const, x: 2, y: 0 },
        { id: 'puzzle', label: 'P', type: 'puzzle' as const, visited: true, x: 2, y: 1 },
        { id: 'treasure', label: 'T', type: 'treasure' as const, x: 3, y: 1 },
        { id: 'boss', label: 'B', locked: true, type: 'boss' as const, x: 4, y: 1 },
        { id: 'trap', label: '!', type: 'trap' as const, x: 2, y: 2 }
      ];

  const connections = bossRoute
    ? [
        { from: 'start', to: 'enemy-a' },
        { from: 'enemy-a', to: 'puzzle' },
        { from: 'puzzle', to: 'boss' },
        { from: 'puzzle', to: 'secret' },
        { from: 'enemy-a', to: 'treasure' }
      ]
    : [
        { from: 'start', to: 'enemy-a' },
        { from: 'enemy-a', to: 'shop' },
        { from: 'shop', to: 'library' },
        { from: 'enemy-a', to: 'puzzle' },
        { from: 'puzzle', to: 'treasure' },
        { from: 'treasure', to: 'boss' },
        { from: 'puzzle', to: 'trap' }
      ];

  return (
    <div className="story-dungeon-map-stage">
      <DungeonMapPanel
        algorithm={bossRoute ? 'Boss path branch' : 'Plus Pattern'}
        compact={compact}
        connections={connections}
        currentRoomId={bossRoute ? 'puzzle' : 'puzzle'}
        mapLabel={compact ? 'Compact Dungeon' : 'Ghost Dungeon'}
        rooms={compact ? rooms.slice(0, 5) : rooms}
        subtitle={bossRoute ? 'Route planning' : 'Generated run map'}
      />
    </div>
  );
}

function DeviceRackPanelStory({ variant }: { variant: StoryVariant }) {
  const mastering = variant.id === 'mastering';
  const bypassed = variant.id === 'bypass';

  return (
    <div className="story-device-rack-stage">
      <DeviceRackPanel
        plugins={[
          {
            id: 'instrument',
            name: mastering ? 'Stereo Imager' : 'Granular Sampler',
            health: 'info',
            latency: mastering ? '0.4 ms' : '0.1 ms',
            parameters: [
              { label: mastering ? 'Width' : 'Grain', value: mastering ? '118%' : '42 ms', automated: true },
              { label: mastering ? 'Mono cut' : 'Pitch', value: mastering ? '120 Hz' : '+7 st' },
              { label: mastering ? 'Balance' : 'Spread', value: mastering ? '0.5 L' : '63%' }
            ],
            slotLabel: 'Slot 1',
            vendor: 'BBeats'
          },
          {
            id: 'filter',
            name: mastering ? 'Tape Limiter' : 'State Variable Filter',
            health: mastering ? 'warning' : 'ok',
            latency: mastering ? '1.2 ms' : '0.2 ms',
            parameters: [
              { label: mastering ? 'Ceiling' : 'Cutoff', value: mastering ? '-0.8 dB' : '2.4 kHz', automated: true },
              { label: mastering ? 'Drive' : 'Resonance', value: mastering ? '18%' : '38%' },
              { label: mastering ? 'Release' : 'Mix', value: mastering ? 'Auto' : '82%' }
            ],
            slotLabel: 'Slot 2',
            vendor: mastering ? 'Master Bus' : 'BBeats'
          },
          {
            id: 'chorus',
            name: mastering ? 'Reference Meter' : 'Dimension Chorus',
            bypassed,
            health: bypassed ? 'warning' : 'ok',
            latency: '0.5 ms',
            parameters: [
              { label: 'Depth', value: bypassed ? '0%' : '24%' },
              { label: 'Rate', value: '0.8 Hz' },
              { label: 'Wet', value: bypassed ? '0%' : '31%' }
            ],
            slotLabel: 'Slot 3',
            vendor: 'Rack FX'
          }
        ]}
        selectedPluginId={mastering ? 'filter' : 'instrument'}
        stages={[
          { id: 'input', label: 'Input', value: mastering ? 'Mix Bus' : 'Kick Layer' },
          { id: 'instrument', label: 'Device', value: mastering ? 'Master' : 'Sampler' },
          { id: 'effects', label: 'Effects', value: bypassed ? '2 active' : '3 active', warning: bypassed },
          { id: 'output', label: 'Output', value: mastering ? 'Limiter' : 'Drum Bus' }
        ]}
        subtitle={mastering ? 'Master chain' : 'Track effects'}
        telemetry={mastering ? ['CPU 21%', '2.1 ms latency', 'True peak ready'] : ['CPU 14%', '0.8 ms latency', 'Automation ready']}
        title={mastering ? 'Master Device Rack' : 'Device Rack'}
      />
    </div>
  );
}

function PreviewCardStory({ variant }: { variant: StoryVariant }) {
  return (
    <div className="story-workbench">
      <PreviewCard
        action={<Button size="sm" variant="primary">Open</Button>}
        description={variant.id === 'compact' ? 'Small item preview for dense list layouts.' : 'Reusable preview card for products, rentals, projects, and media entries.'}
        meta={[
          { label: 'type', value: variant.id === 'project' ? 'project' : 'rental' },
          { label: 'status', value: variant.id === 'selected' ? 'selected' : 'ready' }
        ]}
        title={variant.id === 'project' ? 'Realtime Visual QA' : 'Explorer Van'}
      />
      <div className="story-card-grid">
        {['Studio Kit', 'Room Pack', 'Shader Demo'].map((title) => (
          <PreviewCard description="Compact card item." key={title} title={title} />
        ))}
      </div>
    </div>
  );
}

function FlipTileStory({ variant }: { variant: StoryVariant }) {
  return (
    <div className="story-flip-grid">
      {['A', 'B', 'C', 'D', 'E', 'F'].map((value, index) => (
        <FlipTile
          back={value}
          disabled={variant.id === 'disabled' && index > 3}
          flipped={variant.id === 'revealed' || index < 2}
          front="?"
          key={value}
          label={`Tile ${value}`}
        />
      ))}
    </div>
  );
}

function CalloutStory({ variant }: { variant: StoryVariant }) {
  const tone =
    variant.id === 'success' ? 'success' : variant.id === 'warning' ? 'warning' : variant.id === 'accent' ? 'accent' : 'neutral';

  return (
    <Callout
      action={variant.id === 'action' ? <Button variant="primary">Review</Button> : undefined}
      icon="i"
      title="Workspace sync complete"
      tone={tone}
    >
      Shared packages are linked and ready for the next application screen.
    </Callout>
  );
}

const iconNames = [
  'play',
  'save',
  'settings',
  'palette',
  'paint',
  'music',
  'drum',
  'guitar',
  'grid',
  'folder',
  'tag',
  'flame'
] as const;

function IconGlyphStory({ variant }: { variant: StoryVariant }) {
  const size = variant.id === 'large' ? 28 : 20;

  return (
    <div className="story-icon-grid">
      {iconNames.map((name) => (
        <span className="story-icon-grid__item" key={name} title={name}>
          <IconGlyph name={name} size={size} />
        </span>
      ))}
    </div>
  );
}

function TagEditorStory({ variant }: { variant: StoryVariant }) {
  return (
    <div className="story-inline">
      <TagEditor
        suggestions={['drums', 'loop', 'favorite', 'texture', 'demo', 'bass']}
        tags={variant.id === 'empty' ? [] : variant.id === 'dense' ? ['drums', 'loop', 'favorite', '808'] : ['drums', 'loop']}
      />
      <SelectionCheckbox checked={variant.id !== 'empty'} label="Selected" onToggle={noop} />
    </div>
  );
}

function InstrumentControlsStory({ variant }: { variant: StoryVariant }) {
  if (variant.id === 'drums') {
    return <DrumPadGrid activeId="snare" onPadPress={noop} />;
  }

  if (variant.id === 'tambourine') {
    return <TambourinePad active label="Tambourine" onShake={noop} />;
  }

  return (
    <div className="story-instrument-stack">
      <PianoKeyboard activeNotes={variant.id === 'minor' ? ['A', 'C', 'E'] : ['C', 'E', 'G']} onNotePress={noop} />
      <DrumPadGrid activeId="kick" onPadPress={noop} />
    </div>
  );
}

function SpellcasterHudStory({ variant }: { variant: StoryVariant }) {
  const danger = variant.id === 'danger';

  return (
    <div className="story-spellcaster-stage">
      <EnergyCore canFire={!danger} energy={danger ? 12 : variant.id === 'charging' ? 42 : 84} maxEnergy={100} />
      <TimerBadge seconds={danger ? 42 : 185} tone={danger ? 'danger' : variant.id === 'charging' ? 'warning' : 'neutral'} />
      <ScanlineOverlay intensity={variant.id === 'scanlines' ? 'strong' : 'subtle'} />
    </div>
  );
}

function TorchStory({ variant }: { variant: StoryVariant }) {
  const flicker = variant.id !== 'static';
  const scale = variant.id === 'large' ? 1.2 : 0.95;
  const cool = variant.id === 'cool';

  return (
    <div className="story-canvas">
      <Canvas camera={{ position: [0, 1.35, 4], fov: 45 }}>
        <ambientLight intensity={0.55} />
        <directionalLight intensity={1.15} position={[3, 4, 3]} />
        <Torch
          color={cool ? '#5ec8ff' : '#ff6b35'}
          flameColor={cool ? '#c8f3ff' : '#ffaa00'}
          flicker={flicker}
          position={[0, -0.8, 0]}
          scale={scale}
        />
      </Canvas>
    </div>
  );
}

function BrazierStory({ variant }: { variant: StoryVariant }) {
  const cool = variant.id === 'cool';
  const isLit = variant.id !== 'unlit';

  return (
    <div className="story-canvas">
      <Canvas camera={{ position: [0, 1.35, 4], fov: 45 }}>
        <ambientLight intensity={0.55} />
        <directionalLight intensity={1.2} position={[3, 4, 3]} />
        <Brazier
          bowlColor={variant.id === 'bronze' ? '#7b4d2b' : '#3f3430'}
          flameColor={cool ? '#72d7ff' : '#ff7a32'}
          isLit={isLit}
          position={[0, -0.65, 0]}
          scale={1.12}
        />
      </Canvas>
    </div>
  );
}

function FirstPersonHandStory({ variant }: { variant: StoryVariant }) {
  const gesture = variant.id === 'pointing' ? 'pointing' : variant.id === 'grip' ? 'grip' : 'idle';

  return (
    <div className="story-canvas story-canvas--first-person">
      <Canvas camera={{ position: [0, 0.1, 3.2], fov: 46 }}>
        <ambientLight intensity={0.62} />
        <directionalLight intensity={1.15} position={[2.5, 3, 3]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#263241" roughness={0.9} />
        </mesh>
        <FirstPersonHand gesture={gesture} handedness={variant.id === 'left' ? 'left' : 'right'} scale={1.25} />
        {variant.id === 'held-item' ? (
          <HeldItemAnchor position={[0.35, -0.35, -1.22]} rotation={[-0.7, 0.18, -0.42]} scale={0.54}>
            <Torch flicker={false} intensity={1.3} />
          </HeldItemAnchor>
        ) : null}
      </Canvas>
    </div>
  );
}

function SceneControlsStory({ variant }: { variant: StoryVariant }) {
  const active = variant.id === 'active';
  const open = variant.id === 'open' || active;

  return (
    <div className="story-canvas">
      <Canvas camera={{ position: [0, 1.45, 4.2], fov: 45 }}>
        <ambientLight intensity={0.62} />
        <directionalLight intensity={1.1} position={[3, 5, 3]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#e1e6ef" roughness={0.86} />
        </mesh>
        <Door open={open} position={[-1.1, 0, 0]} scale={0.9} />
        <Lever active={active} position={[0.55, 0.02, 0.18]} scale={0.85} />
        <PressurePlate pressed={active} position={[1.35, 0, 0.48]} scale={0.8} />
      </Canvas>
    </div>
  );
}

function DungeonPropsStory({ variant }: { variant: StoryVariant }) {
  const cool = variant.id === 'cool';

  return (
    <div className="story-canvas">
      <Canvas camera={{ position: [0, 2, 5.4], fov: 46 }}>
        <ambientLight intensity={0.48} />
        <directionalLight intensity={1.1} position={[3, 5, 3]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[7, 6]} />
          <meshStandardMaterial color={cool ? '#263241' : '#4a3f35'} roughness={0.9} />
        </mesh>
        <DungeonAltar accentColor={cool ? '#72d7ff' : '#d6a85e'} position={[0, 0, -0.35]} scale={0.78} />
        <TreasureChest isOpen={variant.id === 'open'} position={[-1.7, 0, 0.85]} scale={0.75} />
        <Statue animated={variant.id === 'animated'} position={[1.7, 0, 0.55]} scale={0.7} type={cool ? 'mage' : 'guardian'} />
        <Chain position={[-2.1, 2.2, -0.8]} scale={0.72} />
        <Chain position={[2.1, 2.2, -0.8]} scale={0.72} />
        <Web position={[0, 1.35, -1.7]} scale={0.78} />
        <Candle flameColor={cool ? '#72d7ff' : '#ff9d35'} position={[-0.55, 0.8, 0.5]} scale={0.65} />
      </Canvas>
    </div>
  );
}

function TrapAndEffectsStory({ variant }: { variant: StoryVariant }) {
  return (
    <div className="story-canvas">
      <Canvas camera={{ position: [0, 1.65, 4.4], fov: 45 }}>
        <ambientLight intensity={0.54} />
        <directionalLight intensity={1.05} position={[3, 5, 3]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#1f2937" roughness={0.88} />
        </mesh>
        <Spikes active={variant.id !== 'lowered'} count={7} position={[0, 0, 0.35]} />
        <ParticleField color={variant.id === 'ember' ? '#fb923c' : '#7dd3fc'} count={variant.id === 'dense' ? 140 : 80} radius={1.45} />
        <Candle flameColor={variant.id === 'ember' ? '#fb923c' : '#7dd3fc'} position={[-1.6, 0, -0.75]} scale={0.85} />
        <Candle flameColor={variant.id === 'ember' ? '#fb923c' : '#7dd3fc'} position={[1.6, 0, -0.75]} scale={0.85} />
      </Canvas>
    </div>
  );
}

function EnvironmentPropsStory({ variant }: { variant: StoryVariant }) {
  return (
    <div className="story-canvas">
      <Canvas camera={{ position: [0, 2.2, 5.6], fov: 46 }}>
        <ambientLight intensity={0.55} />
        <directionalLight intensity={1.15} position={[3, 5, 3]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[7, 6]} />
          <meshStandardMaterial color="#3d332b" roughness={0.88} />
        </mesh>
        <Table position={[0, 0, 0.2]} scale={0.85} />
        <Barrel position={[-1.6, 0, 0.7]} scale={0.72} />
        <Pillar position={[-2.25, 0, -0.7]} scale={0.82} />
        <Pillar position={[2.25, 0, -0.7]} scale={0.82} />
        <Fence position={[0, 0, -1.6]} scale={0.9} />
        <Bridge position={[0, 0, 1.6]} scale={0.72} />
        <MetalGate open={variant.id === 'open'} position={[1.65, 0, -1.25]} scale={0.58} />
      </Canvas>
    </div>
  );
}

function ItemOrbStory({ variant }: { variant: StoryVariant }) {
  return (
    <div className="story-canvas">
      <Canvas camera={{ position: [0, 1.25, 4], fov: 44 }}>
        <ambientLight intensity={0.55} />
        <directionalLight intensity={1.2} position={[3, 4, 3]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#17202a" roughness={0.88} />
        </mesh>
        <ItemOrb position={[-1.2, 0.6, 0]} rarity="uncommon" shape="box" />
        <ItemOrb position={[0, 0.65, 0]} rarity={variant.id === 'legendary' ? 'legendary' : 'rare'} />
        <ItemOrb position={[1.2, 0.6, 0]} rarity="epic" shape="cone" />
        <ParticleField color={variant.id === 'legendary' ? '#f59e0b' : '#60a5fa'} count={60} radius={1.8} />
      </Canvas>
    </div>
  );
}

function ProjectileEffectsStory({ variant }: { variant: StoryVariant }) {
  const color = variant.id === 'fire' ? '#fb923c' : variant.id === 'arcane' ? '#a78bfa' : '#2aa876';

  return (
    <div className="story-canvas">
      <Canvas camera={{ position: [0, 1.25, 4.1], fov: 44 }}>
        <ambientLight intensity={0.45} />
        <directionalLight intensity={1.1} position={[3, 4, 3]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#101827" roughness={0.9} />
        </mesh>
        <ProjectileTrail color={color} count={variant.id === 'dense' ? 12 : 8} length={2.2} position={[0, 0.72, 0.95]} />
        <ProjectileOrb color={color} position={[0, 0.72, 0.95]} scale={variant.id === 'dense' ? 1.12 : 1} speed={1.2} />
        <ParticleField color={color} count={variant.id === 'dense' ? 120 : 70} radius={1.7} />
      </Canvas>
    </div>
  );
}

function NotificationsStory({ variant }: { variant: StoryVariant }) {
  const { confirm, showInfo } = useNotificationActions();

  const runConfirm = async () => {
    const ok = await confirm('Publish these changes?');
    showInfo(ok ? 'Changes published.' : 'Publish cancelled.');
  };

  if (variant.id === 'confirm') {
    return <Button onClick={() => void runConfirm()} variant="primary">Open confirm dialog</Button>;
  }

  return (
    <div className="story-inline">
      <Button onClick={() => notifySuccess('Success toast from the notification bridge.')} variant="primary">Success</Button>
      <Button onClick={() => notifyWarning('Warning toast from the notification bridge.')} variant="secondary">Warning</Button>
      <Button onClick={() => notifyError('Error toast from the notification bridge.')} variant="danger">Error</Button>
    </div>
  );
}

const storyRegistryItems: StoryRecord[] = [
  {
    id: 'button',
    title: 'Button',
    group: 'UI Primitives',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { Button } from '@cross-repo-libs/react-ui';",
    overview: 'A compact action component for forms, toolbars, dialogs, and catalog controls.',
    usage: 'Use variants for hierarchy, sizes for density, and icon-only mode when the surrounding UI already provides context.',
    packageNotes: 'Ships with CSS variables and React types. No styled-components dependency.',
    previewSize: 'compact',
    variants: [
      { id: 'variants', label: 'Variants', description: 'Primary, secondary, ghost, and danger actions.' },
      { id: 'sizes', label: 'Sizes', description: 'Small, medium, and large sizing.' },
      { id: 'icon-only', label: 'Icon only', description: 'Stable square icon buttons with accessible labels.' },
      { id: 'disabled', label: 'Disabled', description: 'Disabled actions keep layout stable.' }
    ],
    render: (variant) => <ButtonsStory variant={variant} />
  },
  {
    id: 'panel',
    title: 'Panel',
    group: 'Application Components',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { Panel } from '@cross-repo-libs/react-ui';",
    overview: 'A framed layout surface for product sections, previews, settings panes, and dashboard modules.',
    usage: 'Choose a variant for emphasis and a padding mode that matches the density of the surrounding screen.',
    packageNotes: 'The component supports semantic tags and scroll-safe content areas.',
    previewSize: 'standard',
    variants: [
      { id: 'default', label: 'Default', description: 'Standard bordered surface.' },
      { id: 'accent', label: 'Accent', description: 'Soft highlighted panel.' },
      { id: 'strong', label: 'Strong', description: 'Dark high-contrast panel.' },
      { id: 'compact', label: 'Compact', description: 'Tighter padding for dense tools.' }
    ],
    render: (variant) => <PanelStory variant={variant} />
  },
  {
    id: 'display-title',
    title: 'DisplayTitle',
    group: 'UI Primitives',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { DisplayTitle, Callout } from '@cross-repo-libs/react-ui';",
    overview: 'A high-level title component for polished app surfaces, landing sections, panels, and modals.',
    usage: 'Use role presets to keep title scale consistent without manually choosing heading classes in each app.',
    packageNotes: 'Pairs well with Callout for finished page headers and product-ready states.',
    previewSize: 'standard',
    variants: [
      { id: 'hero', label: 'Hero', description: 'Large first-viewport title scale.' },
      { id: 'screen', label: 'Screen', description: 'Primary app-screen title.' },
      { id: 'section', label: 'Section', description: 'Balanced section heading.' },
      { id: 'accent', label: 'With callout', description: 'Title paired with an accent information block.' }
    ],
    render: (variant) => <DisplayTitleStory variant={variant} />
  },
  {
    id: 'stat-tile',
    title: 'StatTile',
    group: 'UI Primitives',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { StatTile } from '@cross-repo-libs/react-ui';",
    overview: 'A metric tile for compact status groups, dashboards, game overlays, and summary panels.',
    usage: 'Use density presets to fit the available space and accent values for primary metrics.',
    packageNotes: 'The tile is intentionally small and composable inside Panel grids.',
    previewSize: 'compact',
    variants: [
      { id: 'default', label: 'Default', description: 'Balanced metric tile.' },
      { id: 'dense', label: 'Dense', description: 'Compact status displays.' },
      { id: 'minimal', label: 'Minimal', description: 'Unframed metrics inside larger surfaces.' },
      { id: 'value-first', label: 'Value first', description: 'Promotes the value above the label.' }
    ],
    render: (variant) => <StatTileStory variant={variant} />
  },
  {
    id: 'overlay-action-dock',
    title: 'OverlayActionDock',
    group: 'UI Primitives',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { OverlayActionDock } from '@cross-repo-libs/react-ui';",
    overview: 'A structured action area for dialogs, overlays, drawers, and floating edit surfaces.',
    usage: 'Use dock placement for horizontal layouts and rail placement when actions need to sit beside a preview.',
    packageNotes: 'Primary and secondary actions are grouped automatically from the action list.',
    previewSize: 'compact',
    variants: [
      { id: 'dock', label: 'Dock', description: 'Horizontal primary and secondary grouping.' },
      { id: 'rail', label: 'Rail', description: 'Vertical action rail.' },
      { id: 'disabled', label: 'Disabled action', description: 'Decision surface with unavailable action.' }
    ],
    render: (variant) => <OverlayActionDockStory variant={variant} />
  },
  {
    id: 'empty-state',
    title: 'EmptyState',
    group: 'Application Components',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { EmptyState } from '@cross-repo-libs/react-ui';",
    overview: 'A clear content-state component for empty lists, searches, first-run screens, and setup prompts.',
    usage: 'Pair concise copy with one recovery action. Add a help link only when the user may need context.',
    packageNotes: 'Supports optional icon, action, title, and external documentation link.',
    previewSize: 'standard',
    variants: [
      { id: 'with-action', label: 'With action', description: 'Empty state with a primary recovery action.' },
      { id: 'help-link', label: 'Help link', description: 'Adds an external documentation link.' },
      { id: 'plain', label: 'Plain', description: 'Message-only content state.' }
    ],
    render: (variant) => <EmptyStateStory variant={variant} />
  },
  {
    id: 'library-card',
    title: 'LibraryCard',
    group: 'Application Components',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { LibraryCard } from '@cross-repo-libs/react-ui';",
    overview: 'A compact selectable card for component browsers, libraries, presets, and saved views.',
    usage: 'Use metadata chips for short facts and selected state for active library items.',
    packageNotes: 'Designed as a button-backed card with stable hover, focus, and selected states.',
    previewSize: 'standard',
    variants: [
      { id: 'default', label: 'Default', description: 'Unselected list items.' },
      { id: 'selected', label: 'Selected', description: 'Selected story state.' }
    ],
    render: (variant) => <LibraryCardStory variant={variant} />
  },
  {
    id: 'library-toolbar',
    title: 'LibraryToolbar',
    group: 'Application Components',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { LibraryToolbar, SearchInput, FilterChip, SegmentedControl } from '@cross-repo-libs/react-ui';",
    overview: 'A composed search, filter, and view-control header for component browsers, preset libraries, and editor drawers.',
    usage: 'Use the full toolbar for library screens, or import the search, chip, and segmented controls individually for compact tools.',
    packageNotes: 'Built with plain React and CSS variables so it can move between product surfaces without app theme dependencies.',
    previewSize: 'wide',
    variants: [
      { id: 'default', label: 'Default', description: 'Search, segmented view control, filters, and action.' },
      { id: 'searching', label: 'Searching', description: 'Toolbar with active query text.' },
      { id: 'filtered', label: 'Filtered', description: 'Multiple selected filter chips.' },
      { id: 'compact', label: 'Compact view', description: 'Segmented control set to compact mode.' }
    ],
    render: (variant) => <LibraryToolbarStory variant={variant} />
  },
  {
    id: 'texture-kit',
    title: 'TextureKit',
    group: 'Interactive Systems',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { PaletteSwatchGrid, TexturePresetCard, TexturePreviewTile } from '@cross-repo-libs/react-ui';",
    overview: 'Palette, texture tile, and preset-card components for texture creators, material browsers, and visual editor tools.',
    usage: 'Use swatches for color selection, preview tiles for browsable materials, and preset cards for richer editor surfaces.',
    packageNotes: 'The components render previews with CSS and do not require image assets or canvas setup.',
    previewSize: 'wide',
    variants: [
      { id: 'default', label: 'Default', description: 'Cool material preset with selected preview.' },
      { id: 'palette', label: 'Palette focus', description: 'Swatch grid emphasizing active color selection.' },
      { id: 'warm', label: 'Warm material', description: 'Alternate warm texture palette.' },
      { id: 'pixel', label: 'Pixel preset', description: 'Preset copy and tags for pixel-grid tools.' }
    ],
    render: (variant) => <TextureKitStory variant={variant} />
  },
  {
    id: 'music-workspace',
    title: 'MusicWorkspace',
    group: 'Interactive Systems',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { TransportControls, LevelMeter, StepGrid, MiniTimeline } from '@cross-repo-libs/react-ui';",
    overview: 'Transport, meter, step-grid, and timeline primitives for audio tools, beat editors, and media workspaces.',
    usage: 'Combine the primitives for a compact studio surface or import them separately inside existing editor layouts.',
    packageNotes: 'Keyboard and state wiring stays with the host app while the package supplies stable visual primitives.',
    previewSize: 'wide',
    variants: [
      { id: 'playing', label: 'Playing', description: 'Active transport with balanced meter.' },
      { id: 'paused', label: 'Paused', description: 'Paused transport and timeline progress.' },
      { id: 'hot', label: 'Hot meter', description: 'Higher output level state.' },
      { id: 'dense', label: 'Dense steps', description: 'A denser sequence pattern.' }
    ],
    render: (variant) => <MusicWorkspaceStory variant={variant} />
  },
  {
    id: 'aero-liquid-background',
    title: 'AeroLiquidBackground',
    group: 'Showcase Effects',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { AeroLiquidBackground } from '@cross-repo-libs/react-ui';",
    overview: 'A WebGL liquid background for polished portfolio headers, product moments, and immersive component surfaces.',
    usage: 'Use it as an absolutely positioned background or a framed visual panel with an accent color from the host brand.',
    packageNotes: 'Uses OGL when WebGL is available and falls back to layered CSS gradients when it is not.',
    previewSize: 'immersive',
    variants: [
      { id: 'default', label: 'Default', description: 'Green-blue liquid motion surface.' },
      { id: 'coral', label: 'Coral', description: 'Warmer accent colorway.' },
      { id: 'violet', label: 'Violet', description: 'Cool purple accent colorway.' },
      { id: 'still', label: 'Still', description: 'Motion disabled for quiet contexts.' }
    ],
    render: (variant) => <AeroLiquidStory variant={variant} />
  },
  {
    id: 'modal-dialog',
    title: 'ModalDialog',
    group: 'Application Components',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { ModalDialog } from '@cross-repo-libs/react-ui';",
    overview: 'A focus-managed dialog shell for confirmations, settings forms, and compact workflow decisions.',
    usage: 'Pass title, body, footer actions, and an onClose handler. The shell handles escape, backdrop close, and focus wrapping.',
    packageNotes: 'Styled with package CSS variables and no styled-components dependency.',
    previewSize: 'wide',
    variants: [
      { id: 'default', label: 'Default', description: 'Dialog with title, body, close button, and actions.' },
      { id: 'form', label: 'Form', description: 'Dialog containing form controls.' },
      { id: 'danger', label: 'Confirm', description: 'Confirmation copy and actions.' },
      { id: 'minimal', label: 'Minimal', description: 'Dialog without the close button.' }
    ],
    render: (variant) => <ModalDialogStory variant={variant} />
  },
  {
    id: 'instrument-picker',
    title: 'InstrumentPicker',
    group: 'Application Components',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { InstrumentPicker } from '@cross-repo-libs/react-ui';",
    overview: 'A compact selection grid for adding instruments, devices, presets, or typed library entries.',
    usage: 'Provide items with id, label, description, and optional icon; selection state remains controlled by the host app.',
    packageNotes: 'Works as a standalone panel or inside ModalDialog and Panel surfaces.',
    previewSize: 'standard',
    variants: [
      { id: 'layers', label: 'Layers', description: 'Layer selection grid.' },
      { id: 'devices', label: 'Devices', description: 'Device-oriented heading copy.' },
      { id: 'texture', label: 'Selected texture', description: 'Different selected item state.' }
    ],
    render: (variant) => <InstrumentPickerStory variant={variant} />
  },
  {
    id: 'game-hud',
    title: 'GameHud',
    group: 'Interactive Systems',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { GameHudOverlay, ResourceMeter, InventorySlotGrid, ControlHints } from '@cross-repo-libs/react-ui';",
    overview: 'Overlay primitives for game HUDs, interactive previews, and full-screen tool surfaces.',
    usage: 'Compose resource meters, inventory slots, and control hints into the four overlay corners.',
    packageNotes: 'The overlay is pointer-safe by default and individual corner content remains interactive.',
    previewSize: 'immersive',
    variants: [
      { id: 'default', label: 'Default', description: 'Balanced HUD composition.' },
      { id: 'inventory', label: 'Inventory focus', description: 'Inventory selection emphasized.' },
      { id: 'danger', label: 'Danger state', description: 'Low-health state for urgent screens.' }
    ],
    render: (variant) => <GameHudStory variant={variant} />
  },
  {
    id: 'memory-dungeon-kit',
    title: 'MemoryDungeonKit',
    group: 'Interactive Systems',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { DungeonCardFace, MemoryHudStrip, RelicChoiceGrid } from '@cross-repo-libs/react-ui';",
    overview: 'A polished memory-game UI kit with procedural card faces, relic draft cards, and a compact dungeon HUD strip.',
    usage: 'Use the pieces together for game-like showcase surfaces or separately for reward choices, card states, and run summaries.',
    packageNotes: 'Adapted into plain React and CSS components with no game store, asset pipeline, Pixi, or WebGL dependency.',
    previewSize: 'wide',
    variants: [
      { id: 'cards', label: 'Cards and HUD', description: 'Dungeon card faces paired with a run HUD.' },
      { id: 'hidden-card', label: 'Hidden card', description: 'One card in hidden pair state.' },
      { id: 'relics', label: 'Relic draft', description: 'Three selectable relic choices.' },
      { id: 'hud', label: 'HUD strip', description: 'Standalone compact run HUD.' }
    ],
    render: (variant) => <MemoryDungeonKitStory variant={variant} />
  },
  {
    id: 'dungeon-map-panel',
    title: 'DungeonMapPanel',
    group: 'Interactive Systems',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { DungeonMapPanel } from '@cross-repo-libs/react-ui';",
    overview: 'A generated dungeon map panel for routes, room states, current-room context, and compact run overlays.',
    usage: 'Pass room coordinates and optional connections; current, visited, locked, and room-type states are controlled by the host app.',
    packageNotes: 'Adapted from gem-dungeon map UI into a store-free React component with CSS-only room rendering.',
    previewSize: 'wide',
    variants: [
      { id: 'default', label: 'Generated map', description: 'Branching route with room states.' },
      { id: 'boss-route', label: 'Boss route', description: 'Short route with secret and treasure branches.' },
      { id: 'compact', label: 'Compact', description: 'Smaller overlay-friendly map panel.' }
    ],
    render: (variant) => <DungeonMapPanelStory variant={variant} />
  },
  {
    id: 'preview-card',
    title: 'PreviewCard',
    group: 'Application Components',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { PreviewCard } from '@cross-repo-libs/react-ui';",
    overview: 'A flexible preview card for projects, rentals, products, media entries, and compact catalog rows.',
    usage: 'Use title, description, optional image, metadata, and one action for list previews that need more context than a chip.',
    packageNotes: 'The card uses a generated fallback media block when no image is provided.',
    previewSize: 'wide',
    variants: [
      { id: 'default', label: 'Default', description: 'Listing-style preview card.' },
      { id: 'project', label: 'Project', description: 'Project preview copy and metadata.' },
      { id: 'compact', label: 'Compact', description: 'Dense card copy for list-heavy layouts.' },
      { id: 'selected', label: 'Selected copy', description: 'Metadata representing selected status.' }
    ],
    render: (variant) => <PreviewCardStory variant={variant} />
  },
  {
    id: 'device-rack-panel',
    title: 'DeviceRackPanel',
    group: 'Application Components',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { DeviceRackPanel } from '@cross-repo-libs/react-ui';",
    overview: 'A polished plugin/device rack surface for audio tools, creative editors, and signal-chain dashboards.',
    usage: 'Provide plugins, signal-flow stages, telemetry, and selected/bypassed states from the host app. Parameter values can be plain text or custom React nodes.',
    packageNotes: 'Adapted from BBeats WAM rack presentation without styled-components, runtime plugin hosts, stores, or automation write coupling.',
    previewSize: 'wide',
    variants: [
      { id: 'default', label: 'Track rack', description: 'Instrument and effect chain.' },
      { id: 'mastering', label: 'Mastering', description: 'Master bus rack with limiter telemetry.' },
      { id: 'bypass', label: 'Bypass state', description: 'Bypassed device and warning flow state.' }
    ],
    render: (variant) => <DeviceRackPanelStory variant={variant} />
  },
  {
    id: 'flip-tile',
    title: 'FlipTile',
    group: 'UI Primitives',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { FlipTile } from '@cross-repo-libs/react-ui';",
    overview: 'A small 3D flip tile for memory games, reveal states, onboarding cards, and compact playful interactions.',
    usage: 'Control the flipped state from the host app and use disabled state for matched or unavailable tiles.',
    packageNotes: 'Implemented with CSS transforms and regular buttons for simple integration.',
    previewSize: 'compact',
    variants: [
      { id: 'mixed', label: 'Mixed', description: 'Partially revealed tile set.' },
      { id: 'revealed', label: 'Revealed', description: 'All tiles flipped.' },
      { id: 'disabled', label: 'Disabled', description: 'Some unavailable tiles.' }
    ],
    render: (variant) => <FlipTileStory variant={variant} />
  },
  {
    id: 'callout',
    title: 'Callout',
    group: 'UI Primitives',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { Callout } from '@cross-repo-libs/react-ui';",
    overview: 'An information block for setup guidance, status summaries, upgrade notices, and contextual help.',
    usage: 'Use tone to match the message priority and add an action only for a direct next step.',
    packageNotes: 'Works as a standalone surface or inside Panel-based layouts.',
    previewSize: 'compact',
    variants: [
      { id: 'neutral', label: 'Neutral', description: 'Standard contextual note.' },
      { id: 'accent', label: 'Accent', description: 'Highlighted information block.' },
      { id: 'success', label: 'Success', description: 'Positive completion state.' },
      { id: 'warning', label: 'Warning', description: 'Attention state without destructive styling.' },
      { id: 'action', label: 'With action', description: 'Callout with a direct next step.' }
    ],
    render: (variant) => <CalloutStory variant={variant} />
  },
  {
    id: 'icon-glyph',
    title: 'IconGlyph',
    group: 'UI Primitives',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { IconGlyph } from '@cross-repo-libs/react-ui';",
    overview: 'A compact SVG icon set for editor chrome, music tools, library actions, and game-facing controls.',
    usage: 'Use named glyphs inside buttons, cards, toolbars, and empty states where a small symbol improves scan speed.',
    packageNotes: 'The icons inherit currentColor and ship as typed React components with no icon package dependency.',
    previewSize: 'compact',
    variants: [
      { id: 'default', label: 'Default', description: 'Common library and editor glyphs.' },
      { id: 'large', label: 'Large', description: 'Larger sizing for dense icon review.' }
    ],
    render: (variant) => <IconGlyphStory variant={variant} />
  },
  {
    id: 'tag-editor',
    title: 'TagEditor',
    group: 'UI Primitives',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { TagEditor, SelectionCheckbox } from '@cross-repo-libs/react-ui';",
    overview: 'A compact tag editor with removable chips, suggestions, keyboard entry, and a paired selection checkbox.',
    usage: 'Use it in asset libraries, preset browsers, media catalogs, and batch-selection toolbars.',
    packageNotes: 'State can remain controlled by the host through onChange while the component handles entry cleanup and duplicate tags.',
    previewSize: 'compact',
    variants: [
      { id: 'default', label: 'Default', description: 'Tag editor with active chips and suggestions.' },
      { id: 'empty', label: 'Empty', description: 'No current tags with selection off.' },
      { id: 'dense', label: 'Dense', description: 'More active tags for library metadata.' }
    ],
    render: (variant) => <TagEditorStory variant={variant} />
  },
  {
    id: 'instrument-controls',
    title: 'InstrumentControls',
    group: 'Interactive Systems',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { PianoKeyboard, DrumPadGrid, TambourinePad } from '@cross-repo-libs/react-ui';",
    overview: 'Playable-looking piano, drum, and tambourine controls for music apps, beat tools, and compact instrument panels.',
    usage: 'Wire note, pad, and shake callbacks to the host audio engine while keeping the visual controls reusable.',
    packageNotes: 'The controls are dependency-light React buttons and do not bundle audio playback or samples.',
    previewSize: 'standard',
    variants: [
      { id: 'piano', label: 'Piano and pads', description: 'Keyboard paired with drum pads.' },
      { id: 'minor', label: 'Minor chord', description: 'Alternate active note state.' },
      { id: 'drums', label: 'Drums', description: 'Standalone drum pad grid.' },
      { id: 'tambourine', label: 'Tambourine', description: 'Circular tambourine control.' }
    ],
    render: (variant) => <InstrumentControlsStory variant={variant} />
  },
  {
    id: 'spellcaster-hud',
    title: 'SpellcasterHud',
    group: 'Interactive Systems',
    packageName: '@cross-repo-libs/react-ui',
    importSnippet: "import { EnergyCore, TimerBadge, ScanlineOverlay } from '@cross-repo-libs/react-ui';",
    overview: 'Retro game HUD pieces for energy meters, countdowns, scanline overlays, and interactive first-person demos.',
    usage: 'Compose the pieces over canvas scenes or inside game dashboards that need strong state feedback.',
    packageNotes: 'The HUD pieces are regular DOM components so they can sit above Three.js, video, or CSS scenes.',
    previewSize: 'standard',
    variants: [
      { id: 'ready', label: 'Ready', description: 'Healthy energy and neutral timer.' },
      { id: 'charging', label: 'Charging', description: 'Recharge state with warning timer tone.' },
      { id: 'danger', label: 'Danger', description: 'Low-energy state.' },
      { id: 'scanlines', label: 'Scanlines', description: 'Stronger scanline overlay.' }
    ],
    render: (variant) => <SpellcasterHudStory variant={variant} />
  },
  {
    id: 'torch',
    title: 'Torch',
    group: '3D Primitives',
    packageName: '@cross-repo-libs/three-primitives',
    importSnippet: "import { Torch } from '@cross-repo-libs/three-primitives';",
    overview: 'A portable scene prop with layered flame geometry and a live point light.',
    usage: 'Use it in R3F scenes where a small animated light source helps sell depth.',
    packageNotes: 'No physics engine or external asset dependency is required.',
    previewSize: 'canvas',
    variants: [
      { id: 'warm', label: 'Warm flame', description: 'Default warm scene torch.' },
      { id: 'cool', label: 'Cool flame', description: 'Alternate colorway for themed scenes.' },
      { id: 'static', label: 'Static light', description: 'Flicker disabled for predictable scenes.' },
      { id: 'large', label: 'Large', description: 'Scaled preview primitive.' }
    ],
    render: (variant) => <TorchStory variant={variant} />
  },
  {
    id: 'brazier',
    title: 'Brazier',
    group: '3D Primitives',
    packageName: '@cross-repo-libs/three-primitives',
    importSnippet: "import { Brazier } from '@cross-repo-libs/three-primitives';",
    overview: 'A compact 3D prop for ambient scene lighting, preview rooms, and fantasy interface backdrops.',
    usage: 'Use lit and unlit variants to match scene state. Color variants support themed environments without texture assets.',
    packageNotes: 'Built from simple geometries for reliable bundling and fast preview rendering.',
    previewSize: 'canvas',
    variants: [
      { id: 'warm', label: 'Warm', description: 'Default warm flame and dark metal bowl.' },
      { id: 'cool', label: 'Cool', description: 'Cool flame for alternate environment themes.' },
      { id: 'bronze', label: 'Bronze', description: 'Warmer metal finish.' },
      { id: 'unlit', label: 'Unlit', description: 'Scene prop without flame or light.' }
    ],
    render: (variant) => <BrazierStory variant={variant} />
  },
  {
    id: 'first-person-hand',
    title: 'FirstPersonHand',
    group: '3D Primitives',
    packageName: '@cross-repo-libs/three-primitives',
    importSnippet: "import { FirstPersonHand, HeldItemAnchor } from '@cross-repo-libs/three-primitives';",
    overview: 'A dependency-light first-person hand primitive for R3F previews, interactive demos, and held-item scenes.',
    usage: 'Use gestures to match interaction state and HeldItemAnchor to mount scene props near the hand.',
    packageNotes: 'No physics runtime, input manager, or external model assets are required.',
    previewSize: 'canvas',
    variants: [
      { id: 'idle', label: 'Idle', description: 'Default first-person presentation.' },
      { id: 'pointing', label: 'Pointing', description: 'Gesture state for selection and inspection.' },
      { id: 'grip', label: 'Grip', description: 'Closed-hand interaction state.' },
      { id: 'held-item', label: 'Held item', description: 'Hand paired with a held torch primitive.' },
      { id: 'left', label: 'Left hand', description: 'Mirrored handedness.' }
    ],
    render: (variant) => <FirstPersonHandStory variant={variant} />
  },
  {
    id: 'scene-controls',
    title: 'SceneControls',
    group: '3D Primitives',
    packageName: '@cross-repo-libs/three-primitives',
    importSnippet: "import { Door, Lever, PressurePlate } from '@cross-repo-libs/three-primitives';",
    overview: 'Small interactive scene props for doors, switches, plates, preview rooms, and game-like UI backdrops.',
    usage: 'Drive open, active, and pressed states from the host app while keeping the geometry self-contained.',
    packageNotes: 'Built from primitive geometry for fast loading and reliable Storybook rendering.',
    previewSize: 'canvas',
    variants: [
      { id: 'idle', label: 'Idle', description: 'Closed door, neutral lever, raised pressure plate.' },
      { id: 'open', label: 'Open door', description: 'Door state open with neutral controls.' },
      { id: 'active', label: 'Active controls', description: 'Lever and plate active with door open.' }
    ],
    render: (variant) => <SceneControlsStory variant={variant} />
  },
  {
    id: 'dungeon-props',
    title: 'DungeonProps',
    group: '3D Primitives',
    packageName: '@cross-repo-libs/three-primitives',
    importSnippet: "import { Candle, Chain, DungeonAltar, Statue, TreasureChest, Web } from '@cross-repo-libs/three-primitives';",
    overview: 'A small prop set for dungeon rooms, portfolio scenes, fantasy previews, and game-like interface backdrops.',
    usage: 'Compose the props inside any R3F canvas and drive state through simple color and open/animated props.',
    packageNotes: 'Built with primitive geometry only: no physics runtime, text renderer, external model, or texture loader required.',
    previewSize: 'canvas',
    variants: [
      { id: 'default', label: 'Default', description: 'Warm altar scene with supporting props.' },
      { id: 'open', label: 'Open chest', description: 'Treasure chest state open.' },
      { id: 'animated', label: 'Animated statue', description: 'Subtle animated statue state.' },
      { id: 'cool', label: 'Cool theme', description: 'Cool lighting and mage statue variant.' }
    ],
    render: (variant) => <DungeonPropsStory variant={variant} />
  },
  {
    id: 'trap-and-effects',
    title: 'TrapAndEffects',
    group: '3D Primitives',
    packageName: '@cross-repo-libs/three-primitives',
    importSnippet: "import { Spikes, ParticleField, Candle } from '@cross-repo-libs/three-primitives';",
    overview: 'Trap and lightweight particle primitives for interactive rooms, effect previews, and visual state demos.',
    usage: 'Use spikes for active/inactive hazard state and ParticleField for ambient magic, dust, or ember motion.',
    packageNotes: 'The particle field uses generated buffer geometry, so no image assets or external particle engine are required.',
    previewSize: 'canvas',
    variants: [
      { id: 'default', label: 'Default', description: 'Raised spikes with cool particles.' },
      { id: 'lowered', label: 'Lowered', description: 'Inactive lower spike state.' },
      { id: 'ember', label: 'Ember', description: 'Warm ember-style effect.' },
      { id: 'dense', label: 'Dense field', description: 'Higher particle count.' }
    ],
    render: (variant) => <TrapAndEffectsStory variant={variant} />
  },
  {
    id: 'environment-props',
    title: 'EnvironmentProps',
    group: '3D Primitives',
    packageName: '@cross-repo-libs/three-primitives',
    importSnippet: "import { Table, Barrel, Pillar, Fence, Bridge, MetalGate } from '@cross-repo-libs/three-primitives';",
    overview: 'Reusable environment props for prototype rooms, editor previews, tableaus, and lightweight game scenes.',
    usage: 'Combine the props to block out room layouts without importing physics, model assets, or texture loaders.',
    packageNotes: 'All props are primitive geometry and accept basic color, size, state, position, and scale props.',
    previewSize: 'canvas',
    variants: [
      { id: 'default', label: 'Default', description: 'Room prop composition.' },
      { id: 'open', label: 'Open gate', description: 'Gate state opened for scene variation.' }
    ],
    render: (variant) => <EnvironmentPropsStory variant={variant} />
  },
  {
    id: 'item-orb',
    title: 'ItemOrb',
    group: '3D Primitives',
    packageName: '@cross-repo-libs/three-primitives',
    importSnippet: "import { ItemOrb } from '@cross-repo-libs/three-primitives';",
    overview: 'A floating collectible primitive with rarity color, glow ring, and simple shape variants.',
    usage: 'Use item rarity and shape props for pickups, rewards, shop previews, and inventory scene markers.',
    packageNotes: 'Uses generated geometry and material glow only; no text or texture dependency is required.',
    previewSize: 'canvas',
    variants: [
      { id: 'default', label: 'Default', description: 'Rare center orb with supporting variants.' },
      { id: 'legendary', label: 'Legendary', description: 'Legendary center item colorway.' }
    ],
    render: (variant) => <ItemOrbStory variant={variant} />
  },
  {
    id: 'projectile-effects',
    title: 'ProjectileEffects',
    group: '3D Primitives',
    packageName: '@cross-repo-libs/three-primitives',
    importSnippet: "import { ProjectileOrb, ProjectileTrail } from '@cross-repo-libs/three-primitives';",
    overview: 'A glowing projectile orb and trail pair for first-person demos, spell effects, pickups, and lightweight game scenes.',
    usage: 'Place the orb and trail inside an R3F canvas and drive color, scale, and trail density from gameplay state.',
    packageNotes: 'Uses generated geometry and standard materials only, so it does not require Rapier, shaders, or external textures.',
    previewSize: 'canvas',
    variants: [
      { id: 'default', label: 'Default', description: 'Green projectile with ambient particles.' },
      { id: 'fire', label: 'Fire', description: 'Warm projectile colorway.' },
      { id: 'arcane', label: 'Arcane', description: 'Purple projectile colorway.' },
      { id: 'dense', label: 'Dense trail', description: 'Longer trail and denser particle field.' }
    ],
    render: (variant) => <ProjectileEffectsStory variant={variant} />
  },
  {
    id: 'notifications',
    title: 'Notifications',
    group: 'Notifications',
    packageName: '@cross-repo-libs/notifications',
    importSnippet: "import { NotificationHost, notifySuccess } from '@cross-repo-libs/notifications';",
    overview: 'A toast and confirmation layer for React screens and imperative non-React callers.',
    usage: 'Mount one host near the app root, then call notify helpers from commands, services, and UI events.',
    packageNotes: 'Includes accessible roles, confirm promises, CSS variables, and fallback logging.',
    previewSize: 'compact',
    variants: [
      { id: 'toasts', label: 'Toasts', description: 'Imperative success, warning, and error helpers.' },
      { id: 'confirm', label: 'Confirm', description: 'Promise-based confirm notification flow.' }
    ],
    render: (variant) => <NotificationsStory variant={variant} />
  }
];

export const storyRegistry: StoryRecord[] = sortStoriesForShowcase(storyRegistryItems);
