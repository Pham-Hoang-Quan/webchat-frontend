import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import VideoCall from "./components/callvideo/VideoCall";

function App() {
	const { authUser } = useAuthContext();
	return (
		<div className=''>
			<Routes>
				<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} >
					<Route path='/addFriend' element={<Home />} />
				</Route>
				<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
				<Route path='/video-call/:conversationId' element={authUser ? <VideoCall></VideoCall> : <Navigate to={"/login"} ></Navigate>} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
