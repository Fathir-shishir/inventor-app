import { Box, CircularProgress, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  bgcolor: "background.paper",
};

const Loading = () => {
  return (
    <Box sx={{ height: "100vh", width: "100vw", bgcolor: "background.paper" }}>
      <Box sx={style}>
        <CircularProgress
          size={50}
          style={{ margin: "1rem auto", color: "#82e600" }}
        />
        <Typography variant="h4" color="#4e6b7c">
          Loading
        </Typography>
      </Box>
    </Box>
  );
};

export default Loading;
