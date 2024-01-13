import React from 'react'
import { Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { useSelector } from 'react-redux';

const CourseDetails = () => {
    const { id } = useParams();
    // console.log(id);
    // const navigate = useNavigate()

    const courses = useSelector((state) => state.coursehub.courses);

    const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);

    const toggleSyllabus = () => {
        setIsSyllabusOpen(!isSyllabusOpen);
    };

    if (!localStorage.getItem('userToken')) {
        return <Navigate to='/login' />;
    }

    const courseDetails = courses.find((course) => course.id === parseInt(id))
    // console.log(courseDetails)
    return (
        <div>
            <Navbar />
            <div
                className=" mt-[90px] bg-white px-4 w-full flex flex-wrap justify-center"
            >
                <div className='w-[60%] rounded-lg shadow-md border p-10'>
                    <p className='pb-2 text-[23px] font-bold mb-6' style={{ textAlign: 'center' }}>
                        <span style={{ borderBottom: '2px solid dodgerblue', paddingBottom: '2px' }}>Course Details</span>
                    </p>
                    <p className='text-[17px]'>Course name : <span className='font-medium text-[dodgerblue]'>{courseDetails.name}</span></p>
                    <p className='text-[17px]'>Instructor's name : <span className='font-medium text-[dodgerblue]'></span>{courseDetails.instructor}</p>
                    <p className='text-[17px]'>Description : <span className='font-medium text-[dodgerblue]'>{courseDetails.description}</span></p>
                    <p className='text-[17px]'>Enrollment status : <span className='font-medium text-[dodgerblue]'>{courseDetails.enrollmentStatus}</span></p>
                    <p className='text-[17px]'>Course duration : <span className='font-medium text-[dodgerblue]'>{courseDetails.duration}</span></p>
                    <p className='text-[17px]'>Schedule : <span className='font-medium text-[dodgerblue]'>{courseDetails.schedule}</span></p>
                    <p className='text-[17px]'>Location : <span className='font-medium text-[dodgerblue]'>{courseDetails.location}</span></p>
                    <p className='text-[17px]'>Pre-requisites : <span className='font-medium text-[dodgerblue]'>{courseDetails.prerequisites}</span></p>
                    <div className="my-2 sm:my-4 md:my-6 shadow-sm flex items-center justify-between pl-4 cursor-pointer bg-[#eeeeee]" onClick={toggleSyllabus}>
                        <p className='text-[19px] font-bold'>Syllabus</p>
                        {isSyllabusOpen ? (
                            <MdExpandLess size={40} className="ml-2" />
                        ) : (
                            <MdExpandMore size={40} className="ml-2" />
                        )}
                    </div>
                    {isSyllabusOpen && (
                        <div className="mt-4">
                            {courseDetails.syllabus.map((data, index) => (
                                <div key={index} className="mb-4">
                                    <p className="font-bold">Week {data.week}: {data.topic}</p>
                                    <p>{data.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default CourseDetails
