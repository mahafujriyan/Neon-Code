"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ডাটাবেসের সাথে ইউজার সিঙ্ক করার ফাংশন
  const syncUserWithDB = async (firebaseUser) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName || "User",
        }),
      });
      const dbUser = await res.json();
      
      // Firebase ইউজারের সাথে ডাটাবেসের রোল (Role) মিলিয়ে দেওয়া
      setUser({ ...firebaseUser, role: dbUser.role });
    } catch (error) {
      console.error("DB Sync Error:", error);
      setUser(firebaseUser); // এরর হলেও ফায়ারবেস ইউজার সেট থাকবে
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ইউজার থাকলে ডাটাবেসে সেভ/আপডেট করবে
        await syncUserWithDB(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);