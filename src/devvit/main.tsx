import { Devvit, Post } from '@devvit/public-api';

// Side effect import to bundle the server. The /index is required for server splitting.
import '../server/index';
import { defineConfig } from '@devvit/server';

defineConfig({
  name: '[Bolt] Eye Rub Oracle - Chaos Toilet Edition',
  entry: 'index.html',
  height: 'tall',
  menu: { enable: false },
});

export const Preview: Devvit.BlockComponent<{ text?: string }> = ({ text = 'Loading Oracle...' }) => {
  return (
    <zstack width={'100%'} height={'100%'} alignment="center middle">
      <vstack width={'100%'} height={'100%'} alignment="center middle" backgroundColor="#121213">
        <image
          url="loading.gif"
          description="Oracle awakening..."
          height={'140px'}
          width={'140px'}
          imageHeight={'240px'}
          imageWidth={'240px'}
        />
        <spacer size="small" />
        <text maxWidth={`80%`} size="large" weight="bold" alignment="center middle" wrap color="#ffffff">
          🔮 {text} 🔮
        </text>
        <spacer size="small" />
        <text maxWidth={`90%`} size="medium" alignment="center middle" wrap color="#888888">
          Rub the Oracle's eyes to receive your prophecy...
        </text>
      </vstack>
    </zstack>
  );
};

// Menu item to create new oracle posts
Devvit.addMenuItem({
  label: '[Eye Rub Oracle]: New Prophecy Post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;

    let post: Post | undefined;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      post = await reddit.submitPost({
        title: '🔮 Eye Rub Oracle - Chaos Toilet Edition 🧻',
        subredditName: subreddit.name,
        preview: <Preview text="Oracle awaits your touch..." />,
      });
      
      ui.showToast({ text: 'Oracle post created! The prophecies await...' });
      ui.navigateTo(post.url);
    } catch (error) {
      if (post) {
        await post.remove(false);
      }
      if (error instanceof Error) {
        ui.showToast({ text: `Error summoning oracle: ${error.message}` });
      } else {
        ui.showToast({ text: 'The oracle refuses to awaken!' });
      }
    }
  },
});

export default Devvit;