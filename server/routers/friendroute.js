import express from 'express'
const router = express.Router()
import {suggestFriends,sendFriendRequest,acceptFriend,rejectFriend,
    getFriendRequests, getofficialfriends} from '../controller/friendController.js'
import {protectroute} from '../middleware/authmiddleware.js'

router.get('/suggest', protectroute, suggestFriends)
router.post('/sendrequest', protectroute, sendFriendRequest)
router.get('/getrequest', protectroute, getFriendRequests)
router.get('/getofficialfriends', protectroute, getofficialfriends)
router.post('/accept', protectroute, acceptFriend)
router.post('/rejectrequest', protectroute, rejectFriend)

export default router
