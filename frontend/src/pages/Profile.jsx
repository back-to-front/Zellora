import { useState, useEffect } from "react";
import { Link } from "react-router";
import { FaUser, FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { questionService } from "../api/questionService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import { timeAgo } from "../utils/formatDate";
import toast from "react-hot-toast";
import "./Profile.css";

const Profile = () => {
  const {
    user,
    updateProfile,
    deleteAccount,
    loading: authLoading,
  } = useAuth();

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userQuestions, setUserQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      fetchUserQuestions();
    }
  }, [user]);

  const fetchUserQuestions = async () => {
    try {
      setLoadingQuestions(true);
      // Fetch user's questions from the API
      // Note: This is not implemented in the backend yet, so we'll just get all questions and filter
      const questions = await questionService.getQuestions();
      const userQs = questions.filter((q) => q.user._id === user._id);
      setUserQuestions(userQs);
    } catch (err) {
      setQuestionsError("Failed to fetch your questions");
      console.error("Error fetching user questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    // Reset form when canceling edit
    if (editMode) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (profileData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword =
          "Current password is required to change password";
      }

      if (profileData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters long";
      }

      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const updateData = {
        username: profileData.username,
        email: profileData.email,
      };

      if (profileData.newPassword && profileData.currentPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }

      await updateProfile(updateData);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile";
      toast.error(message);

      // Handle specific errors
      if (err.response?.data?.field) {
        setErrors({
          ...errors,
          [err.response.data.field]: message,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // The redirect and toast will be handled in the AuthContext
    } catch (err) {
      toast.error("Failed to delete account. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className='spinner-container'>
        <Spinner size='large' />
      </div>
    );
  }

  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <h1 className='page-title'>Your Profile</h1>
        <Button
          variant={editMode ? "secondary" : "primary"}
          onClick={toggleEditMode}
        >
          {editMode ? "Cancel Editing" : "Edit Profile"}
        </Button>
      </div>

      <div className='profile-content'>
        <div className='profile-info-section'>
          <Card className='profile-card'>
            {editMode ? (
              <form className='profile-form' onSubmit={handleSubmit}>
                <Input
                  label='Username'
                  type='text'
                  id='username'
                  name='username'
                  value={profileData.username}
                  onChange={handleChange}
                  error={errors.username}
                  required
                />

                <Input
                  label='Email'
                  type='email'
                  id='email'
                  name='email'
                  value={profileData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <h3 className='section-title'>Change Password</h3>

                <Input
                  label='Current Password'
                  type='password'
                  id='currentPassword'
                  name='currentPassword'
                  value={profileData.currentPassword}
                  onChange={handleChange}
                  error={errors.currentPassword}
                />

                <Input
                  label='New Password'
                  type='password'
                  id='newPassword'
                  name='newPassword'
                  value={profileData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                />

                <Input
                  label='Confirm New Password'
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  value={profileData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />

                <div className='form-actions'>
                  <Button type='submit' variant='primary' disabled={submitting}>
                    {submitting ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className='profile-info'>
                <div className='profile-avatar'>
                  <FaUser />
                  <div className='username'>{user.username}</div>
                </div>

                <div className='profile-details'>
                  <div className='detail-item'>
                    <span className='detail-label'>Email:</span>
                    <span className='detail-value'>{user.email}</span>
                  </div>

                  <div className='detail-item'>
                    <span className='detail-label'>Member Since:</span>
                    <span className='detail-value'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {user.isAdmin && (
                    <div className='detail-item'>
                      <Badge variant='primary'>Admin</Badge>
                    </div>
                  )}
                </div>

                <div className='profile-actions'>
                  <Button
                    variant='danger'
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <FaTrash /> Delete Account
                  </Button>
                </div>

                {showDeleteConfirm && (
                  <div className='delete-confirmation'>
                    <Alert variant='danger'>
                      <div className='alert-content'>
                        <FaExclamationTriangle className='alert-icon' />
                        <div>
                          <h3>Delete Your Account?</h3>
                          <p>
                            This action cannot be undone. All your questions,
                            answers, and account information will be permanently
                            deleted.
                          </p>
                        </div>
                      </div>
                      <div className='alert-actions'>
                        <Button
                          variant='danger'
                          size='small'
                          onClick={handleDeleteAccount}
                        >
                          Yes, Delete Account
                        </Button>
                        <Button
                          variant='secondary'
                          size='small'
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Alert>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className='profile-activity-section'>
          <h2 className='section-title'>Your Questions</h2>

          {loadingQuestions ? (
            <div className='spinner-container'>
              <Spinner size='medium' />
            </div>
          ) : questionsError ? (
            <Alert variant='danger'>{questionsError}</Alert>
          ) : userQuestions.length === 0 ? (
            <div className='no-questions'>
              <p>You haven't asked any questions yet.</p>
              <Link to='/ask'>
                <Button variant='primary'>Ask Your First Question</Button>
              </Link>
            </div>
          ) : (
            <div className='questions-list'>
              {userQuestions.map((question) => (
                <Card key={question._id} className='question-item'>
                  <div className='question-summary'>
                    <h3 className='question-title'>
                      <Link to={`/questions/${question._id}`}>
                        {question.title}
                      </Link>
                    </h3>
                    <div className='question-meta'>
                      <div className='question-stats'>
                        <span className='stat-item'>
                          {question.voteCount} votes
                        </span>
                        <span className='stat-item'>
                          {question.answers?.length || 0} answers
                        </span>
                      </div>
                      <div className='question-time'>
                        {timeAgo(question.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className='question-actions'>
                    <Link to={`/questions/${question._id}/edit`}>
                      <Button variant='secondary' size='small'>
                        <FaEdit /> Edit
                      </Button>
                    </Link>
                    <Link to={`/questions/${question._id}`}>
                      <Button variant='primary' size='small'>
                        View
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
