import "./styles.css";
import { useEffect,useState, useRef } from "react";
import jsPDF from "jspdf";
import ReportTemplate from "./ReportTemplate";
import "./Noto-Sans-KR-normal.js";
import "./poppins-v20-latin-regular-normal"
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";


const defaultSrc =
"./stamp5.jpg";

function App() {
  const [imageSrc, setImageSrc] = useState('');

  const canvasRef = useRef(null);
  const resizedCanvasRef = useRef(null);
  const cropperRef = useRef(null);



  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [dabi,setDabi]=useState(128);

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };



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
    const resizedC=resizedCanvasRef.current;
    const ctx = c.getContext("2d");
    const resizedCtx=resizedC.getContext("2d");
    const image = new Image();
    
    image.src = "./stamp5.jpg";
    console.log(cropperRef)

    image.onload = function() {
      const {width,height}=image;
      c.width=width;
      c.height=height;
      ctx.drawImage(image, 0, 0,width,height);
     
      var imageData = ctx.getImageData(0,0, width, height);
      var pixel = imageData.data;
      var r=0, g=1, b=2,a=3;
      var minY=9999, maxY=-1, minX=99999, maxX=-1;
      for (var p = 0; p<pixel.length; p+=4)
      {
        if (
            pixel[p+r] > dabi &&
            pixel[p+g] > dabi &&
            pixel[p+b] > dabi) // if white then change alpha to 0
        {pixel[p+a] = 0;}
        else{
          // const i=p/4;
          // const y=i/width;
          // const x=i % width;
          // if(y < minY) minY=y;
          // if(y > maxY) maxY=y;
          // if(x < minX) minX=x;
          // if(x > maxX) maxX=x;
          pixel[p+r] =250;
          pixel[p+g] =0;
          pixel[p+b] =0;
        }
      }
      // console.log(minY,maxY)   
      // // console.log(minX,maxX)  
      // resizedC.width=maxX-minX;
      // resizedC.height=maxY-minY;

      ctx.putImageData(imageData,0,0);
      // resizedCtx.putImageData(imageData,-minX,-minY)
      // ctx.translate(-minX,-minY)
      // setImage(resizedCanvasRef.current.toDataURL())
      console.log(imageSrc);
      console.log(canvasRef.current.toDataURL())
      if(cropperRef && cropperRef.current ){
             if(imageSrc===''){
        cropperRef.current.cropper.replace(canvasRef.current.toDataURL())

      } else{
        cropperRef.current.cropper.replace(canvasRef.current.toDataURL(), true)

      }

      }
      setImageSrc(canvasRef.current.toDataURL())


      // cropperRef.current?.cropper.url = canvasRef.current.toDataURL()

    };
    // canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  },[dabi,cropperRef]);

  // useEffect(()=>{
  //   setImage(resizedCanvasRef.current.toDataURL())
  // },[resizedCanvasRef])


  function download() {
    var download = document.getElementById("download");
    if(resizedCanvasRef && resizedCanvasRef.current){
        var image = resizedCanvasRef.current
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
    // download.setAttribute("download","image-name.png");
    }
  
}
  return (
    <div style={{backgroundColor:'black'}}>
      <canvas ref={canvasRef} />
      <canvas ref={resizedCanvasRef} />
    <Cropper
      aspectRatio={1}
      background={false}
      className="SignautreUplaod_canvas"
      dragMode="none"
      enable={true}
      guides={false}
      rotateTo={0}
      scaleX={1}
      scaleY={1}
      zoomTo={1}
      style={{ height: 400, width: '100%' }}
      ref={cropperRef}
          
     
        />
     

      <a id="download" download="triangle.png">
    <button type="button" style={{position:'fixed'}} onClick={download()}>Download</button>
       </a>
       <input type='range'style={{position:'fixed',top:10}} min={0} max={255} value={dabi} onChange={(e)=>{setDabi(e.target.value)}} />
    </div>
  );
}

export default App;
