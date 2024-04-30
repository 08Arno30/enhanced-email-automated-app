import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/landingPage/LandingPage";
import Inbox from "./components/inbox/Inbox";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/enhanced-email-automated-app/landing-page"
          element={<LandingPage />}
        />
        <Route path="/enhanced-email-automated-app/inbox" element={<Inbox />} />
        <Route
          path="*"
          element={<Navigate to="/enhanced-email-automated-app/landing-page" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
