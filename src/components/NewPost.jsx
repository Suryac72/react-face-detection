import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";
import "../../src/app.css";
function NewPost() {
  const videoHeight = 480;
  const videoWidth = 640;
  const [initializing, setInitializing] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  let expressions = "";
  useEffect(() => {
    const loadModels = async () => {
      setInitializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ])
        .then(startVideo)
        .catch((e) => console.log(e));
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.getUserMedia(
      { video: {} },
      (stream) => (videoRef.current.srcObject = stream),
      (err) => console.error(err)
    );
  };

  const handleVideoPlay = () => {
    setTimeout(async () => {
      if (initializing) {
        setInitializing(false);
      }
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      const displaySize = {
        width: videoWidth,
        height: videoHeight,
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      stopStreamedVideo(videoRef);
      document.getElementsByClassName("display-flex")[0].style.display = "none";
      document.getElementById("hide").style.display = "none";

      let obj = {
        angry: resizedDetections[0].expressions.angry,
        disgusted: resizedDetections[0].expressions.disgusted,
        fearful: resizedDetections[0].expressions.fearful,
        happy: resizedDetections[0].expressions.happy,
        sad: resizedDetections[0].expressions.sad,
        surprised: resizedDetections[0].expressions.surprised,
      };

      expressions = Object.keys(obj).reduce((a, b) =>
        obj[a] > obj[b] ? a : b
      );
      console.log(expressions);
      localStorage.setItem("expressions", expressions);
    
    }, 500);
  };

  function stopStreamedVideo(videoElem) {
    const stream = videoElem.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function (track) {
      track.stop();
    });
  }
  let history = useNavigate();
  return (
    <>
      <div className="app">
        <div className="display-flex justify-content-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            height={videoHeight}
            width={videoWidth}
            onPlay={handleVideoPlay}
          />
          <canvas ref={canvasRef} className="position-absolute" />
        </div>
        <button onClick={() => history("/result")}>Result</button>
      </div>
    </>
  );
}
export default NewPost;
