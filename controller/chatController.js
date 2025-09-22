const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

console.log("apikey =>", process.env.OPENROUTER_API_KEY);

const handleChat = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || typeof query !== "string") {
            return res.status(400).json({ error: "Invalid query" });
        }

        // Custom prompt template
        const promptTemplate = `
You are an expert ICD-10 medical coding assistant.
Provide the most accurate ICD-10 code(s) for the medical term provided by the user.
If necessary, explain briefly why that code is applicable.
Respond concisely in the following format:
Code: <ICD-10 code>
Description: <Brief description>

Medical term: "${query}"
`;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an ICD-10 medical coding assistant." },
                { role: "user", content: promptTemplate },
            ],
            max_tokens: 400,
        });

        const message = response.choices?.[0]?.message?.content || "No response";
        res.json({ success: true, message });
    } catch (err) {
        console.error("OpenRouter error:", err);
        res.status(500).json({ error: err.message || "Failed to get response from OpenRouter" });
    }
};

module.exports = { handleChat };
