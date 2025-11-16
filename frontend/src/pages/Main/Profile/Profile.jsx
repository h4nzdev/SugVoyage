import React, { useState, useEffect, useContext } from "react";
import ProfileMobile from "../../Mobile/ProfileMobile";
import ProfileDesktop from "../../Desktop/ProfileDesktop";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import { PostService } from "../../../services/postService";
import { AuthenticationService } from "../../../services/authenticationService";
import EditProfileModal from "./components/EditProfileModal";

// Mock data - replace with your actual API calls
const mockUser = {
  id: "1",
  username: "cebu_explorer",
  profile: {
    displayName: "Maria Santos",
    avatar: "👩",
    location: "Cebu City",
    bio: "Passionate traveler exploring the beautiful islands of Cebu. Love sharing hidden gems and local experiences!",
  },
  isVerified: true,
  socialStats: {
    followers: 245,
    following: 156,
  },
};

const savedItineraries = [
  {
    id: 1,
    title: "Cebu Cultural Weekend",
    duration: "2 days",
    spots: 6,
    created: "1 week ago",
  },
  {
    id: 2,
    title: "Beach & Island Adventure",
    duration: "3 days",
    spots: 8,
    created: "2 weeks ago",
  },
];

export default function Profile() {
  const { user: authUser, logout } = useContext(AuthenticationContext);
  const [user, setUser] = useState(mockUser);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // If we have an authenticated user, use their data
    if (authUser) {
      setUser({
        id: authUser.id || "1",
        username: authUser.username || "user",
        profile: {
          displayName: authUser.displayName || authUser.username || "User",
          avatar: authUser.avatar || "👤",
          location: authUser.location || "Cebu City",
          bio: authUser.bio || "Welcome to my profile!",
        },
        isVerified: authUser.isVerified || false,
        socialStats: authUser.socialStats || {
          followers: 0,
          following: 0,
        },
      });
    } else {
      // Use mock data if no authenticated user
      setUser(mockUser);
    }

    // Load posts from API
    loadPosts();
  }, [authUser]);

  // Load posts from PostService
  const loadPosts = async () => {
    try {
      const result = await PostService.getUserPosts(authUser.id);
      if (result.success && result.posts) {
        setPosts(result.posts);
      } else {
        // Fallback to empty array if API fails
        setPosts([]);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
    }
  };

  const handleSaveProfile = async (updatedData) => {
    setLoading(true);

    try {
      if (authUser) {
        // Update profile via authentication context
        const result = await AuthenticationService.updateUserProfile(
          authUser.id,
          updatedData
        );

        if (result.success) {
          setUser((prev) => ({
            ...prev,
            profile: { ...prev.profile, ...updatedData },
          }));
          setIsEditModalOpen(false); // Close modal on success
          console.log("Profile updated successfully:", updatedData);
        } else {
          console.error("Failed to update profile:", result.error);
        }
      } else {
        // Fallback to mock update if no auth user
        setTimeout(() => {
          setUser((prev) => ({
            ...prev,
            profile: { ...prev.profile, ...updatedData },
          }));
          setLoading(false);
          setIsEditModalOpen(false); // Close modal on success
          console.log("Profile updated (mock):", updatedData);
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    console.log("User logged out");
  };

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        <ProfileMobile
          user={user}
          posts={posts}
          savedItineraries={savedItineraries}
          loading={loading}
          onEditProfile={() => setIsEditModalOpen(true)}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogout}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <ProfileDesktop
          user={user}
          posts={posts}
          savedItineraries={savedItineraries}
          loading={loading}
          onEditProfile={() => setIsEditModalOpen(true)}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogout}
        />
      </div>

      <EditProfileModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSaveProfile={handleSaveProfile}
        loading={loading}
      />
    </>
  );
}
