import { createContext, useEffect, useState, } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = (props) => {
          
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
    const [userData, setUserData] = useState(false);

    // Getting Doctors using API
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list');
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Getting User Profile using API
    const loadUserProfileData = async () => {

           if (!token) {
            setUserData(false);
            return;
        } 

        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { Authorization: `Bearer ${token}` } });      // Updated to use Bearer token     
            if (data.success) {
                setUserData(data.userData);
            } else {
                localStorage.removeItem('token');
                setToken('false');
                setUserData(false);
                toast.error(data.message);
            }
        } catch (error) {
           localStorage.removeItem("token");
            setToken(false);
            setUserData(false);
            toast.error("Session expired. Please login again.");
        }
    }

    useEffect(() => {
        getDoctorsData();
    }, []);

     useEffect(() => {
        loadUserProfileData();
    }, [token]);


    useEffect(() => {
       if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const value = {
        doctors, getDoctorsData,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;