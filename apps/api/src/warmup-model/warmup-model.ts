import ollama from "ollama";

export async function warmup() {
  await ollama.chat({
    model: "mistral",
    messages: [{ role: "user", content: "warmup" }]
  });
}
