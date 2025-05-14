import  express from 'express';
import { createPost,getpost, likepost,dislikepost,getlike} from '../controller/postController.js';
import { protectroute } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/createpost',protectroute, createPost);
router.get('/getpost',protectroute, getpost);
router.post('/likepost/',protectroute,likepost)
router.post('/dislikepost/',protectroute,dislikepost)
router.get('/getlike/',protectroute,getlike)

export default router;