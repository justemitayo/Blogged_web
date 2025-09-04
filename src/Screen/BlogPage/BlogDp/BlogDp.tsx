import React,{useState ,  useMemo, useRef, useEffect} from 'react'
import './BlogDp.css'
import back from '../../../Assets/icon/Back_Arrow.png'
import image from '../../../Assets/svg/image.svg'
import picture from '../../../Assets/Images/No_Blog_Image.png'
import { useNavigate, useLocation  } from 'react-router-dom';
import { no_double_clicks } from '../../../utils/no_double_click/no_double_clicks'
import { error_handler } from '../../../utils/Error_Handler/Error_Handler'

const BlogDp = () => {

  const [preview, setPreview] = useState<string | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
    // Reference to the hidden file input
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const is_edit_blog = state.b_edit || false;
    const blog_title = state.b_title;
    const blog_tags = useMemo(() => state.b_tags || [], [state.b_tags]);
    const blog_dp = state.b_dp;
    const blog_mssg = state.b_mssg;
    const blog_id = state.b_id || '';

      // Convert File to Base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => {
        const err = new Error("File reading failed");
        reject(err);
        error_handler({
          navigate,
          error_mssg: err.message,
        });
      };
      reader.readAsDataURL(file);
    });
  }

  
  const profileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file); // Convert to Base64
      setPreview(base64); // Store Base64 for preview
    }
  };

  const handleChooseClick = no_double_clicks({
    execFunc: () => {
      fileInputRef.current?.click(); // Trigger the file dialog
    }
  })


  const handleRemove = no_double_clicks({
    execFunc: () => {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
      }
    }
  });

  const open_blog_dp = no_double_clicks({
    execFunc: () => {
      setShowSpinner(true);
      setTimeout(() => {
        navigate('/blog-message', {
          state: {
            b_edit: is_edit_blog,
            b_id: blog_id,
            b_title: blog_title,
            b_tags: blog_tags,
            b_dp: preview || blog_dp,
            b_mssg: blog_mssg,
          },
        });
      }, 500)
    },
  });

  useEffect(() => {
    if (blog_dp) {
      setPreview(blog_dp);
    }
  }, [blog_dp]);

  return (
    <div className='profile-pictures'>


      <div className='backspaces'>
        <img alt='' src={back} onClick={() => navigate(-1)} style={{width:'1.25rem', height:'1.25rem'}}/>
      </div>

      {showSpinner &&         
    <div className="overlay-spinner">
      <div className="spinner" />
      <p>Uploading...</p>
    </div>
    }


      <div className='profile-picture-components'>
        <h4>Select a Blog Image?</h4>
        <span> {is_edit_blog ? 'Make changes to your Blog Image using the buttons below.' : 'Make your Blog Post catch the eye by adding an Image that describes your Post.'}</span>

        <div className='register-pictures'>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={profileChange} style={{display:'none'}}/>
          <img src={preview ? preview : picture} alt="Preview"  />
        </div>
        <div className='profile-picture-footers'>
          <div style={{width:'50px', height:'50px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
            <img alt='' onClick={handleChooseClick} src={image} />
          </div>
          <div style={{width:'50px', height:'50px', borderRadius:'50%', border:'2px solid black', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>

            <button onClick={handleRemove} disabled={!preview} style={{background:'none', border:'none', fontSize:'2rem', color:'black'}}>x</button>

          </div>
        </div>
        <button className='profile-buttons' onClick={open_blog_dp}>Next</button>

      </div>
    </div>
  )
}

export default BlogDp