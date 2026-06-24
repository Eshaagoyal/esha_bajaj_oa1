const express = require("express");
const cors = require("cors");
const bfhlRoute = require("./routes/bfhlRoute");

const app = express();

// Allow requests from any origin (evaluator calls from a different domain)
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());

// Mount the /bfhl route
app.use("/bfhl", bfhlRoute);

// Simple health check route (useful to confirm the server is alive)
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "BFHL API is running" });
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});