"use client";

import { CircularProgress } from "@mui/material";

const LoadingModal = () => {
  return (
    <div
      className="w-full h-full fixed top-0 left-0 z-[1200] bg-[rgba(0,0,0,0.1)]
                    flex items-center justify-center"
    >
      <CircularProgress color="primary" size={50} />
    </div>
  );
};

export default LoadingModal;
