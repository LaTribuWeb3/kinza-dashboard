import { defer } from "react-router-dom";
import DataService from "./DataService";

export function overviewLoader() {
    const overviewData = DataService.GetOverview();
  
    return defer({
      overviewData: overviewData
    });
}