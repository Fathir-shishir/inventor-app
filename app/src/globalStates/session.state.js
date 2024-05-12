import { createHook, createStore } from "react-sweet-state";


const Store = createStore({
    initialState: {
        open: false, // State of the navigation menu (opened or not)
        name: "", // The name of the user
        role: "", // The role of the user
        currentLanguage: "de",
        lines: [],
        navDropdowns: {
            lines: false
        },
    },
    actions: {
        // Update the session data (replace the whole object with the data from the DB)
        setSession: (sessionData) => ({ setState, getState }) => {
            const currentState = getState();
            setState({ ...currentState, ...sessionData, navDropdowns: {...sessionData.navDropdowns}});
        },
        // Set a specific variable in the session state
        setVar: (key, value) => ({ getState, setState }) => {
            const currentState = getState();
            setState({ ...currentState, [key]: value })
        },

        // Change line dropdown open status
        toggleNavOpen: (key) => ({ getState, setState }) => {
            const currentState = getState();

            let newNavDropdowns = Object.keys(currentState.navDropdowns).filter(dropDown => dropDown != key).reduce((acc, dropdownKey) => {
                acc[dropdownKey] = false;  // Set all to false
                return acc;
            }, {});

            setState({ ...currentState, navDropdowns: {...newNavDropdowns, [key]: !currentState.navDropdowns[key]}})
        },

        closeAllMenu: () => ({ getState, setState }) => {
            const currentState = getState();

            let newNavDropdowns = Object.keys(currentState.navDropdowns).reduce((acc, dropdownKey) => {
                acc[dropdownKey] = false;  // Set all to false
                return acc;
            }, {});

            setState({ ...currentState, navDropdowns: newNavDropdowns})
        },
    }
})

export const useSession = createHook(Store);