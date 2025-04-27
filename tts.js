export default async function handler(req, res) {
  const text = req.query.text;
  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const response = await fetch("https://api.zalo.ai/v1/tts/synthesize", {
      method: "POST",
      headers: {
        "apikey": process.env.ZALO_TTS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: text })
    });

    const result = await response.json();
    if (result.data && result.data.url) {
      const audioRes = await fetch(result.data.url);
      const audioBuffer = await audioRes.arrayBuffer();
      res.setHeader("Content-Type", "audio/mpeg");
      res.send(Buffer.from(audioBuffer));
    } else {
      res.status(500).json({ error: "Failed to generate audio" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
