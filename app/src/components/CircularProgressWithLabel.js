import PropTypes from "prop-types";
import { Box, CircularProgress, Typography } from "@mui/material";

function CircularProgressWithLabel(props) {

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        color: "#82e600",
      }}
    >
      <CircularProgress
        variant="determinate"
        color="inherit"
        value={100 / props.nbrOfKbs * props.count}
        size={50}
        sx={{ "&.MuiCircularProgress-colorSecondary": { color: "red" } }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" component="div" color="#4e6b7c" m={0} p={0}>
          {`${props.count}/${props.nbrOfKbs}`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default CircularProgressWithLabel;
