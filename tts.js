export default async function handler(req, res) {
  try {
    const { text } = await req.json();
    const response = await fetch("https://api.zalo.ai/v1/tts/synthesize", {
      method: "POST",
      headers: {
        "apikey": process.env.ZALO_TTS_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        input: text,
        speed: "0.9",
        encode_type: "mp3"
      })
    });
    const data = await response.json();
    res.status(200).json({ audioUrl: data.data.url });
  } catch (error) {
    res.status(500).json({ error: "TTS thất bại", details: error.message });
  }
}
