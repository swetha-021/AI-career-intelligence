import { BrowserRouter, Routes, Route } from "react-router-dom";

import CareerIntelligence from "./pages/CareerIntelligence";
import JobTracker from "./pages/JobTracker";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CareerIntelligence />} />
        <Route path="/job-tracker" element={<JobTracker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;