import React,{useEffect, useState} from 'react'
import { userpoststore } from '../store/poststore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

function Createpost() {
    const [filepost, setfilepost] =useState(null)
    const [fileposttype, setfileposttype] = useState('null')
    const [posttext, setposttext] = useState('')
    const [isUploading, setIsUploading] =useState(false)

    const {sendpost,getpost,ispostloading} = userpoststore()

    useEffect(()=>{
        getpost()
    },[getpost])

    const handlefilechange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setfileposttype(file.type)
        if (file.size > 20*1024*1024) return alert('maximum file size is 20mb')
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setfilepost(reader.result)
            }
        } else {
            alert('Please choose a valid image or video.')
        }
    }
    const handlesendpost = async (e) => {
        e.preventDefault()
        if ((posttext && posttext.length > 0) || filepost) {
            setIsUploading(true)
            try {
                await sendpost(posttext, filepost,fileposttype)
                setposttext('')
                setfilepost(null)
                setfileposttype(null)
            } catch (error) {
                console.error('Error sending post:', error)
            } finally {
                setIsUploading(false)
            }
        }
    }
  return (
    <div className='fun-card bg-rose-50 p-4'>
       {filepost && filepost.startsWith('data:image/') && <img src={filepost} alt="" className="mb-3 max-h-64 w-full rounded-lg object-cover" />}
       {filepost && filepost.startsWith('data:video/') && (
        <video controls className="mb-3 max-h-64 w-full rounded-lg bg-black">
          <source src={filepost} alt="" />
        </video>
       )}
        <textarea className="min-h-24 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-sky-50 focus:ring-2 focus:ring-sky-100" value={posttext} placeholder='Whats On Your Mind...'
        onChange={(e)=>setposttext(e.target.value)}/>
        <div className="mt-3 flex flex-wrap gap-2">
            <label htmlFor="upload-post-file" className='fun-button flex h-10 cursor-pointer items-center'>video/photo
              <input type="file" id='upload-post-file' className="hidden" onChange={handlefilechange} />
            </label>
            <button disabled={isUploading} className="fun-button-blue flex h-10 flex-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-70" onClick={handlesendpost}>
              {!ispostloading ? "send post" :<FontAwesomeIcon icon={faSpinner} spin />}
            </button>
        </div>
    </div>
  )
}

export default Createpost
