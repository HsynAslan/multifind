import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login"; // Eğer token yoksa giriş sayfasına yönlendir
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Created At: {user.created_at}</p>
    </div>
  );
};

export default ProfilePage;
