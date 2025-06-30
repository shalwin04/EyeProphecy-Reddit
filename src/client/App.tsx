import { BoltBadge } from './BoltBadge';
import { Game } from './Game';

export const App = () => {
  return (
    <div className="h-screen w-full overflow-hidden">
      <Game />
      <BoltBadge mode="white" />
    </div>
  );
};