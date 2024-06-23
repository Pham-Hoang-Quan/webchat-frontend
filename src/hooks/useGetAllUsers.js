import { useState, useEffect } from 'react';
import { APIURL } from "../serverConfig";

const useGetAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshUsers = async () => {
        setLoading(true); 
        try {
            const response = await fetch(`${APIURL}/api/users/all`); // Không cần thêm tham số isBlocked vào URL
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            const filteredUsers = data.filter(user => !user.isBlocked);
            setUsers(filteredUsers);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUsers(); 
    }, []); 

    return { users, loading, error, refreshUsers }; 
};

export default useGetAllUsers;