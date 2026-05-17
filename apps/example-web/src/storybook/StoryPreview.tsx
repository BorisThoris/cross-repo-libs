import type { StoryRecord, StoryVariant } from './types.js';

interface StoryPreviewProps {
  story: StoryRecord;
  variant: StoryVariant;
}

export function StoryPreview({ story, variant }: StoryPreviewProps) {
  const previewSize = story.previewSize;

  return (
    <section className={`story-preview story-preview--${previewSize}`} aria-labelledby="story-preview-title">
      <div className="story-preview__bar">
        <div>
          <p className="sb-eyebrow">{story.group}</p>
          <h2 id="story-preview-title">{story.title}</h2>
        </div>
        <span className="story-preview__package">{story.packageName.replace('@cross-repo-libs/', '')}</span>
      </div>
      <div className="story-preview__stage" data-preview-size={previewSize} data-story-preview={story.id}>
        {story.render(variant)}
      </div>
    </section>
  );
}
