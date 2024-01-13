import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Logo from '../assets/Logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEnrolledCourses, toggleDislike, toggleLike, updateCourseStatus } from '../store'
import { Navigate, useNavigate } from 'react-router-dom'
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownAltRoundedIcon from '@mui/icons-material/ThumbDownAltRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Tooltip } from '@mui/material'
import Spinner from '../components/Loading'
import { enqueueSnackbar } from 'notistack'
import Footer from '../components/Footer'

const StudentDashboard = () => {
    const enrolledCourses = useSelector((state) => state.coursehub.enrolledCourses);
    const enrolledCourseLoading = useSelector((state) => state.coursehub.enrolledCourseLoading);
    const updateCourseLoading = useSelector((state) => state.coursehub.updateCourseLoading);
    const toggleLikeLoading = useSelector((state) => state.coursehub.toggleLikeLoading)
    const toggleDislikeLoading = useSelector((state) => state.coursehub.toggleDislikeLoading)
    const navigate = useNavigate();

    // const userToken = useSelector((state) => state.coursehub.userToken);
    // const studentId = useSelector((state) => state.coursehub.studentId);
    // const vaildToken = useSelector((state) => state.coursehub.vaildToken);
    // console.log(userToken);
    // console.log(studentId);
    // console.log(vaildToken);

    const [data, setData] = useState(enrolledCourses);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchEnrolledCourses());
        setData(enrolledCourses);
    }, [dispatch, enrolledCourses]);

    const handleCourseStatus = (id) => {
        // console.log(id);
        dispatch(updateCourseStatus({ courseId: id }));
    }

    const handleLikeStatus = (id) => {
        // console.log(id);
        dispatch(toggleLike({ courseId: id }));
        // console.log(enrolledCourses);
    }

    const handleDislikeStatus = (id) => {
        // console.log(id);
        dispatch(toggleDislike({ courseId: id }));
    }

    const courseDetails = (id) => {
        navigate(`/course-details/${id}`, {
            state: {
                id: id,
            },
        });
    }
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredData = data.filter(
            (d) =>
                d.name.toLowerCase().includes(query) ||
                d.instructor.toLowerCase().includes(query)
        );
        setSearchResults(filteredData);
    };

    useEffect(() => {
        if (enrolledCourseLoading === 'rejected') {
            enqueueSnackbar("Some Error Occured", { variant: 'error' });
        }
        else if (enrolledCourseLoading === 'pending') {
            // enqueueSnackbar("enrolledCourseLoading...", {variant: 'error'});
            <Spinner />
        }
    }, [enrolledCourseLoading])

    useEffect(() => {
        if (updateCourseLoading === 'rejected') {
            enqueueSnackbar("Some Error Occured", { variant: 'error' });
        }
        else if (updateCourseLoading === 'pending') {
            // enqueueSnackbar("enrolledCourseLoading...", {variant: 'error'});
            <Spinner />
        }
        else if (updateCourseLoading === 'success') {
            enqueueSnackbar("Course Status updated", { variant: 'success' });
            // return <Navigate to='/student' />;
        }
    }, [updateCourseLoading])

    useEffect(() => {
        if (toggleLikeLoading === 'rejected') {
            enqueueSnackbar("Some Error Occured", { variant: 'error' });
        }
        else if (toggleLikeLoading === 'pending') {
            // enqueueSnackbar("enrolledCourseLoading...", {variant: 'error'});
            <Spinner />
        }
        else if (toggleLikeLoading === 'success') {
            // enqueueSnackbar("Course Status updated", { variant: 'success' });
            // return <Navigate to='/student' />;
        }
    }, [toggleLikeLoading])

    useEffect(() => {
        if (toggleDislikeLoading === 'rejected') {
            enqueueSnackbar("Some Error Occured", { variant: 'error' });
        }
        else if (toggleDislikeLoading === 'pending') {
            // enqueueSnackbar("enrolledCourseLoading...", {variant: 'error'});
            <Spinner />
        }
        else if (toggleDislikeLoading === 'success') {
            // enqueueSnackbar("Course Status updated", { variant: 'success' });
            // return <Navigate to='/student' />;
        }
    }, [toggleDislikeLoading])

    if (!localStorage.getItem('userToken')) {
        return <Navigate to='/login' />;
    }

    const dataToRender = searchQuery ? searchResults : enrolledCourses;
    // console.log(dataToRender);
    return (
        <div>
            <Navbar />
            <div
                className=" mt-[90px] bg-white px-4 w-full flex flex-wrap justify-center"
            >
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                </div>
                <div className="w-full flex flex-wrap justify-center">
                    {dataToRender.map((d, index) => {
                        return (
                            <div
                                key={index}
                                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 cursor-pointer"
                            >
                                <div className="w-full rounded-lg shadow-md border overflow-hidden">
                                    <img
                                        className="w-full h-auto"
                                        // src={d.thumbnail}
                                        src={Logo}
                                        alt="Card"
                                        onClick={() => courseDetails(d.id)}
                                    />
                                    <div className="px-6 py-4">
                                        <div onClick={() => courseDetails(d.id)}>
                                            <p className="text-gray-800 text-base font-bold">{d.name}</p>
                                            <p className="text-gray-800 text-base"><span className='font-bold'>Instructor:</span> {d.instructor}</p>
                                            {/* <p className="text-gray-800 text-base"><span className='font-bold'>Duration:</span> {d.duration}</p> */}
                                            <p className="text-gray-800 text-base"><span className='font-bold'>Enrolled Date:</span> {d.enrolledAt}</p>
                                        </div>
                                        <div className="mt-4">
                                            <div className="relative pt-1">
                                                <div className="flex mb-2 items-center justify-between">
                                                    <div>
                                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 " style={{ color: d.status === 'In Progress' ? "green" : "red" }}>
                                                            {d.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs font-semibold inline-block" style={{ color: d.progress < 100 ? "green" : "red" }}>
                                                            {d.progress}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                                    <div
                                                        style={{ width: `${d.progress}%`, background: d.progress < 100 ? "green" : "red" }}
                                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex justify-left items-center">
                                                <Tooltip onClick={() => handleLikeStatus(d.id)} title={d.isLiked ? 'Remove from Liked Courses' : 'Like Course'}>
                                                    {
                                                        d.isLiked ? (
                                                            <ThumbUpRoundedIcon className="text-4xl mr-2 text-blue-500 hover:text-blue-600 transition-color" />
                                                        ) : (
                                                            <ThumbUpOutlinedIcon className="text-4xl mr-2 hover:text-blue-500 transition-color" />
                                                        )
                                                    }
                                                </Tooltip>
                                                <span className='text-black-900'>{d.likes}</span>
                                            </div>
                                            <div className="flex justify-left items-center">
                                                <Tooltip onClick={() => handleDislikeStatus(d.id)} title={d.isDisliked ? 'Remove from Disliked Courses' : 'Dislike Course'}>
                                                    {
                                                        d.isDisliked ? (
                                                            <ThumbDownAltRoundedIcon className="text-4xl mr-2 text-blue-500 hover:text-blue-500 transition-color" />
                                                        ) : (
                                                            <ThumbDownAltOutlinedIcon className="text-4xl mr-2 hover:text-blue-500 transition-color" />
                                                        )
                                                    }
                                                </Tooltip>
                                                <span className='text-black-900'>{d.dislikes}</span>
                                            </div>
                                            <Tooltip title={d.status}>

                                                <button onClick={() => handleCourseStatus(d.id)}>

                                                    {d.status === 'In Progress' ? (
                                                        <CheckCircleOutlinedIcon className='hover:text-green-600' />
                                                    ) : (
                                                        <CheckCircleRoundedIcon className='text-green-600' />
                                                    )}
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer className="mt-auto" />
        </div>
    )
}

export default StudentDashboard
