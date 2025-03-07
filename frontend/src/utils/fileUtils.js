import React from "react";

export const getRenderedFile = (file, fileType) => {
  if (!file || !fileType) return null;

  const src = `http://localhost:5000${file}`;
  if (fileType === "image") {
    return <img src={src} alt="uploaded" className="message-image" />;
  }
  if (fileType === "video") {
    return (
      <video controls className="message-video">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }
  if (fileType === "document") {
    return (
      <a href={file} target="_blank" rel="noopener noreferrer">
        Download File
      </a>
    );
  }

  return null;
};

export const getRenderedFileSummary = (file, fileType) => {
  if (!file || !fileType) return null;

  if (fileType === "image") {
    return "sent you an image.";
  }
  if (fileType === "video") {
    return "sent you a video.";
  }
  if (fileType === "document") {
    return "sent you a file.";
  }

  return null;
};
