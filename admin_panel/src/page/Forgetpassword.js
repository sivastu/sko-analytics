import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDatabase, ref, get, query, orderByChild, equalTo, set } from "firebase/database";
import app from "./firebase";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material"; // For the loader
import * as CryptoJS from "crypto-js"; // For decryption
import { FaArrowLeft } from "react-icons/fa6";
import SweetAlert2 from "react-sweetalert2";

let Forgetpassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To show loader while validating token
  const [userEmail, setUserEmail] = useState(""); // To store the decrypted email
  const navigate = useNavigate();
  const location = useLocation();
  const [swalProps, setSwalProps] = useState({ show: false });

  // Extract the encrypted email from the URL
  const encryptedData = new URLSearchParams(location.search).get("token");

  // Decrypt the data
  const decrypt = (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(cipherText), 'secretKey');
      const plainText = bytes.toString(CryptoJS.enc.Utf8);
      if (!plainText) {
        throw new Error("Decryption failed or resulted in an empty string.");
      }
      return JSON.parse(plainText); // Parse the decrypted data
    } catch (error) {
      console.error("Decryption error:", error);
      toast.error("Invalid or corrupted token.");
      return ;
    }
  };

  // Validate the decrypted email
  useEffect(() => {
    const validateToken = async () => {
      if (!encryptedData) {
        console.error("Encrypted data is missing from the URL.");
        setIsTokenValid(false);
        setIsLoading(false);
        toast.error("Invalid or missing token.");
        navigate("/");
        return;
      }

      try {
        // Decrypt the data
        const decryptedData = decrypt(encryptedData);
        if (!decryptedData) {
          setIsTokenValid(false);
          setIsLoading(false);
          toast.error("Invalid or expired token.");
          navigate("/");
          return;
        }

        const { email, timestamp } = decryptedData;
        console.log("Decrypted email:", email);
        console.log("Decrypted timestamp:", timestamp);

        // Check if the token is expired (5 minutes)
        const currentTime = Date.now();
        const timeDifference = currentTime - timestamp;
        const expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (timeDifference > expirationTime) {
          console.error("Token has expired.");
          toast.error("Token has expired. Please request a new reset link.");
          setIsTokenValid(false);
          setIsLoading(false);
          return;
        }

        // Check if the email exists in the database
        const db = getDatabase(app);
        const userRef = ref(db, "user");
        const emailQuery = query(userRef, orderByChild("Email"), equalTo(email));
        const snapshot = await get(emailQuery);

        if (snapshot.exists()) {
          console.log("User found in the database:", snapshot.val());
          setIsTokenValid(true);
          setUserEmail(email);
        } else {
          console.error("User not found in the database for email:", email);
          toast.error("User not found. Please check your email.");
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        toast.error("An error occurred while validating the token.");
        setIsTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };


    validateToken();
  }, [encryptedData, navigate]);

  // Handle password reset
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setSwalProps({
        show: true,
        title: 'Passwords do not match',
        text: 'Please ensure both passwords are the same.',
        icon: 'error',
        didClose: () => {
          setSwalProps({ show: false }); // Close the SweetAlert2 modal
        }
      });
      return;
    }
    if (!newPassword || !confirmPassword) {
      setSwalProps({
        show: true,
        title: 'Empty Fields',
        text: 'Please enter both new password and confirm password.',
        icon: 'error',
        didClose: () => {
          setSwalProps({ show: false }); // Close the SweetAlert2 modal
        }
      });
      return;
    }
  
    try {
      const db = getDatabase(app);
      const userRef = ref(db, "user");
      const emailQuery = query(userRef, orderByChild("Email"), equalTo(userEmail));
      const snapshot = await get(emailQuery);
    
      if (snapshot.exists()) {
        snapshot.forEach((userSnapshot) => {
          const userKey = userSnapshot.key;
          const userData = userSnapshot.val();
    
          // Update only the Password field while preserving the rest of the user data
          const updatedData = {
            ...userData, // Preserve existing data
            Password: newPassword, // Update the password
          };
    
          const userRef = ref(db, `user/${userKey}`);
          set(userRef, updatedData)
            .then(() => {
              setSwalProps({
                show: true,
                title: 'Password Reset Successful',
                text: 'Your password has been reset successfully.',
                icon: 'success',
                didClose: () => {
                  setSwalProps({ show: false });
                  navigate("/");
                }
              });
            })
            .catch((error) => {
              setSwalProps({
                show: true,
                title: 'Error',
                text: 'An error occurred while updating the password.',
                icon: 'error',
                didClose: () => {
                  setSwalProps({ show: false });
                }
              });
            });
        });
      } else {
        setSwalProps({
          show: true,
          title: 'User Not Found',
          text: 'The user associated with this email does not exist.',
          icon: 'error',
          didClose: () => {
            setSwalProps({ show: false });
          }
        });
      }
    } catch (error) {
      setSwalProps({
        show: true,
        title: 'Error',
        text: 'An error occurred while resetting the password.',
        icon: 'error',
        didClose: () => {
          setSwalProps({ show: false });
        }
      });
    }
  };

  // Show loader while validating token
  if (isLoading) {
    return (
      <section style={{ backgroundColor: "#313233" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress /> {/* Show loader while validating token */}
        </div>
      </section>
    );
  }

  // Show error if token is invalid
  if (!isTokenValid) {
    return (
      <section style={{ backgroundColor: "#313233" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "white" }}>
          <p>Invalid or expired token. Please request a new reset link.</p>
        </div>
      </section>
    );
  }

  // Show the password reset form if the token is valid
  return (
    <div>
          <div style={{ backgroundColor: "#313233", height: '100vh' }} >

<div className="dddd" style={{ backgroundImage: "url('backs.jpg')", height: '95vh', padding: 0 }} >
  <div style={{
    backgroundImage: "url('finefine.png')", height: '100%', backgroundSize: "230vh",
    backgroundPosition: "center", backgroundRepeat: "no-repeat",
    alignItems: "center", justifyContent: "center", display: 'flex', backgroundColor: "#313233"
  }} >
            <div style={{ width: 680, height: 320, backgroundColor: "#F3F3F3", borderRadius: 7,padding:20 }}>
              <div className="kjok" style={{ marginTop: "5%" }}>
                <div className="row">
                  <div className="col-5">
                    <p style={{ color: "#1A1A1B", fontSize: 19, fontWeight: "500", textAlign: "center", marginTop: 4 }}>New Password:</p>
                  </div>
                  <div className="col-7">
                    <input
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070",    paddingLeft : 11 }}
                      type="password"
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-5">
                    <p style={{ color: "#1A1A1B", fontSize: 19, fontWeight: "500", textAlign: "center", marginTop: 4 }}>Confirm Password:</p>
                  </div>
                  <div className="col-7">
                    <input
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070",    paddingLeft : 11 }}
                      type="password"
                    />
                  </div>
                </div>

                <p onClick={() => {
     navigate('/admin')
}} style={{
  color: "#707070", fontSize: 15, fontWeight: '500', textAlign: 'right', marginRight: 80, marginTop: 10,
  cursor: "pointer"
}} ><FaArrowLeft /> Back to Login </p>

              <div className="d-flex justify-content-center ">
              <button
                  onClick={handleResetPassword}
                  style={{
                    backgroundColor: "#316AAF",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: 5,
                    border: "none",
                    cursor: "pointer",
                    marginTop: 20,
                  }}
                >
                  Reset Password
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SweetAlert2 {...swalProps} />
    </div>
  );
};

export default Forgetpassword;