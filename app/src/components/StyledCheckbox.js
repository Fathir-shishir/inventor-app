import { Checkbox } from "@mui/material";
import {styled} from "@mui/material/styles"


const CustomCheckbox = styled(Checkbox)({
    "& .MuiSvgIcon-root": {
      color: "#82e600",
      fontSize: 20,
    },
  });

const StyledCheckbox = (props) => {
    return <CustomCheckbox {...props}/>
}

  export default StyledCheckbox;