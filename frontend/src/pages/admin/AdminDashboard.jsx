import { useState, useEffect } from "react";
import {
  FaUsers,
  FaQuestionCircle,
  FaCommentAlt,
  FaBan,
  FaUnlock,
} from "react-icons/fa";
import { adminService } from "../../api/userService";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import "./AdminDashboard.css";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);

        const usersData = await adminService.getUsers();
        setUsers(usersData);
      } catch (err) {
        setError("Failed to fetch admin data. Please try again later.");
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSuspendUser = async (userId, isSuspended) => {
    try {
      if (isSuspended) {
        await adminService.unsuspendUser(userId);
        toast.success("User unsuspended successfully");
      } else {
        // In a real app, you would show a modal to collect suspension details
        const suspensionData = {
          duration: 7, // days
          reason: "Violation of community guidelines",
        };

        await adminService.suspendUser(userId, suspensionData);
        toast.success("User suspended successfully");
      }

      // Refresh the users list
      const usersData = await adminService.getUsers();
      setUsers(usersData);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Action failed. Please try again."
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      toast.success("User deleted successfully");

      // Refresh the users list
      const usersData = await adminService.getUsers();
      setUsers(usersData);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete user. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className='spinner-container'>
        <Spinner size='large' />
      </div>
    );
  }

  if (error) {
    return <Alert variant='danger'>{error}</Alert>;
  }

  return (
    <div className='admin-dashboard'>
      <h1 className='page-title'>Admin Dashboard</h1>

      <div className='admin-tabs'>
        <button
          className={`tab-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`tab-item ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div className='dashboard-section'>
          <div className='stats-grid'>
            <Card className='stat-card'>
              <div className='stat-icon users-icon'>
                <FaUsers />
              </div>
              <div className='stat-details'>
                <div className='stat-value'>{stats.totalUsers}</div>
                <div className='stat-label'>Total Users</div>
              </div>
            </Card>

            <Card className='stat-card'>
              <div className='stat-icon questions-icon'>
                <FaQuestionCircle />
              </div>
              <div className='stat-details'>
                <div className='stat-value'>{stats.totalQuestions}</div>
                <div className='stat-label'>Total Questions</div>
              </div>
            </Card>

            <Card className='stat-card'>
              <div className='stat-icon answers-icon'>
                <FaCommentAlt />
              </div>
              <div className='stat-details'>
                <div className='stat-value'>{stats.totalAnswers}</div>
                <div className='stat-label'>Total Answers</div>
              </div>
            </Card>
          </div>

          <Card className='recent-activity-card'>
            <h2 className='card-title'>Platform Statistics</h2>

            <div className='stats-details'>
              <div className='stats-row'>
                <div className='stats-item'>
                  <span className='stats-label'>Questions Today:</span>
                  <span className='stats-value'>{stats.questionsToday}</span>
                </div>
                <div className='stats-item'>
                  <span className='stats-label'>Answers Today:</span>
                  <span className='stats-value'>{stats.answersToday}</span>
                </div>
              </div>

              <div className='stats-row'>
                <div className='stats-item'>
                  <span className='stats-label'>New Users (24h):</span>
                  <span className='stats-value'>{stats.newUsers24h}</span>
                </div>
                <div className='stats-item'>
                  <span className='stats-label'>Active Users (7d):</span>
                  <span className='stats-value'>{stats.activeUsers7d}</span>
                </div>
              </div>

              <div className='stats-row'>
                <div className='stats-item'>
                  <span className='stats-label'>Suspended Users:</span>
                  <span className='stats-value'>{stats.suspendedUsers}</span>
                </div>
                <div className='stats-item'>
                  <span className='stats-label'>IP Restrictions:</span>
                  <span className='stats-value'>{stats.ipRestrictions}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "users" && (
        <div className='users-section'>
          <Card>
            <h2 className='card-title'>Manage Users</h2>

            <div className='table-responsive'>
              <table className='admin-table'>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            user.isSuspended ? "suspended" : "active"
                          }`}
                        >
                          {user.isSuspended ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td>
                        <div className='table-actions'>
                          <Button
                            variant={user.isSuspended ? "success" : "warning"}
                            size='small'
                            onClick={() =>
                              handleSuspendUser(user._id, user.isSuspended)
                            }
                          >
                            {user.isSuspended ? (
                              <>
                                <FaUnlock /> Unsuspend
                              </>
                            ) : (
                              <>
                                <FaBan /> Suspend
                              </>
                            )}
                          </Button>
                          <Button
                            variant='danger'
                            size='small'
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
