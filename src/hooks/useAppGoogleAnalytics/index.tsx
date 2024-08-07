import ReactGA from "react-ga4";

const useAppGoogleAnalytics = () => {
  const sendSignedUpEvent = () => {
    // ReactGA.send("")
  };

  return {
    sendSignedUpEvent,
  };
};

export default useAppGoogleAnalytics;
