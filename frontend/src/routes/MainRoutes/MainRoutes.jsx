import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import HomePage from "../../pages/Main/HomePage/HomePage";
import AIChatbot from "../../pages/Main/AIChatBot/AIChatbot";
import Discover from "../../pages/Main/Discover/Discover";
import Profile from "../../pages/Main/Profile/Profile";
import SocialFeed from "../../pages/Main/SocialFeed/SocialFeed";
import TravelHub from "../../pages/Main/TraveHub/TravelHub";
import Map from "../../pages/Main/Map/Map";
import DetailedInfo from "../../pages/Main/DetailedInfo/DetailedInfo";
import CreatePost from "../../pages/Main/SocialFeed/CreatePost";
import TravelHubDetails from "../../pages/Main/TraveHub/TravelHubDetails";
import UserProfileView from "../../pages/Main/Profile/UserProfilePreview";

const MainRoutes = () => {
  return (
    <Routes>
      <Route
        path="/main/home"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/main/discover"
        element={
          <MainLayout>
            <Discover />
          </MainLayout>
        }
      />
      <Route
        path="/main/detailed-info/:id"
        element={
          <MainLayout>
            <DetailedInfo />
          </MainLayout>
        }
      />
      <Route
        path="/main/ai-chatbot"
        element={
          <MainLayout>
            <AIChatbot />
          </MainLayout>
        }
      />
      <Route
        path="/main/profile"
        element={
          <MainLayout>
            <Profile />
          </MainLayout>
        }
      />
      <Route
        path="/main/profile/:userId"
        element={
          <MainLayout>
            <UserProfileView />
          </MainLayout>
        }
      />
      <Route
        path="/main/social-feed"
        element={
          <MainLayout>
            <SocialFeed />
          </MainLayout>
        }
      />
      <Route
        path="/main/travel-hub"
        element={
          <MainLayout>
            <TravelHub />
          </MainLayout>
        }
      />
      <Route
        path="/main/travelhub-details/:tripId"
        element={
          <MainLayout>
            <TravelHubDetails />
          </MainLayout>
        }
      />
      <Route
        path="/main/map"
        element={
          <MainLayout>
            <Map />
          </MainLayout>
        }
      />
      <Route
        path="/main/create-post"
        element={
          <MainLayout>
            <CreatePost />
          </MainLayout>
        }
      />
      <Route path="*" element={<Navigate to="/main/home" />} />
    </Routes>
  );
};

export default MainRoutes;
