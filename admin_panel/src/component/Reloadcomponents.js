import React, { useEffect } from "react";

const ReloadComponent = () => {
  useEffect(() => {
    console.log("Component reloaded!");
    alert("Page has been reloaded!");
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Page Reloaded</h2>
      <p>This component runs when the page reloads.</p>
    </div>
  );
};

export default ReloadComponent;
