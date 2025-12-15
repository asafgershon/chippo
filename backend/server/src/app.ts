import express from "express";

const app = express();

// POST /cart/build
app.post("/cart/build", express.json(), (req, res) => {
  const { items } = req.body;

  const payload = {
    store: "82",
    isClub: 0,
    supplyAt: new Date().toISOString(),
    items,
    meta: null,
  };

  res.json(payload);
});

// health check מינימלי
app.get("/", (_req, res) => {
  res.send("Chippo backend is running");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
