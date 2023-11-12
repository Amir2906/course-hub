import React from 'react'
import Navbar from '../components/Navbar'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { enrollInCourse, fetchCourses } from '../store'
import Logo from '../assets/Logo.png'
import { enqueueSnackbar } from 'notistack'
import Spinner from '../components/Loading'
import Footer from '../components/Footer'
import { Tooltip } from '@mui/material'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

const Home = () => {
    const courses = useSelector((state) => state.coursehub.courses);
    const enrollInCourseLoading = useSelector((state) => state.coursehub.enrollInCourseLoading);
    const courseLoading = useSelector((state) => state.coursehub.courseLoading);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [data, setData] = useState(courses);

    // const userToken = useSelector((state) => state.coursehub.userToken);
    // const studentId = useSelector((state) => state.coursehub.studentId);
    // const vaildToken = useSelector((state) => state.coursehub.vaildToken);
    // console.log(userToken);
    // console.log(studentId);
    // console.log(vaildToken);

    useEffect(() => {
        dispatch(fetchCourses());
        setData(courses);
    }, [dispatch, courses]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // console.log(data);
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        // console.log(data);
        const filteredData = data.filter(
            (d) =>
                d.name.toLowerCase().includes(query) ||
                d.instructor.toLowerCase().includes(query)
        );
        setSearchResults(filteredData);
    };

    const courseDetails = (id) => {
        navigate(`/course-details/${id}`, {
            state: {
                id: id,
            },
        });
    }

    const handleEnroll = (id) => {
        // console.log(id);
        dispatch(enrollInCourse({ courseId: id }));
    }

    useEffect(() => {
        if (courseLoading === 'pending') {
            // enqueueSnackbar("loading...", {variant: 'error'});
            <Spinner />
        }
        else if (courseLoading === 'rejected') {
            enqueueSnackbar("Some Error Occured", { variant: 'error' });
        }
        else if (courseLoading === 'success') {
            //   enqueueSnackbar("Courses Loaded Successfully", {variant: 'success'});
        }
    }, [courseLoading])

    useEffect(() => {
        if (enrollInCourseLoading === 'rejected') {
            enqueueSnackbar("You are Already Enrolled Unable to Enroll! Try again later", { variant: 'error' });
        }
        else if (enrollInCourseLoading === 'pending') {
            // enqueueSnackbar("loading...", {variant: 'error'});
            <Spinner />
        }
        else if (enrollInCourseLoading === 'success') {
            enqueueSnackbar("Enrolled Successfully", { variant: 'success' });
        }
    }, [enrollInCourseLoading])

    if (!localStorage.getItem('userToken')) {
        return <Navigate to='/login' />;
    }

    const dataToRender = searchQuery ? searchResults : courses;
    return (
        <>
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
                    {dataToRender.map((d) => {
                        return (
                            <div
                                key={d._id}
                                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 cursor-pointer"
                            >
                                <div className="w-full rounded-lg shadow-md border overflow-hidden">
                                    <img
                                        className="w-full h-auto"
                                        src={Logo}
                                        alt="Card"
                                        onClick={() => courseDetails(d.id)}
                                    />
                                    <div className="px-6 py-4">
                                        <div onClick={() => courseDetails(d.id)}>
                                            <p className="text-gray-800 text-base font-bold">{d.name}</p>
                                            <p className="text-gray-800 text-base">Instructor: {d.instructor}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex justify-left items-center">
                                                <Tooltip title='Likes'>
                                                    <ThumbUpOutlinedIcon className="text-4xl mr-2" />
                                                </Tooltip>
                                                <span className='text-black-900'>{d.likes}</span>
                                            </div>
                                            <div className="flex justify-left items-center">
                                                <Tooltip title='Dislikes'>
                                                    <ThumbDownAltOutlinedIcon className="text-4xl mr-2" />
                                                </Tooltip>
                                                <span className='text-black-900'>{d.dislikes}</span>
                                            </div>

                                            <button onClick={() => handleEnroll(d.id)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Enroll</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer className="mt-auto" />
        </>
    )
}

export default Home
