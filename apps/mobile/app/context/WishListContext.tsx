import React, {createContext, useContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Pokemon} from "../../../shared/types/pokemon";

interface WishlistContextType {
  wishlistItems: Pokemon[];
  addToWishlist: (pokemon: Pokemon) => void;
  removeFromWishlist: (pokemonId: number) => void;
  isInWishlist: (pokemonId: number) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const WISHLIST_STORAGE_KEY = "pokemon-wishlist";

export function WishlistProvider({children}: {children: React.ReactNode}) {
  const [wishlistItems, setWishlistItems] = useState<Pokemon[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // load wishlist from AsyncStorage
  useEffect(() => {
    async function loadWishlist() {
      try {
        const storedWishlist = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          const parsed = JSON.parse(storedWishlist);
          setWishlistItems(parsed);
        }
      } catch (error) {
        console.error("Failed to load wishlist from AsyncStorage:", error);
      } finally {
        setIsInitialized(true);
      }
    }
    loadWishlist();
  }, []);

  // save wishlist to AsyncStorage whenever it changes
  useEffect(() => {
    async function saveWishlist() {
      if (isInitialized) {
        try {
          await AsyncStorage.setItem(
            WISHLIST_STORAGE_KEY,
            JSON.stringify(wishlistItems)
          );
        } catch (error) {
          console.error("Failed to save wishlist to AsyncStorage:", error);
        }
      }
    }
    saveWishlist();
  }, [wishlistItems, isInitialized]);

  function addToWishlist(pokemon: Pokemon) {
    setWishlistItems((prev) => {
      // check if already in wishlist
      if (prev.some((item) => item.id === pokemon.id)) {
        return prev;
      }
      return [...prev, pokemon];
    });
  }

  function removeFromWishlist(pokemonId: number) {
    setWishlistItems((prev) => prev.filter((item) => item.id !== pokemonId));
  }

  function isInWishlist(pokemonId: number): boolean {
    return wishlistItems.some((item) => item.id === pokemonId);
  }

  function clearWishlist() {
    setWishlistItems([]);
  }

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
