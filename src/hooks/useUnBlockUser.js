import { useState, useEffect } from 'react';
import { APIURL } from "../serverConfig";

const useUnBlockUser = () => {
  const [userUnBlock, setUserUnBlock] = useState([]); 

  const unBlockUser = async (userId) => {
    try {
      const response = await fetch(`${APIURL}/api/users/unBlock/${userId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setUserUnBlock([...userUnBlock, userId]); 

      return response.json(); 
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error; 
    }
  };

  return { unBlockUser, userUnBlock }; 
};

export default useUnBlockUser;