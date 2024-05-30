import { createContext, useContext, useState } from "react";

export const ResponsiveContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useResponsiveContext = () => {
	return useContext(ResponsiveContext);
};

export const ResponsiveContextProvider = ({ children }) => {
	const [showSidebar, setShowSidebar] = useState(false);
	return <ResponsiveContext.Provider value={{ showSidebar, setShowSidebar}}>{children}</ResponsiveContext.Provider>;
};
