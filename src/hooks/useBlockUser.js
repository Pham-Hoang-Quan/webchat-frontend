import { useState, useEffect } from 'react';
import { APIURL } from "../serverConfig";

const useBlockUser = () => {
  const [userBlock, setUserBlock] = useState([]); 

  const blockUser = async (userId) => {
    try {
      const response = await fetch(`${APIURL}/api/users/block/${userId}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setUserBlock([...userBlock, userId]); 

      return response.json(); 
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error; 
    }
  };

  return { blockUser, userBlock }; 
};

export default useBlockUser;