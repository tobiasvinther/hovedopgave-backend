import { Router } from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const upload: Multer = multer({ dest: '../uploads/' });

//Create the 'uploads/' folder if it doesn't exist
const uploadFolder = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

//POST - upload image
router.post('/api/upload', upload.single('image'), (req : any, res : any) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    //Handle the file and save it to a folder
    const file = req.file;
    const fileName = file.originalname;
    const filePath = path.join(uploadFolder, fileName);

    fs.rename(file.path, filePath, (error: NodeJS.ErrnoException | null) => {
        if (error) {
          console.error('Error saving image:', error);
          return res.status(500).json({ error: 'Failed to save image' });
        }
    
        console.log('Image saved successfully!');
        return res.sendStatus(200);
    })
})

export default router;