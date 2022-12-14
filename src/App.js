import { useEffect,useState, useRef } from "react";


import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageSrc, setImageSrc] = useState('./stamp1.jpg');
  const canvasRef = useRef(null);
  const cropperRef = useRef(null);
  const [croppedImg, setCroppedImgData] = useState({});

  const [dabi,setDabi]=useState(128);

  // useEffect(() => {
  //   if (!canvasRef) return;
  //   const ctx = canvasRef.current.getContext("2d");
  //   const image = new Image();
  //   image.src = "./stamp.jpg";

  //   image.onload = function() {
  //     ctx.drawImage(image, 0, 0);
  //   };
  //   console.log(ctx.createImageData(1,1))
  // }, [canvasRef])

  useEffect(()=>{
    var img = document.getElementById('my-image');
    const c=canvasRef.current;
    const ctx = c.getContext("2d");
    const image = new Image();
    
    image.src = imageSrc;

    image.onload = function() {
      const {width,height}=image;
      if(width >=500 || height>=500){
        if(width>height){
          c.width=500;
          c.height=height*500/width;
          ctx.drawImage(image, 0, 0,500,height*500/width);
        }
        else {
          c.width=width*500/height;
          c.height=500;
          ctx.drawImage(image, 0, 0,width*500/height,500);
        }
      } else{
        c.width=width;
        c.height=height;
        ctx.drawImage(image, 0, 0,width,height);
      }
     
      var imageData = ctx.getImageData(0,0, width, height);
      var pixel = imageData.data;
      var r=0, g=1, b=2,a=3;
      for (var p = 0; p<pixel.length; p+=4)
      {
        if (
            pixel[p+r] > dabi &&
            pixel[p+g] > dabi &&
            pixel[p+b] > dabi) // if white then change alpha to 0
        {pixel[p+a] = 0;}
        else{

          pixel[p+r] =255;
          pixel[p+g] =0;
          pixel[p+b] =0;
        }
      }
      ctx.putImageData(imageData,0,0);
   
      if(cropperRef && cropperRef.current ){
        if(imageUrl===''){
        cropperRef.current.cropper.replace(canvasRef.current.toDataURL())

      } else{
        cropperRef.current.cropper.replace(canvasRef.current.toDataURL(), true)

      }

      }
      setImageUrl(canvasRef.current.toDataURL())
    };
  },[dabi,cropperRef,imageSrc]);

  const crop = () => {
    const img = cropperRef.current.cropper
      .getCroppedCanvas({
        width: 100,
        height: 100,
        fillColor: "rgba(255,255,255,0)"
      })
      .toDataURL("image/png");

    setCroppedImgData(img);
  };

  const rotate = () => {
    if(cropperRef && cropperRef.current ){
      cropperRef.current.cropper.rotate(30)
    }
  };

  return (
    <div >
      <canvas ref={canvasRef} style={{display:'none'}} />
    <Cropper
      aspectRatio={1}
      className="SignautreUplaod_canvas"
      dragMode="none"
      enable={true}
      guides={false}
      scaleX={1}
      scaleY={1}
      style={{ height: 200, width: 560 }}
      ref={cropperRef}
        />

              <button onClick={crop}>Crop</button>
              <button onClick={rotate}>Rotate</button>

              <img src={croppedImg} alt="" />

       <input type='range'style={{position:'fixed',top:10}} min={0} max={255} value={dabi} step={10} onChange={(e)=>{setDabi(e.target.value)}} />
    </div>
  );
}

export default App;
