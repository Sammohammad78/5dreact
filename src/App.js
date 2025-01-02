import React, { useEffect, useRef, useState } from "react";

function App() {
  const viewerRef = useRef(null); // Reference to the Sketchfab viewer container
  const [dimensions, setDimensions] = useState({ width: 200, height: 100, depth: 200 }); // Default dimensions (mm)
  const [color, setColor] = useState("#000000"); // Default color (black)

  const modelUrl = "https://sketchfab.com/models/5f94fb035fa74f43abda3ada8f0a719e/embed"; // Sketchfab model embed URL
  const modelID = "5f94fb035fa74f43abda3ada8f0a719e"; // Sketchfab model ID

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.sketchfab.com/release/webgl-api.js"; // Sketchfab API script URL
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!viewerRef.current) return;

      // Initialize Sketchfab client
      const client = new window.Sketchfab("1.10.0", viewerRef.current); 

      client.init(modelID, {
        success: function (api) {
          api.setQuality("high"); // Set quality to high
          api.start(); // Start the model viewer

          // Adjust model scale based on input dimensions
          api.addEventListener("viewerready", function () {
            api.setScale(dimensions.width / 1000, dimensions.height / 1000, dimensions.depth / 1000);
          });

          // Adjust color of the material on the model
          api.addEventListener("viewerready", function () {
            api.getMaterial("table_surface", function(material) {
              material.diffuseColor = new window.THREE.Color(color); // Change color in real-time
              api.setMaterial(material);
            });
          });
        },
        error: function () {
          console.error("Error loading the Sketchfab model");
        }
      });
    };

    return () => {
      document.body.removeChild(script); // Clean up script when component unmounts
    };
  }, [color, dimensions]); // Re-run when color or dimensions change

  return (
    <div style={styles.container}>
      {/* Left side for options */}
      <div style={styles.optionsPanel}>
        <h1>Customize Your 3D Table</h1>
        <p>Adjust the dimensions and color of your custom table below:</p>

        {/* Input controls for dimensions */}
        <div style={styles.inputGroup}>
          <label>Width (mm):</label>
          <input
            type="number"
            value={dimensions.width}
            onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) })}
            min={200}
            max={500}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Height (mm):</label>
          <input
            type="number"
            value={dimensions.height}
            onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) })}
            min={100}
            max={200}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Depth (mm):</label>
          <input
            type="number"
            value={dimensions.depth}
            onChange={(e) => setDimensions({ ...dimensions, depth: parseFloat(e.target.value) })}
            min={200}
            max={500}
            style={styles.input}
          />
        </div>

        {/* Color picker */}
        <div style={styles.inputGroup}>
          <label>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Display Price */}
        <div style={styles.price}>
          <strong>Price: </strong> £{((dimensions.width * dimensions.height * dimensions.depth) / 10000).toFixed(2)}
        </div>
      </div>

      {/* Right side for Sketchfab 3D Model Viewer */}
      <div ref={viewerRef} style={styles.viewerContainer}>
        <div className="sketchfab-embed-wrapper" style={styles.embedWrapper}>
          <iframe
            title="3D Table"
            frameBorder="0"
            allowFullScreen
            mozAllowFullScreen="true"
            webkitAllowFullScreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src={modelUrl}
            style={styles.iframe}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "20px",
  },
  optionsPanel: {
    width: "30%",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    marginLeft: "10px",
    padding: "5px",
    width: "60%",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "20px",
  },
  viewerContainer: {
    width: "65%",
    height: "100%",
    backgroundColor: "transparent",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  embedWrapper: {
    height: "100%",
  },
  iframe: {
    width: "100%",
    height: "100%",
  },
};

export default App;
