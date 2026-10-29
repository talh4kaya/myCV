// Modelin çıktısı şu biçimde gelir (bkz. chatPrompt.ts > CEVAP FORMATI):
//
//   > Staj bilgilerine bakılıyor
//   > ~ Yarışma projesi mi? Hayır
//   ---
//   Asıl cevap...
//
// Bu sınıf stream'den gelen parçaları biriktirip "step" ve "text" olaylarına
// çevirir. Model formata uymazsa (ilk satır ">" ile başlamıyorsa) her şey
// doğrudan cevap olarak geçer — kullanıcı hiçbir durumda boş ekran görmez.

export type ChatEvent =
  | { t: "step"; text: string; out: boolean }
  | { t: "text"; v: string };

const MAX_STEPS = 6;
const MAX_STEP_LINE = 200;

export class ThinkingParser {
  private phase: "steps" | "answer" = "steps";
  private buffer = "";
  private steps = 0;

  push(chunk: string): ChatEvent[] {
    if (this.phase === "answer") return chunk ? [{ t: "text", v: chunk }] : [];

    this.buffer += chunk;
    const events: ChatEvent[] = [];

    let newline: number;
    while (this.phase === "steps" && (newline = this.buffer.indexOf("\n")) !== -1) {
      const line = this.buffer.slice(0, newline).trim();
      this.buffer = this.buffer.slice(newline + 1);
      if (!line) continue;

      if (line === "---") {
        this.toAnswer(events);
        break;
      }

      if (line.startsWith(">") && this.steps < MAX_STEPS) {
        const body = line.replace(/^>\s*/, "");
        const out = body.startsWith("~");
        const text = body.replace(/^~\s*/, "").trim().replace(/\.+$/, "");
        if (text) {
          events.push({ t: "step", text: text.slice(0, MAX_STEP_LINE), out });
          this.steps += 1;
        }
        continue;
      }

      // Formata uymayan satır: bundan sonrası cevaptır
      this.buffer = `${line}\n${this.buffer}`;
      this.toAnswer(events);
    }

    // Henüz satır sonu gelmese de ">" veya "---" ile başlamayan metin format
    // dışı bir cevaptır; sonuna kadar beklemeden hemen akıt
    const head = this.buffer.trimStart();
    if (this.phase === "steps" && head && !head.startsWith(">") && !"---".startsWith(head.slice(0, 3))) {
      this.toAnswer(events);
    }

    return events;
  }

  // Stream bittiğinde elde kalan metni boşalt
  flush(): ChatEvent[] {
    const rest = this.buffer.trim();
    this.buffer = "";
    if (!rest) return [];
    if (this.phase === "steps" && rest.startsWith(">") && !rest.includes("\n")) {
      // Sadece adım yazıp cevap vermeden bittiyse son satırı da adım say
      return this.push(`${rest}\n`);
    }
    return [{ t: "text", v: rest }];
  }

  private toAnswer(events: ChatEvent[]) {
    this.phase = "answer";
    const rest = this.buffer.replace(/^\s+/, "");
    this.buffer = "";
    if (rest) events.push({ t: "text", v: rest });
  }
}
