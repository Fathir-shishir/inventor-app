import { Fragment } from "react";

// Global states
import { useSession } from "../../globalStates/session.state";

// MUI components
import { Link } from "@mui/material";

// Components
import NavMenu from "./NavMenu";
import Header from "./Header";

const Layout = (props) => {
  const [sessionState, _] = useSession();

  return (
    <Fragment>
      <Header />
      <NavMenu classes={{ paper: { height: "10%" } }} />
      <main
        className="bg-[#f7f5f5] min-h-[calc(100vh-5.5rem)] text-gray-600"
        style={{
          left: sessionState.open ? 300 : 0,
          transitionDuration: "0.2s",
        }}
      >
        {props.children}
      </main>
      <footer className="bg-valeo-green h-6 text-center">
        <Link color="#4e6b7c" href={`/release-note.txt`} rel="noreferrer" target="_blank" underline="hover">&copy; Jail manager v1.0</Link>
      </footer>
    </Fragment>
  );
};

export default Layout;
