import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [navbar, setNavBar] = useState(false);
    const [disableMobileNavbar, setDisableMobileNavbar] = useState(false);
    const handleClick = () => setNavBar(!navbar);
    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogout = () => {
        setShowLogoutDialog(true);
        setDisableMobileNavbar(true);
    };

    const confirmLogout = () => {
        // Perform the logout action
        localStorage.removeItem('userToken'); // Assuming you store the token in localStorage
        localStorage.removeItem('studentId');
        navigate('/login');
    };

    const cancelLogout = () => {
        setShowLogoutDialog(false);
        setDisableMobileNavbar(false); // Enable the mobile menu after canceling the logout
    };

    return (
        <div className="bg-gray-800 fixed top-0 w-full z-[100]">
            <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div onClick={handleClick} className='md:hidden z-10 cursor-pointer'>
                        {!navbar && !disableMobileNavbar ? <FaBars color='white' /> : <FaTimes color='white' />}
                    </div>
                    <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <p className="text-white text-lg font-bold">Course Hub</p>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
                        <div className="hidden md:ml-6 md:block text-white">
                            <ul className="flex space-x-4">
                                <li>
                                    <Link to="/" className="hover:bg-gray-700 rounded px-2 py-1">
                                        Courses
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/student" className="hover:bg-gray-700 rounded px-2 py-1">
                                        Student Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="text-white focus:outline-none">
                                        <span className="hover:bg-gray-700 rounded px-2 py-1">Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={!navbar ? "hidden" : "absolute top-0 left-0 w-full h-screen bg-[#0a192f]"}>
                    <div className="space-y-1 px-2 pt-5 pb-3 flex flex-col justify-center items-center text-white">
                        <ul className="flex flex-col space-x-4">
                            <li className='my-[10px] ml-[15px]' onClick={()=>handleClick()} >
                                <Link to="/" className="hover:bg-gray-700 rounded px-2 py-1">
                                    Courses
                                </Link>
                            </li>
                            <li className='my-[10px]' onClick={()=>handleClick()}>
                                <Link to="/student" className="hover-bg-gray-700 rounded px-2 py-1">
                                    Student Dashboard
                                </Link>
                            </li>
                            <li className='my-[10px]'>
                                <button onClick={handleLogout} className="text-white focus:outline-none">
                                    <span className="hover-bg-gray-700 rounded px-2 py-1">Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                {showLogoutDialog && (
                    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg">
                            <p>Do you want to log out from the app?</p>
                            <div className="mt-4 flex justify-center">
                                <button onClick={confirmLogout} className="bg-red-500 text-white rounded px-4 py-2 mr-2">Yes</button>
                                <button onClick={cancelLogout} className="bg-gray-500 text-white rounded px-4 py-2">No</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
