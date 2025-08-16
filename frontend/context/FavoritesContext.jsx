// context/FavoritesContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced load function with error boundary
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        const cleaned = parsed.filter(
          fav => fav?.service?.name && fav?.name && fav?.price
        );
        if (cleaned.length !== parsed.length) {
          console.warn(`Cleaned ${parsed.length - cleaned.length} invalid favorites`);
        }
        setFavorites(cleaned);
      }
    } catch (error) {
      console.error("Favorites load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (isLoading) return;
    
    const save = async () => {
      try {
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
        console.log(`Saved ${favorites.length} favorites`);
      } catch (error) {
        console.error("Favorites save error:", error);
      }
    };
    
    const timer = setTimeout(save, 500);
    return () => clearTimeout(timer);
  }, [favorites, isLoading]);

  // Unified item identification
  const getItemKey = (service, style) => {
    if (!service?.name || !style?.name) {
      console.warn("Attempting to get key for invalid item:", { service, style });
      return null;
    }
    return `${service.name}|${style.name}`.toLowerCase();
  };

  // Robust toggle function
  const toggleFavorite = (service, style) => {
    console.group("Favorite Toggle");
    try {
      const key = getItemKey(service, style);
      if (!key) return;

      console.log("Current favorites:", favorites);
      console.log("Toggling item:", { 
        service: service.name,
        style: style.name,
        key 
      });

      setFavorites(prev => {
        const exists = prev.some(item => 
          getItemKey(item.service, item) === key
        );

        if (exists) {
          console.log("Removing existing favorite");
          return prev.filter(item => 
            getItemKey(item.service, item) !== key
          );
        } else {
          console.log("Adding new favorite");
          return [...prev, { 
            ...style, 
            service,
            timestamp: new Date().toISOString() 
          }];
        }
      });
    } catch (error) {
      console.error("Toggle error:", error);
    } finally {
      console.groupEnd();
    }
  };

  // Optimized check
  const isFavorite = (serviceName, styleName) => {
    if (!serviceName || !styleName) {
      console.warn("Invalid check:", { serviceName, styleName });
      return false;
    }

    const key = `${serviceName}|${styleName}`.toLowerCase();
    return favorites.some(item => 
      getItemKey(item.service, item) === key
    );
  };

  // Context value
  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoading,
    refreshFavorites: loadFavorites,
    count: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
