import { Router } from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';
import { Birds, Images } from '../database/database';

const router = Router();
const upload: Multer = multer({ dest: '../uploads/' });

//Create the 'uploads/' folder if it doesn't exist
const uploadFolder = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

//POST - upload image
router.post('/api/upload', upload.single('image'), async (req : any, res : any) => {
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
        //return res.sendStatus(200);
    })

    //
    const birdId = req.body.birdId;

    try {
        // Find the bird by its ID in the database
        const bird : any = await Birds.findByPk(birdId);

        if (!bird) {
            return res.status(404).json({ error: 'Bird not found' });
        }

        // Create a new image record associated with the bird
        const image = await Images.create({
        path: req.file.path,
        birdId: bird.id,
        });

        console.log("Image saved:", image)
        return res.status(200).json({ success: 'Image uploaded and associated with bird' });

    }   catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ error: 'Failed to upload image' });
    }
});


export default router;