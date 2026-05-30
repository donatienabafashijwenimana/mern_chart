import Post  from '../model/postmodel.js';
import cloudinary from '../LIB/cloudinary.js'

export const createPost = async (req, res) => {
    try {
            const {posttext,filepost,fileposttype} = req.body
            const userid = req.user._id
            let imageurl = null;
            if (filepost){
                try {
                    const uploadresponse = await cloudinary.uploader.upload(filepost,{
                        resource_type:"auto"
                    })
                    imageurl = uploadresponse.secure_url
                } catch (error) {
                    console.log(error)
                    return res.status(500).json({message:'file upload error'})
                }
                    
            }
            const newpost = new Post({
                content:posttext,
                postfile:imageurl,
                fileposttype:fileposttype,
                author:userid,
                likedby:[],
                dislikedby:[],
            })
            await newpost.save()
            res.status(200).json({message:'new post created'})
    
        } catch (error) { 
            console.log(error)
            res.status(500).json({message:'internal server error'})
        }
};

export const getpost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'fullname email profilepic')
      .populate('likedby', 'fullname email profilepic')
      .populate('dislikedby', 'fullname email profilepic')
      .sort({ createdAt: -1 });
    
    // Filter out posts with missing authors to prevent rendering errors
    const validPosts = posts.filter((item) => item.author);
    res.status(200).json(validPosts);
  } catch (error) {
    console.error('Error in getpost:', error);
    res.status(500).json({ message: 'internal server error' });
  }
};

export const likepost = async (req, res) => {
  try {
    const { postid } = req.body;
    const { _id: myid } = req.user;
    const post = await Post.findById(postid);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likedby.includes(myid);
    
    // If liking: add to likedby and remove from dislikedby.
    // If unliking: just remove from likedby.
    const update = isLiked 
      ? { $pull: { likedby: myid } } 
      : { $addToSet: { likedby: myid }, $pull: { dislikedby: myid } };

    const updatedPost = await Post.findByIdAndUpdate(postid, update, { new: true })
      .populate('author', 'fullname email profilepic')
      .populate('likedby', 'fullname email profilepic')
      .populate('dislikedby', 'fullname email profilepic');

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
  }
};

export const dislikepost = async (req, res) => {
  try {
    const { postid } = req.body;
    const { _id: myid } = req.user;
    const post = await Post.findById(postid);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isDisliked = post.dislikedby.includes(myid);
    
    // If disliking: add to dislikedby and remove from likedby.
    // If undisliking: just remove from dislikedby.
    const update = isDisliked 
      ? { $pull: { dislikedby: myid } } 
      : { $addToSet: { dislikedby: myid }, $pull: { likedby: myid } };

    const updatedPost = await Post.findByIdAndUpdate(postid, update, { new: true })
      .populate('author', 'fullname email profilepic')
      .populate('likedby', 'fullname email profilepic')
      .populate('dislikedby', 'fullname email profilepic');

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
  }
};

export const getlike = async (req, res) => {
  try {
    const { postid } = req.params;
    const post = await Post.findById(postid).populate('likedby', 'fullname email profilepic');
    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }
    res.status(200).json(post.likedby);
  } catch (error) {
    console.error('Error in getlike:', error);
    res.status(500).json({ message: 'internal server error' });
  }
};

export const deletepost = async (req, res) => {
  try {
    const { postid } = req.params;
    const userid = req.user._id;

    const post = await Post.findById(postid);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Verify ownership
    if (post.author.toString() !== userid.toString()) {
      return res.status(401).json({ message: 'Unauthorized to delete this post' });
    }

    await Post.findByIdAndDelete(postid);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
  }
};
