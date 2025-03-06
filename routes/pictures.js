// routes/pictures.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Setup __dirname for ES modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /api/pictures - returns two example images.
router.get('/', (req, res) => {
  const pictures = [
    {
      id: 1,
      name: 'Example Image 1',
      // Since express.static serves the public folder, this URL points to public/images/example1.jpg
      url: '/images/bearcatshirt.png'
    },
    {
      id: 2,
      name: 'Example Image 2',
      url: '/images/walk.jpg'
    },
    {
      id: 3,
      name: 'Example Image 3',
      url: '/images/wawa.png'
    },
    {
      id: 4,
      name: 'Example Image 4',
      url: '/images/threejs.png'
    },
  ];
  
  res.json(pictures);
});

export default router;
