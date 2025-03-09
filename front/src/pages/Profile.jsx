import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
} from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";
import { loginSuccess } from "../features/loginAuthSlice";

const Profile = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.loginAuth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Load user data
  useEffect(() => {
    if (isAuthenticated && user) {
      // In a real app, you would fetch the user profile from an API
      // For now, we'll use mock data
      setFormData({
        firstName: user.firstName || "John",
        lastName: user.lastName || "Doe",
        email: user.email || "john.doe@example.com",
        phone: user.phone || "+1 234 567 890",
        address: user.address || "123 Main St",
        city: user.city || "New York",
        country: user.country || "USA",
        bio: user.bio || "I am a user of this amazing application!",
      });

      // Set profile image if available
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData object for file upload
      const profileData = new FormData();

      // Add profile image if it exists
      if (profileImage) {
        profileData.append("profileImage", profileImage);
      }

      // Add form data
      Object.keys(formData).forEach((key) => {
        profileData.append(key, formData[key]);
      });

      const token = localStorage.getItem("token");
      console.log(
        "Token being sent:",
        token ? "Token exists" : "No token found"
      );

      // Send data to backend
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        profileData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile update response:", response.data);

      // Update Redux store with new user data
      dispatch(
        loginSuccess({
          user: response.data.user,
          token: token,
        })
      );

      setSuccess(true);
      setIsEditing(false);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Profile update error:", err);

      // Extract error message from response if available
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update profile. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">
            {t("profile.notLoggedIn")}
          </h1>
          <p className="text-center mb-6">{t("profile.loginToView")}</p>
          <div className="flex justify-center">
            <a
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {t("navbar.login")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-auto pb-20 ${isRTL() ? "rtl" : ""}`}
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="container mx-auto px-4 py-8 mb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-visible mb-10">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-md">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <FaUser className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    <FaCamera />
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {formData.firstName} {formData.lastName}
                </h1>
                <p className="text-green-100 mt-1">{formData.email}</p>
                <div className="mt-4">
                  {!isEditing ? (
                    <button
                      onClick={toggleEdit}
                      className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors flex items-center"
                    >
                      <FaEdit className="mr-2" /> {t("profile.editProfile")}
                    </button>
                  ) : (
                    <button
                      onClick={toggleEdit}
                      className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition-colors flex items-center"
                    >
                      <FaTimes className="mr-2" /> {t("common.cancel")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-6">
              <p className="font-bold">{t("common.success")}</p>
              <p>{t("profile.updateSuccess")}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-6">
              <p className="font-bold">{t("common.error")}</p>
              <p>{error}</p>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="mobile-form-padding">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                    {t("profile.personalInfo")}
                  </h2>
                </div>

                {/* First Name */}
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="firstName"
                  >
                    {t("profile.firstName")}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-800">{formData.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="lastName"
                  >
                    {t("profile.lastName")}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-800">{formData.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="email"
                  >
                    {t("auth.email")}
                  </label>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    ) : (
                      <p className="text-gray-800">{formData.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="phone"
                  >
                    {t("profile.phoneNumber")}
                  </label>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-500 mr-2" />
                    {isEditing ? (
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.phone}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="md:col-span-2 mt-6">
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                    {t("profile.contactInfo")}
                  </h2>
                </div>

                {/* Address */}
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="address"
                  >
                    {t("profile.address")}
                  </label>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-gray-500 mr-2 mt-1" />
                    {isEditing ? (
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.address}</p>
                    )}
                  </div>
                </div>

                {/* City */}
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="city"
                  >
                    {t("profile.city")}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.city}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="country"
                  >
                    {t("profile.country")}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-800">{formData.country}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2 mt-6">
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="bio"
                  >
                    {t("profile.bio")}
                  </label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    ></textarea>
                  ) : (
                    <p className="text-gray-800">{formData.bio}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              {isEditing && (
                <>
                  {/* Desktop Save Button */}
                  <div className="mt-8 pb-10 hidden md:flex justify-end">
                    <button
                      type="submit"
                      className={`bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors flex items-center ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t("common.saving")}
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" /> {t("common.save")}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Mobile Save Button */}
                  <div className="md:hidden fixed bottom-24  z-50">
                    <button
                      type="submit"
                      className={`profile-save-button bg-green-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center w-16 h-16 mb-20 ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-8 w-8 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <FaSave className="text-3xl" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
