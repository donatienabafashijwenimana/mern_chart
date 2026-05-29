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
        const {_id:myid} = req.user
        const post = await Post.find().populate('author', 'fullname email profilepic').sort({createdAt:-1})
        res.status(200).json(post.filter((item) => item.author))
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}

export const  likepost = async(req, res) => {
    const {postid} = req.body
    const {_id:myid}= req.user
    const post = await Post.findById(postid)
    if(post.likedby.includes(myid)){
        await Post.findByIdAndUpdate(postid,{$pull:{likedby:myid}})
        return res.status(200).json({message:'video unliked'})
    }else{
        await Post.findByIdAndUpdate(postid,{$push:{likedby:myid}})
        return res.status(200).json({message:'video liked'})
    }
}
export const dislikepost = async(req, res) => {
    const {postid} = req.body
    const {_id:myid}= req.user
    const post = await Post.findById(postid)
    if(post.dislikedby.includes(myid)){
        await Post.findByIdAndUpdate(postid,{$pull:{dislikedby:myid}})
        return res.status(200).json({message:'video undisliked'})
    }else{
        await Post.findByIdAndUpdate(postid,{$push:{dislikedby:myid}})
        return res.status(200).json({message:'video disliked'})
    }
}

export const getlike= async(req, res) => {
    const {postid} = req.params
    const {_id:myid}= req.user
    const post = await Post.findById(postid).populate('likedby','fullname email profilepic')
    if(!post){
        return res.status(404).json({message:'post not found'})
    }
    res.status(200).json(post.likedby)
}
