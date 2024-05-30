import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const { loading, login } = useLogin();


    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    };
    return (
        <div style={{
            backgroundImage: `url(./public/bgLogin1.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} className="p-4 h-screen flex items-center justify-center">
            <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
                <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
                    <h1 className='text-3xl font-semibold text-center text-gray-300'
                    style={{color: '#f2f8ca'}}
                    >

                        Login
                        {/* <span className='text-500'> ChatApp</span> */}
                    </h1>


                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className='label p-2'>
                                <span className='text-base label-text'>Username</span>
                            </label>
                            <input
                                type='text'
                                placeholder='Enter username'
                                className='w-full input input-bordered h-10'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>


                        <div>
                            <label className='label'>
                                <span className='text-base label-text'>Password</span>
                            </label>
                            <input
                                type='password'
                                placeholder='Enter Password'
                                className='w-full input input-bordered h-10'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='flex justify-between'>
                            <Link to='/signup' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
                                {"Don't"} have an account?
                            </Link>
                            <Link to='/signup' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
                                {"Forgot"} Password?
                            </Link>
                        </div>


                        <div>
                            <button style={{ background: '#5f7052', color: '#f2f8ca' }} className='btn btn-block btn-sm mt-2' disabled={loading}>
                                {loading ? <span className='loading loading-spinner'></span> : "Login"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Login;