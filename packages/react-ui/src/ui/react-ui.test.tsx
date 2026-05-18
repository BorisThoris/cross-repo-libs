import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { AeroLiquidBackground } from './AeroLiquidBackground.js';
import { FlipTile, PreviewCard } from './ArchiveCards.js';
import { Button } from './Button.js';
import { Callout } from './Callout.js';
import { DeviceRackPanel } from './DeviceRackPanel.js';
import { DisplayTitle } from './DisplayTitle.js';
import { EmptyState } from './EmptyState.js';
import { ControlHints, GameHudOverlay, InventorySlotGrid, ResourceMeter } from './GameHud.js';
import { IconGlyph } from './IconGlyph.js';
import { DrumPadGrid, PianoKeyboard, TambourinePad } from './InstrumentControls.js';
import { InstrumentPicker } from './InstrumentPicker.js';
import { LibraryCard } from './LibraryCard.js';
import { FilterChip, LibraryToolbar, SearchInput, SegmentedControl } from './LibraryToolbar.js';
import { DungeonMapPanel } from './DungeonMapPanel.js';
import { DungeonCardFace, MemoryHudStrip, RelicChoiceGrid } from './MemoryDungeonKit.js';
import { ModalDialog } from './ModalDialog.js';
import { LevelMeter, MiniTimeline, StepGrid, TransportControls } from './MusicWorkspace.js';
import { OverlayActionDock } from './OverlayActionDock.js';
import { Panel } from './Panel.js';
import { EnergyCore, ScanlineOverlay, TimerBadge } from './SpellcasterHud.js';
import { StatTile } from './StatTile.js';
import { SelectionCheckbox, TagEditor } from './TagEditor.js';
import { PaletteSwatchGrid, TexturePresetCard, TexturePreviewTile } from './TextureKit.js';

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot> | null = null;

async function render(node: React.ReactNode) {
  await act(async () => {
    root = createRoot(container);
    root.render(node);
  });
}

describe('react-ui components', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root!.unmount();
      });
      root = null;
    }
    container.remove();
  });

  test('Button renders labels, icons, variants, and callbacks', async () => {
    const onClick = vi.fn();
    await render(
      <Button icon={<span data-testid="icon">i</span>} onClick={onClick} variant="primary">
        Run
      </Button>
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Run');
    expect(container.querySelector('[data-testid="icon"]')).toBeTruthy();
    expect(button.className).toContain('crui-button--primary');

    await act(async () => {
      button.click();
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('Panel and StatTile expose stable classes for composed layouts', async () => {
    await render(
      <Panel as="section" padding="lg" variant="accent">
        <StatTile label="Tests" value="42" valueAccent valueFirst />
      </Panel>
    );

    const panel = container.querySelector('section');
    const stat = container.querySelector('.crui-stat');
    expect(panel?.className).toContain('crui-panel--accent');
    expect(panel?.className).toContain('crui-panel--padding-lg');
    expect(stat?.textContent).toContain('Tests');
    expect(stat?.textContent).toContain('42');
  });

  test('DisplayTitle and Callout render public high-level UI patterns', async () => {
    await render(
      <Callout action={<Button>Open</Button>} title="System ready" tone="success">
        Components are available for production screens.
      </Callout>
    );

    expect(container.querySelector('.crui-callout--success')).toBeTruthy();
    expect(container.textContent).toContain('System ready');

    await act(async () => {
      root!.unmount();
      root = null;
    });

    await render(<DisplayTitle role="hero">Component Library</DisplayTitle>);
    const title = container.querySelector('h1');
    expect(title?.className).toContain('crui-display-title--hero');
  });

  test('OverlayActionDock groups primary and secondary actions', async () => {
    const primary = vi.fn();
    const secondary = vi.fn();

    await render(
      <OverlayActionDock
        actions={[
          { label: 'Cancel', onClick: secondary, variant: 'secondary' },
          { label: 'Save', onClick: primary, variant: 'primary' }
        ]}
        placement="dock"
      />
    );

    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.map((button) => button.textContent)).toEqual(['Cancel', 'Save']);
    await act(async () => {
      buttons[1].click();
    });
    expect(primary).toHaveBeenCalledTimes(1);
  });

  test('LibraryCard renders metadata and selected state', async () => {
    await render(
      <LibraryCard
        description="Reusable source"
        meta={[{ label: 'repo', value: 'BBeats' }]}
        selected
        title="Library card"
      />
    );

    const card = container.querySelector('button') as HTMLButtonElement;
    expect(card.textContent).toContain('Library card');
    expect(card.textContent).toContain('BBeats');
    expect(card.className).toContain('crui-library-card--selected');
  });

  test('EmptyState renders optional action and help link', async () => {
    await render(
      <EmptyState
        action={<Button>Retry</Button>}
        helpLink={{ href: 'https://example.com', label: 'Docs' }}
        message="Nothing here"
        title="Empty"
      />
    );

    expect(container.textContent).toContain('Nothing here');
    expect(container.querySelector('a')?.textContent).toBe('Docs');
    expect(container.querySelector('button')?.textContent).toBe('Retry');
  });

  test('library toolbar controls expose search, segments, and filters', async () => {
    const onSearch = vi.fn();
    const onSegment = vi.fn();
    const onFilter = vi.fn();

    await render(
      <LibraryToolbar
        filters={[{ label: 'Synth', count: 8, selected: true }, { label: 'Drums', count: 12 }]}
        onFilterChange={onFilter}
        onSearchChange={onSearch}
        onSegmentChange={onSegment}
        searchValue="pad"
        segmentOptions={[{ label: 'Grid', value: 'grid' }, { label: 'List', value: 'list' }]}
        segmentValue="grid"
      />
    );

    await act(async () => {
      (container.querySelector('[aria-label="Clear search"]') as HTMLButtonElement).click();
    });
    expect(onSearch).toHaveBeenCalledWith('');

    await act(async () => {
      Array.from(container.querySelectorAll('button')).find((button) => button.textContent === 'List')?.click();
    });
    expect(onSegment).toHaveBeenCalledWith('list');

    await act(async () => {
      Array.from(container.querySelectorAll('button')).find((button) => button.textContent?.includes('Drums'))?.click();
    });
    expect(onFilter).toHaveBeenCalledWith('Drums', true);
  });

  test('standalone library controls render selected state', async () => {
    await render(
      <>
        <SearchInput label="Find" onValueChange={vi.fn()} value="kick" />
        <FilterChip selected>Tagged</FilterChip>
        <SegmentedControl ariaLabel="Mode" options={[{ label: 'A', value: 'a' }]} value="a" />
      </>
    );

    expect(container.querySelector('.crui-search-input')?.textContent).toContain('Find');
    expect(container.querySelector('.crui-filter-chip--selected')).toBeTruthy();
    expect(container.querySelector('.crui-segmented-control button')?.getAttribute('aria-pressed')).toBe('true');
  });

  test('texture kit renders palettes, texture tiles, and preset cards', async () => {
    const onSelectColor = vi.fn();
    await render(
      <TexturePresetCard
        action={<button type="button">Apply</button>}
        description="Ready for material previews."
        preview={<TexturePreviewTile colors={['#2457c5', '#2aa876']} selected subtitle="32 px" title="Moss tile" />}
        swatches={['#2457c5', '#2aa876']}
        tags={['tile', 'rough']}
        title="Dungeon material"
      />
    );

    expect(container.textContent).toContain('Dungeon material');
    expect(container.querySelector('.crui-texture-tile--selected')).toBeTruthy();

    await act(async () => {
      root!.unmount();
      root = null;
    });

    await render(
      <PaletteSwatchGrid
        colors={[{ name: 'Ink', value: '#17202a' }, { name: 'Moss', value: '#2aa876' }]}
        onSelectColor={onSelectColor}
        selectedValue="#2aa876"
      />
    );
    const swatches = container.querySelectorAll('button');
    await act(async () => {
      (swatches[0] as HTMLButtonElement).click();
    });
    expect(onSelectColor).toHaveBeenCalledWith({ name: 'Ink', value: '#17202a' });
  });

  test('music workspace primitives render playback and sequencing controls', async () => {
    const onToggle = vi.fn();
    await render(
      <>
        <TransportControls isPlaying onPlayPause={onToggle} />
        <LevelMeter label="Master" peak={0.86} value={0.72} />
        <StepGrid activeStep={3} steps={[true, false, true, false]} />
        <MiniTimeline markers={[{ label: 'drop', position: 0.7 }]} progress={0.42} />
      </>
    );

    expect(container.querySelector('.crui-level-meter')?.textContent).toContain('Master');
    expect(container.querySelectorAll('.crui-step-grid__step')).toHaveLength(4);
    await act(async () => {
      (container.querySelector('[aria-label="Pause"]') as HTMLButtonElement).click();
    });
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('ModalDialog traps basic dialog structure and close actions', async () => {
    const onClose = vi.fn();
    await render(
      <ModalDialog footer={<Button>Save</Button>} isOpen onClose={onClose} title="Publish settings">
        <p>Confirm the release configuration.</p>
      </ModalDialog>
    );

    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('Publish settings');
    await act(async () => {
      (container.querySelector('[aria-label="Close dialog"]') as HTMLButtonElement).click();
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('InstrumentPicker calls selection callbacks', async () => {
    const onSelect = vi.fn();
    await render(
      <InstrumentPicker
        items={[
          { id: 'drums', label: 'Drums', description: 'Percussion layer' },
          { id: 'keys', label: 'Keys', description: 'Chord layer' }
        ]}
        onSelect={onSelect}
        selectedId="keys"
      />
    );

    expect(container.querySelector('[aria-pressed="true"]')?.textContent).toContain('Keys');
    await act(async () => {
      Array.from(container.querySelectorAll('button')).find((button) => button.textContent?.includes('Drums'))?.click();
    });
    expect(onSelect).toHaveBeenCalledWith({ id: 'drums', label: 'Drums', description: 'Percussion layer' });
  });

  test('Game HUD primitives compose resource, inventory, and control surfaces', async () => {
    await render(
      <GameHudOverlay
        bottomLeft={<ControlHints hints={[{ key: 'WASD', action: 'Move' }]} />}
        bottomRight={<InventorySlotGrid items={[{ id: 'key', label: 'Key', rarity: 'rare', uses: '1' }]} selectedId="key" />}
        topLeft={<ResourceMeter label="Health" max={10} tone="health" value={7} />}
      />
    );

    expect(container.querySelector('.crui-game-hud')).toBeTruthy();
    expect(container.textContent).toContain('Health');
    expect(container.textContent).toContain('Move');
    expect(container.querySelector('.crui-inventory-grid__slot--rare')).toBeTruthy();
  });

  test('AeroLiquidBackground renders a safe host element', async () => {
    await render(<AeroLiquidBackground accent="#2aa876" motion="still" />);

    const host = container.querySelector('.crui-aero-liquid') as HTMLElement;
    expect(host).toBeTruthy();
    expect(host.getAttribute('aria-hidden')).toBe('true');
  });

  test('PreviewCard and FlipTile render archive-friendly cards', async () => {
    const onFlip = vi.fn();
    await render(
      <>
        <PreviewCard description="Compact listing" meta={[{ label: 'type', value: 'rental' }]} title="Explorer Van" />
        <FlipTile back="7" flipped front="?" label="Memory tile" onClick={onFlip} />
      </>
    );

    expect(container.textContent).toContain('Explorer Van');
    expect(container.querySelector('.crui-flip-tile--flipped')).toBeTruthy();
    await act(async () => {
      (container.querySelector('.crui-flip-tile') as HTMLButtonElement).click();
    });
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  test('IconGlyph, TagEditor, and SelectionCheckbox render compact library controls', async () => {
    const onTags = vi.fn();
    const onToggle = vi.fn();
    await render(
      <>
        <IconGlyph name="play" title="Play" />
        <TagEditor onChange={onTags} suggestions={['favorite']} tags={['drums']} />
        <SelectionCheckbox checked label="Selected" onToggle={onToggle} />
      </>
    );

    expect(container.querySelector('[role="img"]')?.textContent).toContain('Play');
    expect(container.textContent).toContain('drums');
    await act(async () => {
      (container.querySelector('.crui-tag-editor__suggestions button') as HTMLButtonElement).click();
    });
    expect(onTags).toHaveBeenCalledWith(['drums', 'favorite']);

    await act(async () => {
      (container.querySelector('.crui-selection-checkbox input') as HTMLInputElement).click();
    });
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  test('instrument controls and spellcaster HUD primitives render reusable surfaces', async () => {
    const onNote = vi.fn();
    const onPad = vi.fn();
    const onShake = vi.fn();
    await render(
      <>
        <PianoKeyboard onNotePress={onNote} />
        <DrumPadGrid onPadPress={onPad} />
        <TambourinePad active onShake={onShake} />
        <EnergyCore energy={82} maxEnergy={100} />
        <TimerBadge seconds={95} tone="warning" />
        <ScanlineOverlay intensity="strong" />
      </>
    );

    await act(async () => {
      Array.from(container.querySelectorAll('.crui-piano-keyboard__key')).find((button) => button.textContent === 'C')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      Array.from(container.querySelectorAll('.crui-drum-pad-grid__pad')).find((button) => button.textContent === 'Kick')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      (container.querySelector('.crui-tambourine-pad') as HTMLButtonElement).click();
    });

    expect(onNote).toHaveBeenCalledWith('C');
    expect(onPad).toHaveBeenCalledWith({ id: 'kick', label: 'Kick', tone: 'kick' });
    expect(onShake).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain('Energy Core');
    expect(container.textContent).toContain('1:35');
    expect(container.querySelector('.crui-scanline-overlay--strong')).toBeTruthy();
  });

  test('memory dungeon kit renders card, relic, and HUD surfaces', async () => {
    const onPick = vi.fn();
    await render(
      <>
        <DungeonCardFace label="12" sigil="hex" tone="rune" />
        <RelicChoiceGrid
          choices={[
            { id: 'mirror', title: 'Mirror Lens', description: 'Preview one hidden pair.', impact: '+Recall', rarity: 'rare' },
            { id: 'ember', title: 'Ember Cache', description: 'Bank shards on long chains.', impact: '+Score', rarity: 'uncommon' }
          ]}
          onPick={onPick}
        />
        <MemoryHudStrip floor={9} score="24,100" />
      </>
    );

    expect(container.textContent).toContain('Mirror Lens');
    expect(container.textContent).toContain('24,100');
    expect(container.querySelector('.crui-dungeon-card--rune')).toBeTruthy();

    await act(async () => {
      Array.from(container.querySelectorAll('.crui-relic-card')).find((button) => button.textContent?.includes('Ember Cache'))?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onPick).toHaveBeenCalledWith({
      id: 'ember',
      title: 'Ember Cache',
      description: 'Bank shards on long chains.',
      impact: '+Score',
      rarity: 'uncommon'
    });
  });

  test('dungeon map panel renders generated room routes and current room details', async () => {
    await render(
      <DungeonMapPanel
        algorithm="T-Shape Pattern"
        connections={[
          { from: 'start', to: 'enemy' },
          { from: 'enemy', to: 'treasure' }
        ]}
        currentRoomId="enemy"
        rooms={[
          { id: 'start', label: 'S', type: 'start', visited: true, x: 0, y: 1 },
          { id: 'enemy', label: 'E', type: 'enemy', x: 1, y: 1 },
          { id: 'treasure', label: 'T', locked: true, type: 'treasure', x: 2, y: 1 }
        ]}
      />
    );

    expect(container.textContent).toContain('Ghost Dungeon');
    expect(container.textContent).toContain('2/3 rooms');
    expect(container.textContent).toContain('T-Shape Pattern');
    expect(container.querySelector('.crui-dungeon-map__room--current')?.textContent).toBe('E');
    expect(container.querySelectorAll('.crui-dungeon-map__routes line')).toHaveLength(2);
  });

  test('device rack panel renders plugins, signal flow, and parameter automation state', async () => {
    await render(
      <DeviceRackPanel
        plugins={[
          {
            id: 'filter',
            name: 'State Variable Filter',
            health: 'info',
            latency: '0.2 ms',
            parameters: [
              { label: 'Cutoff', value: '2.4 kHz', automated: true },
              { label: 'Resonance', value: '38%' }
            ],
            vendor: 'BBeats'
          },
          {
            id: 'compressor',
            name: 'Bus Compressor',
            bypassed: true,
            health: 'warning',
            latency: '0.5 ms'
          }
        ]}
        selectedPluginId="filter"
      />
    );

    expect(container.textContent).toContain('Device Rack');
    expect(container.textContent).toContain('State Variable Filter');
    expect(container.textContent).toContain('Auto');
    expect(container.querySelector('.crui-device-card--selected')?.textContent).toContain('2.4 kHz');
    expect(container.querySelector('.crui-device-card--bypassed')?.textContent).toContain('Bypassed');
  });
});
