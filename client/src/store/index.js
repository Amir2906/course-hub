import axios from "axios";
import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    userToken: null, // To store the user token upon successful login
    studentId: null,
    validToken: null,
    error: null, // To store login errors
    courses: [],
    enrolledCourses: [],
    enrollmentStatus: 'idle',
    loginLoading: 'idle',
    courseLoading: 'idle',
    enrolledCourseLoading: 'idle',
    enrollInCourseLoading: 'idle',
    updateCourseLoading: 'idle',
    toggleLikeLoading: 'idle',
    toggleDislikeLoading: 'idle',
};

export const loginUser = createAsyncThunk('coursehub/login', async ({ email, password }, thunkAPI) => {
    try {
        // Send a POST request to your login API endpoint
        const response = await axios.post('http://localhost:5000/api/login/', { email, password });

        // console.log(response.data);
        // Assuming your backend sends a response with a user token upon successful login
        const userToken = response.data.token;
        const studentId = response.data.id;
        const generatedAt = response.data.generatedAt;
        
        // Store the user token in localStorage or a cookie for future requests
        localStorage.setItem('userToken', userToken);
        localStorage.setItem('studentId', studentId);
        localStorage.setItem('generatedAt', generatedAt);
        const fifteenMinutes = 15 * 60 * 1000;

        setTimeout(() => {
            localStorage.removeItem('userToken');
            localStorage.removeItem('studentId');
        }, fifteenMinutes);
        
        const validToken = generatedAt + fifteenMinutes;
        console.log(validToken);
        console.log(typeof(validToken));
        // Return the user token to be stored in the Redux state
        return {studentId, userToken, validToken};
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const fetchCourses = createAsyncThunk('coursehub/fetchCourses', async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/courses', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        });
        // console.log(response.data);
        return response.data; // Assuming your API response contains courses data
    } catch (error) {
        throw error;
    }
});

export const fetchEnrolledCourses = createAsyncThunk('coursehub/fetchEnrolledCourses', async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/enroll/${localStorage.getItem('studentId')}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const enrollInCourse = createAsyncThunk(
    'coursehub/enroll',
    async ({ courseId }) => {
        try {
            // Get the user token and student ID from local storage
            const userToken = localStorage.getItem('userToken');
            const studentId = localStorage.getItem('studentId');

            // Send a POST request to enroll in the course
            await axios.post(`http://localhost:5000/api/enroll/${studentId}/${courseId}`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            return 'Enrolled successfully';
        } catch (error) {
            console.log(error.response.data.message);
            throw error.response.data.message; // Pass the error message from the backend
        }
    }
);

export const updateCourseStatus = createAsyncThunk(
    'coursehub/updateEnrollStatus',
    async ({ courseId }, {getState}) => {
        try {
            // Get the user token and student ID from local storage
            const userToken = localStorage.getItem('userToken');
            const studentId = localStorage.getItem('studentId');
            console.log(courseId);
            // Send a POST request to enroll in the course
            await axios.put(`http://localhost:5000/api/enroll/status/${studentId}/${courseId}`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            return 'Status updated successfully';
        } catch (error) {
            throw error.response.data.message; // Pass the error message from the backend
        }
    }
);

export const toggleLike = createAsyncThunk(
    'coursehub/toggle-like',
    async ({ courseId }) => {
        try {
            // Get the user token and student ID from local storage
            const userToken = localStorage.getItem('userToken');
            const studentId = localStorage.getItem('studentId');
            console.log(typeof(courseId));
            // Send a POST request to enroll in the course
            await axios.post(`http://localhost:5000/api/enroll/toggle-like/${studentId}/${courseId}`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            return 'Course liked status updated successfully';
        } catch (error) {
            throw error.response.data.message; // Pass the error message from the backend
        }
    }
);

export const toggleDislike = createAsyncThunk(
    'coursehub/toggle-dislike',
    async ({ courseId }) => {
        try {
            // Get the user token and student ID from local storage
            const userToken = localStorage.getItem('userToken');
            const studentId = localStorage.getItem('studentId');
            console.log(courseId);
            // Send a POST request to enroll in the course
            await axios.post(`http://localhost:5000/api/enroll/toggle-dislike/${studentId}/${courseId}`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            return 'Course disliked status updated successfully';
        } catch (error) {
            throw error.response.data.message; // Pass the error message from the backend
        }
    }
);

const CourseHubSlice = createSlice({
    name: "CourseHub",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            // You can update the state to indicate that the login request is pending.
            state.loginLoading = 'pending';
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            // Handle successful login, e.g., set user token in the state
            state.userToken = action.payload.userToken;
            state.studentId = action.payload.studentId;
            state.validToken = action.payload.validToken;
            state.loginLoading = 'success'
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            // Handle login failure, e.g., set an error message
            state.error = action.payload.message;
            state.loginLoading = 'rejected';
        });
        builder.addCase(fetchCourses.fulfilled, (state, action) => {
            // Update the state with the fetched courses
            state.courses = action.payload;
            state.courseLoading = 'success';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(fetchCourses.pending, (state) => {
            state.courseLoading = 'pending';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(fetchCourses.rejected, (state, action) => {
            state.error = action.payload;
            state.courseLoading = 'rejected';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(fetchEnrolledCourses.pending, (state) => {
            state.enrolledCourseLoading = 'pending';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
            state.enrolledCourses = action.payload;
            state.enrolledCourseLoading = 'success'
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(fetchEnrolledCourses.rejected, (state, action) => {
            state.error = action.payload;
            state.enrolledCourseLoading = 'rejected';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(enrollInCourse.pending, (state) => {
            state.enrollInCourseLoading = 'pending'; // Set loading state
            state.loginLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(enrollInCourse.rejected, (state, action) => {
            state.enrollInCourseLoading = 'rejected';
            state.loginLoading = 'idle';
            state.error = action.payload;
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(enrollInCourse.fulfilled, (state, action) => {
            state.enrollInCourseLoading = 'success';
            state.loginLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(updateCourseStatus.pending, (state) => {
            state.updateCourseLoading = 'pending';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(updateCourseStatus.fulfilled, (state) => {
            state.updateCourseLoading = 'success';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(updateCourseStatus.rejected, (state, action) => {
            state.updateCourseLoading = 'rejected';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
            state.error = action.payload;
        });
        builder.addCase(toggleLike.pending, (state) => {
            state.toggleLikeLoading = 'pending';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(toggleLike.fulfilled, (state) => {
            state.toggleLikeLoading = 'success';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
        });
        builder.addCase(toggleLike.rejected, (state, action) => {
            state.toggleLikeLoading = 'rejected';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleDislikeLoading = 'idle';
            state.error = action.payload;
        });
        builder.addCase(toggleDislike.pending, (state) => {
            state.toggleDislikeLoading = 'pending';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
        });
        builder.addCase(toggleDislike.fulfilled, (state) => {
            state.toggleDislikeLoading = 'success';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
        });
        builder.addCase(toggleDislike.rejected, (state, action) => {
            state.toggleDislikeLoading = 'rejected';
            state.loginLoading = 'idle';
            state.enrollInCourseLoading = 'idle';
            state.enrolledCourseLoading = 'idle';
            state.updateCourseLoading = 'idle';
            state.toggleLikeLoading = 'idle';
            state.error = action.payload;
        });
    }
})

const store = configureStore({
    reducer: {
        coursehub: CourseHubSlice.reducer
    }
})

export default store;