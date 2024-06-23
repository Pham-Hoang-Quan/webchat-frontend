import { useEffect, useState } from 'react';
import { APIURL } from "../serverConfig";

const useGetBlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshBlockedUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${APIURL}/api/users/getBlockUsers`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBlockedUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refreshBlockedUsers();
  }, []);

  return { blockedUsers, loading, error, refreshBlockedUsers };
};

export default useGetBlockedUsers;