import type { StoryRecord, StoryVariant } from './types.js';

interface StoryDocsProps {
  story: StoryRecord;
  variant: StoryVariant;
}

export function StoryDocs({ story, variant }: StoryDocsProps) {
  return (
    <aside className="story-docs" aria-label={`${story.title} documentation`}>
      <section>
        <p className="sb-eyebrow">Overview</p>
        <p className="story-docs__lead">{story.overview}</p>
      </section>

      <section>
        <p className="sb-eyebrow">Variant</p>
        <h3>{variant.label}</h3>
        <p>{variant.description}</p>
      </section>

      <section>
        <p className="sb-eyebrow">Usage</p>
        <p>{story.usage}</p>
      </section>

      <section>
        <p className="sb-eyebrow">Import</p>
        <pre className="story-docs__code">{story.importSnippet}</pre>
      </section>

      <section>
        <p className="sb-eyebrow">Package</p>
        <dl className="story-docs__meta">
          <div>
            <dt>Package</dt>
            <dd>{story.packageName}</dd>
          </div>
        </dl>
        <p>{story.packageNotes}</p>
      </section>
    </aside>
  );
}
