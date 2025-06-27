import React from 'react';
import './BackgroundVideo.css';

const BackgroundVideo: React.FC = () => (
  <div className="background-video">
    <video autoPlay loop muted>
      <source src="https://cdn.pixabay.com/video/2022/04/09/113367-697718066_tiny.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
);

export default BackgroundVideo;
