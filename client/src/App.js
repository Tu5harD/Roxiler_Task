import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Statistics from "./components/Statistics";
import BarChartStatistic from "./components/BarChart";
import PieChartStats from "./components/PieChart";
import DashBord from "./components/DashBoard";
import CombinedData from "./components/CombinedData";

export default function App() {
  return (
    <Router>
      <div className="p-5">
        <Routes>
          <Route path="/" element={<DashBord />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/barchart" element={<BarChartStatistic />} />
          <Route path="/piechart" element={<PieChartStats />} />
          <Route path="/piechart" element={<PieChartStats />} />
          <Route path="/combined-data" element={<CombinedData />} />{" "}
        </Routes>
      </div>
    </Router>
  );
}
