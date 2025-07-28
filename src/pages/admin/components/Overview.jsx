// components/Overview.jsx
import StatsContainer from "./StatsContainer";
import QuickActions from "./QuickActions";
import ActivityList from "./ActivityList";

const Overview = ({
  stats,
  activities,
  setModalType,
  setShowModal,
  setFormData,
  setActiveSection,
  loadDashboardData,
}) => {
  // Generate employee code
  const generateEmployeeCode = (role) => {
    const prefix =
      role === "Electrician" ? "ELC" : role === "Manager" ? "MGR" : "ADM";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  // Handle generate report
  const handleGenerateReport = async (reportId) => {
    try {
      // This will be implemented in the Reports component
      console.log("Generate report:", reportId);
    } catch (error) {
      alert("Error generating report: " + error.message);
    }
  };

  return (
    <>
      {/* Stats Overview */}
      <StatsContainer stats={stats} />

      {/* Quick Actions */}
      <QuickActions
        setModalType={setModalType}
        setShowModal={setShowModal}
        setFormData={setFormData}
        setActiveSection={setActiveSection}
        generateEmployeeCode={generateEmployeeCode}
        handleGenerateReport={handleGenerateReport}
      />

      {/* Recent Activity */}
      <ActivityList activities={activities} />
    </>
  );
};

export default Overview;
