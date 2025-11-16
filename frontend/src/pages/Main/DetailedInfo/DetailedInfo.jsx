import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DetailedInfoMobile from "../../Mobile/DetailedInfoMobile";
import DetailedInfoDesktop from "../../Desktop/DetailedInfoDesktop";
import { CebuSpotsService } from "../../../services/cebuSpotService";

export default function DetailedInfo() {
  const [spotData, setSpotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the id from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();

  const loadSpotData = async (spotId) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading spot data for ID:", spotId);
      const spot = await CebuSpotsService.getSpotByIdFromAPI(spotId);

      if (spot) {
        setSpotData(spot);
      } else {
        setError("Spot not found");
      }
    } catch (err) {
      console.error("Error loading spot data:", err);
      setError("Failed to load spot information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadSpotData(id);
    } else {
      setError("No spot ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleSaveFavorite = async (isFavorite) => {
    try {
      console.log("Toggle favorite:", id, isFavorite);
      // await CebuSpotsService.toggleFavorite(id, isFavorite);
    } catch (err) {
      console.error("Error saving favorite:", err);
    }
  };

  const handleGetDirections = () => {
    if (spotData?.latitude && spotData?.longitude) {
      // Navigate to map with destination coordinates
      console.log("Get directions to:", spotData.name);
      navigate(`/map?destination=${spotData._id}&lat=${spotData.latitude}&lon=${spotData.longitude}&name=${spotData.name}`);
    }
  };

  const handlePlanVisit = () => {
    console.log("Plan visit to:", spotData?.name);
  };

  const handleShareLocation = () => {
    console.log("Share location:", spotData?.name);
  };

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        <DetailedInfoMobile
          spotData={spotData}
          loading={loading}
          error={error}
          onRetry={() => loadSpotData(id)}
          onToggleFavorite={handleSaveFavorite}
          onGetDirections={handleGetDirections}
          onPlanVisit={handlePlanVisit}
          onShareLocation={handleShareLocation}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DetailedInfoDesktop
          spotData={spotData}
          loading={loading}
          error={error}
          onRetry={() => loadSpotData(id)}
          onToggleFavorite={handleSaveFavorite}
          onGetDirections={handleGetDirections}
          onPlanVisit={handlePlanVisit}
          onShareLocation={handleShareLocation}
        />
      </div>
    </>
  );
}
