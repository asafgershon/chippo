import express from "express";

const app = express();

// health check מינימלי
app.get("/", (_req, res) => {
  res.send("Chippo backend is running");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
