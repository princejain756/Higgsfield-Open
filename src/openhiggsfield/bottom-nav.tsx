"use client";

import { Icon } from "@iconify/react";
import { VIEW_LABELS, type GalleryView } from "./data";
import { AssetsIcon, HeartIcon, ImageIcon, VideoIcon } from "./icons";

const VIEW_ICONS: Record<GalleryView, (active: boolean) => React.ReactNode> = {
  video: () => <VideoIcon size={18} />,
  image: () => <ImageIcon size={18} />,
  assets: () => <AssetsIcon size={18} />,
  favorites: (active) => <HeartIcon size={17} filled={active} />,
};

const BOTTOM_TABS: GalleryView[] = ["video", "image", "assets", "favorites"];

export function BottomNav({
  view,
  onView,
  onOpenChangelog,
  unread,
}: {
  view: GalleryView;
  onView: (next: GalleryView) => void;
  onOpenChangelog?: () => void;
  unread?: boolean;
}) {
  return (
    <nav className="ohf-bottom-nav" aria-label="Mobile and tablet navigation">
      <div className="ohf-bottom-nav-inner" role="tablist">
        {BOTTOM_TABS.map((id) => {
          const selected = view === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`ohf-bottom-tab-${id}`}
              aria-selected={selected}
              className="ohf-bottom-tab"
              data-active={selected || undefined}
              onClick={() => onView(id)}
            >
              <div className="ohf-bottom-tab-icon-wrap">
                {VIEW_ICONS[id](selected)}
                {selected && <span className="ohf-bottom-tab-active-dot" aria-hidden />}
              </div>
              <span className="ohf-bottom-tab-label">{VIEW_LABELS[id]}</span>
            </button>
          );
        })}

        {onOpenChangelog && (
          <button
            type="button"
            className="ohf-bottom-tab"
            onClick={onOpenChangelog}
            aria-label={unread ? "What's new — unread updates" : "What's new"}
          >
            <div className="ohf-bottom-tab-icon-wrap">
              <Icon icon="lucide:sparkles" width="18" height="18" />
              {unread && <span className="ohf-bottom-tab-dot" aria-hidden />}
            </div>
            <span className="ohf-bottom-tab-label">Updates</span>
          </button>
        )}
      </div>
    </nav>
  );
}
