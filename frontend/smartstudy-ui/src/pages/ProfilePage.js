import {

  useEffect,
  useState

} from "react";

import {

  useNavigate

} from "react-router-dom";

import api from "../api/axiosConfig";

import {

  toast,
  ToastContainer

} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function ProfilePage() {

  // =========================
  // NAVIGATION
  // =========================

  const navigate =
    useNavigate();

  // =========================
  // STATES
  // =========================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [photo, setPhoto] =
    useState("");

  // =========================
  // TOKEN
  // =========================

  const getToken = () =>
    localStorage.getItem(
      "token"
    );

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {

    fetchProfile();
// eslint-disable-next-line
  }, []);

  const fetchProfile =
    async () => {

      try {

        const res =
          await api.get(

            "/auth/profile",

            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`
              }
            }

          );

        setName(
          res.data.name
        );

        setEmail(
          res.data.email
        );

        setBio(
          res.data.bio || ""
        );

      } catch (e) {

        console.log(e);

        toast.error(
          "Failed to load profile"
        );

      }

    };

  // =========================
  // HANDLE PHOTO
  // =========================

  const handlePhoto =
    (e) => {

      const file =
        e.target.files[0];

      if (file) {

        const reader =
          new FileReader();

        reader.onloadend =
          () => {

            setPhoto(
              reader.result
            );

          };

        reader.readAsDataURL(
          file
        );

      }

    };

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile =
    async () => {

      try {

        await api.put(

          "/auth/profile",

          {
            name,
            bio
          },

          {
            headers: {
              Authorization:
                `Bearer ${getToken()}`
            }
          }

        );

        toast.success(
          "Profile updated"
        );

      } catch (e) {

        console.log(e);

        toast.error(
          "Profile update failed"
        );

      }

    };

  // =========================
  // UI
  // =========================

  return (

    <div style={container}>

      <div style={card}>

        <button
          style={closeBtn}
          onClick={() =>
            navigate("/dashboard")
          }
        >

          ✖

        </button>

        {/* PROFILE IMAGE */}

        <div style={profileSection}>

          <img
            src={
              photo ||

              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }

            alt="profile"

            style={profileImage}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
          />

        </div>

        {/* PROFILE INFO */}

        <div style={infoSection}>

          <h1>
            My Profile
          </h1>

          <label>
            Name
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            style={input}
          />

          <label>
            Email
          </label>

          <input
            value={email}
            disabled
            style={input}
          />

          <label>
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) =>
              setBio(
                e.target.value
              )
            }
            style={textarea}
          />

          <button
            style={saveBtn}
            onClick={saveProfile}
          >

            Save Changes

          </button>

        </div>

      </div>

      <ToastContainer
        position="top-right"
      />

    </div>

  );

}

// =========================
// STYLES
// =========================

const container = {

  padding: "30px"

};

const card = {

  background: "white",

  borderRadius: "20px",

  padding: "30px",

  position: "relative",

  display: "flex",

  gap: "40px",

  flexWrap: "wrap",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)"

};

const profileSection = {

  display: "flex",

  flexDirection: "column",

  alignItems: "center",

  gap: "15px"

};

const profileImage = {

  width: "140px",

  height: "140px",

  borderRadius: "50%",

  objectFit: "cover",

  border:
    "4px solid #7c3aed"

};

const infoSection = {

  flex: 1,

  display: "flex",

  flexDirection: "column",

  gap: "12px"

};

const input = {

  padding: "12px",

  borderRadius: "10px",

  border:
    "1px solid #cbd5e1"

};

const textarea = {

  padding: "12px",

  borderRadius: "10px",

  border:
    "1px solid #cbd5e1",

  minHeight: "120px"

};

const saveBtn = {

  marginTop: "15px",

  background:
    "linear-gradient(135deg,#4f46e5,#7c3aed)",

  color: "white",

  border: "none",

  padding: "14px",

  borderRadius: "12px",

  cursor: "pointer",

  fontWeight: "bold"

};

const closeBtn = {

  position: "absolute",

  top: "20px",

  right: "20px",

  background: "#ef4444",

  color: "white",

  border: "none",

  width: "38px",

  height: "38px",

  borderRadius: "50%",

  cursor: "pointer",

  fontSize: "18px",

  fontWeight: "bold"

};

export default ProfilePage;