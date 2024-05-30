import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { ResponsiveContextProvider } from "./context/ResponsiveContext";


ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<ResponsiveContextProvider>
				<AuthContextProvider>
					<SocketContextProvider>
						<App />
					</SocketContextProvider>
				</AuthContextProvider>
			</ResponsiveContextProvider>
		</BrowserRouter>
	</React.StrictMode>
);
