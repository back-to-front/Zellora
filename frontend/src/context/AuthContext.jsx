import { createContext, useState, useContext, useEffect } from "react";
import { userService } from "../api/userService";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user if token exists
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await userService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user", error);
          // If token is invalid, clear it
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { user: userData, token: authToken } = await userService.login(
        email,
        password
      );
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
      toast.success("Login successful");
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const { user: userData, token: authToken } = await userService.register(
        username,
        email,
        password
      );
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(userData);
      toast.success("Registration successful");
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      return updatedUser;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      await userService.deleteProfile();
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      toast.success("Account deleted successfully");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete account";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
