import { useEffect, useState } from 'react';
import { APIURL } from '../serverConfig';

const useStatic = () => {
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);
  const [chartBlockedUserData, setChartBlockedData] = useState([]);
  const [chartConversationData, setChartConversationData] = useState([]);

  const refreshChartData = async () => {
    setChartLoading(true);
    try {
      const response = await fetch(`${APIURL}/api/users/static`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      setChartError(error.message);
    } finally {
      setChartLoading(false);
    }
  };

  const refreshBlockedUser = async () => {
    setChartLoading(true);
    try {
      const response = await fetch(`${APIURL}/api/users/staticBlockUser`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setChartBlockedData(data);
    } catch (error) {
      setChartError(error.message);
    } finally {
      setChartLoading(false);
    }
  };

  const refreshConversation = async () => {
    setChartLoading(true);
    try {
      const response = await fetch(`${APIURL}/api/users/mostMessage`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setChartConversationData(data);
    } catch (error) {
      setChartError(error.message);
    } finally {
      setChartLoading(false);
    }
  };


  useEffect(() => {
    refreshChartData();
    refreshBlockedUser();
    refreshConversation();
  }, []);

  return { chartData, chartLoading, chartError, refreshChartData, refreshBlockedUser, refreshConversation, chartBlockedUserData, chartConversationData };
};

export default useStatic;