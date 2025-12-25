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
      const email = firebaseUser.email.toLowerCase();
      
      // ১. প্রথমে GET রিকোয়েস্ট পাঠিয়ে ডাটাবেস থেকে ইউজারের রোল চেক করা
      // এটিই আপনার ডাটাবেস থেকে 'admin' রোলটি ব্রাউজারে নিয়ে আসবে
      const getRes = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      
      if (getRes.ok) {
        const dbUser = await getRes.json();
        setUser({ ...firebaseUser, role: dbUser.role });
      } else {
        // ২. যদি ইউজার না থাকে (যেমন প্রথমবার সাইন-ইন), তবে POST দিয়ে সেভ করা
        const postRes = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            name: firebaseUser.displayName || "User",
          }),
        });
        
        if (!postRes.ok) throw new Error("Sync failed");
        
        const dbUser = await postRes.json();
        setUser({ ...firebaseUser, role: dbUser.role });
      }
    } catch (error) {
      console.error("DB Sync Error:", error);
      // এরর হলে ডিফল্ট ভাবে Firebase ইউজার সেট করা (রোল ছাড়া)
      setUser(firebaseUser); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserWithDB(firebaseUser);
      } else {
        setUser(null);
        setLoading(false);
      }
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