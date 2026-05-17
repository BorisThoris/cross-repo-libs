import { NotificationHost } from '@cross-repo-libs/notifications';
import { StorybookShell } from './storybook/StorybookShell.js';
import { storyRegistry } from './storybook/storyRegistry.js';
import './storybook/storybook.css';

export function App() {
  return (
    <NotificationHost>
      <StorybookShell stories={storyRegistry} />
    </NotificationHost>
  );
}
