import { useEffect, useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaUserShield,
} from "react-icons/fa";
import { adminService } from "../../api/userService";
import Card from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import "./UserManagement.css";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = await adminService.getUsers();
        setUsers(userData);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePromoteToAdmin = async (userId, isAdmin) => {
    if (isAdmin) {
      if (
        !confirm(
          "Are you sure you want to remove admin privileges from this user?"
        )
      ) {
        return;
      }
    } else {
      if (
        !confirm("Are you sure you want to grant this user admin privileges?")
      ) {
        return;
      }
    }

    try {
      await adminService.updateUserRole(userId, { isAdmin: !isAdmin });

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isAdmin: !isAdmin } : user
        )
      );

      toast.success(`User ${isAdmin ? "demoted" : "promoted"} successfully`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Action failed. Please try again."
      );
    }
  };

  const handleSuspendUser = async (userId, isSuspended) => {
    try {
      if (isSuspended) {
        await adminService.unsuspendUser(userId);
        toast.success("User unsuspended successfully");
      } else {
        const suspensionData = {
          duration: 7,
          reason: "Violation of community guidelines",
        };

        await adminService.suspendUser(userId, suspensionData);
        toast.success("User suspended successfully");
      }

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isSuspended: !isSuspended } : user
        )
      );
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
      // Remove from local state
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete user. Please try again."
      );
    }
  };

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active") return matchesSearch && !user.isSuspended;
    if (filterStatus === "suspended") return matchesSearch && user.isSuspended;
    if (filterStatus === "admin") return matchesSearch && user.isAdmin;

    return matchesSearch;
  });

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
    <div className='user-management'>
      <h1 className='page-title'>User Management</h1>

      <div className='filters-container'>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search users by name or email...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='search-input'
          />
        </div>

        <div className='status-filter'>
          <button
            className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${
              filterStatus === "active" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${
              filterStatus === "suspended" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("suspended")}
          >
            Suspended
          </button>
          <button
            className={`filter-btn ${filterStatus === "admin" ? "active" : ""}`}
            onClick={() => setFilterStatus("admin")}
          >
            Admins
          </button>
        </div>
      </div>

      <Card className='users-table-card'>
        <div className='table-responsive'>
          <table className='users-table'>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan='6' className='no-users'>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className='user-info'>
                        <div className='user-avatar'>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className='user-name'>{user.username}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.isSuspended ? "suspended" : "active"
                        }`}
                      >
                        {user.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`role-badge ${
                          user.isAdmin ? "admin" : "user"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td>
                      <div className='user-actions'>
                        <button
                          className={`action-btn ${
                            user.isAdmin ? "remove-admin" : "make-admin"
                          }`}
                          onClick={() =>
                            handlePromoteToAdmin(user._id, user.isAdmin)
                          }
                          title={
                            user.isAdmin
                              ? "Remove admin privileges"
                              : "Make admin"
                          }
                        >
                          <FaUserShield />
                        </button>
                        <button
                          className={`action-btn ${
                            user.isSuspended ? "unsuspend" : "suspend"
                          }`}
                          onClick={() =>
                            handleSuspendUser(user._id, user.isSuspended)
                          }
                          title={
                            user.isSuspended ? "Unsuspend user" : "Suspend user"
                          }
                        >
                          {user.isSuspended ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}
                        </button>
                        <button
                          className='action-btn delete'
                          onClick={() => handleDeleteUser(user._id)}
                          title='Delete user'
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
