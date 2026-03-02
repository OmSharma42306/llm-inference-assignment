import { ollama } from "../ollamaConfig.js"

export async function warmup() {
  await ollama.chat({
    model: "mistral",
    messages: [{ role: "user", content: "warmup" }]
  });
}
