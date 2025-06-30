import express from 'express';
import { createServer, getContext, getServerPort } from '@devvit/server';
import { getRedis } from '@devvit/redis';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

const router = express.Router();

// Prophecy responses based on Reddit themes
const prophecies = [
  // r/mildlyinfuriating themed
  "Your USB cable will always be upside down on the first try. Forever.",
  "The person in front of you will walk exactly 0.5 mph slower than your natural pace.",
  "Your phone battery will die at 23% for the rest of your life.",
  "Every shopping cart you touch will have exactly one wobbly wheel.",
  "Your socks will develop holes in the exact spot where your big toe lives.",
  
  // r/showerthoughts themed
  "The socks know everything. Especially your secrets.",
  "Your reflection has been practicing faces when you're not looking.",
  "Somewhere, a rubber duck is plotting your downfall.",
  "The last slice of pizza holds the meaning of life, but you'll never eat it.",
  "Your future self is disappointed in your current snack choices.",
  
  // r/AskReddit themed
  "You will forget your password. Again. And again. And again.",
  "The answer to your life's biggest question is 'maybe, but probably not.'",
  "Your most embarrassing moment hasn't happened yet. It's scheduled for Tuesday.",
  "You will find exactly $3.47 in an old jacket pocket next month.",
  "Someone you've never met will remember you for something you don't remember doing.",
  
  // Reddit meta themed
  "This prophecy was brought to you by r/creepyasterisks.",
  "Your karma score is directly tied to your ability to find matching socks.",
  "r/place remembers you. It's watching. It's waiting.",
  "You will accidentally upvote a comment you meant to downvote. The shame will linger.",
  "Your most thoughtful comment will get 3 upvotes. Your random 'lol' will get 1,000.",
  
  // Absurd/Chaotic themed
  "The ketchup you spilled in 2019 is still watching you.",
  "Your future involves exactly 47 rubber bands and a confused pigeon.",
  "The universe's Wi-Fi password is your middle name backwards, but you'll never need it.",
  "A traffic cone will play a pivotal role in your destiny. Respect the cone.",
  "Your life's soundtrack is being composed by a very tired hamster on a keyboard.",
  
  // Toilet/bathroom themed (fitting for the game)
  "You will run out of toilet paper at the most inconvenient moment possible.",
  "Your bathroom mirror knows things about you that you don't know about yourself.",
  "The toilet paper roll will always be empty when you need it most.",
  "Your shower thoughts are being recorded by interdimensional beings for their entertainment.",
  "The bathroom door will stick exactly when you're in a hurry.",
  
  // Oracle/mystical themed
  "The ancient spirits of lost TV remotes whisper your name in the couch cushions.",
  "Your destiny is written in the crumbs at the bottom of cereal boxes.",
  "The cosmic forces have aligned to ensure you always hit red lights when you're late.",
  "Your aura is the color of expired milk, but in a charming way.",
  "The universe's plan for you involves more houseplants than you're currently prepared for."
];

router.post('/api/prophecy', async (req, res) => {
  try {
    const { fed, rubCount, oracleSkin } = req.body;
    const { postId, userId } = getContext();
    
    if (!postId) {
      res.status(400).json({ status: 'error', message: 'postId is required' });
      return;
    }
    
    if (!userId) {
      res.status(400).json({ status: 'error', message: 'Must be logged in' });
      return;
    }
    
    if (fed !== 'fly') {
      res.status(400).json({ status: 'error', message: 'Oracle only accepts flies!' });
      return;
    }
    
    // Select a random prophecy
    const randomIndex = Math.floor(Math.random() * prophecies.length);
    const selectedProphecy = prophecies[randomIndex];
    
    // Store the prophecy in Redis for potential future features
    const redis = getRedis();
    const prophecyKey = `prophecy:${postId}:${userId}:${Date.now()}`;
    await redis.set(prophecyKey, JSON.stringify({
      prophecy: selectedProphecy,
      rubCount,
      oracleSkin,
      timestamp: new Date().toISOString()
    }));
    
    res.json({
      status: 'success',
      oracle: selectedProphecy
    });
    
  } catch (error) {
    console.error('Prophecy API Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'The oracle choked on the fly. Try again.' 
    });
  }
});

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.json({ status: 'The oracle is awake and hungry for flies.' });
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port, () => console.log(`Eye Rub Oracle server running on http://localhost:${port}`));