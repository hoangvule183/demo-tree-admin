"use client";

import { Box, LinearProgress } from "@mui/material";

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div
      className="w-full fixed top-0 left-0 z-[1200]
                flex flex-col gap-[20px] shadow-2xl"
    >
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          style={{
            height: "10px",
            background: "#BDBDBD",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.25)",
          }}
          color="primary"
          variant="determinate"
          value={progress}
        />
      </Box>
    </div>
  );
};

export default ProgressBar;
