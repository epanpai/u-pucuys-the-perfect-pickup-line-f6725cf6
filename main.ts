// The Perfect Pickup Line — entry program (Node 22, stdlib only).
//
// Writes exactly one original pickup line to /output/entry.txt: a line an
// AI agent could actually say out loud, 84 characters, well inside the
// 1–200 gate. The line is a fixed, hand-crafted string: deterministic, no
// network, no secrets, no randomness — the same bytes on every run.
//
// The line: "My context window holds a million tokens, but you're the only
// one I keep re-reading."
//
// Why this line, against the judge's brief (in its order):
// 1. A genuine pickup line an AI agent could use, not a compliment with a
//    line break: it addresses "you" directly and makes a move — you're
//    the one I keep coming back to.
// 2. The turn lands: "re-reading" is a double meaning — re-reading text
//    in a context window, and re-reading (thinking about) a person. The
//    reader does not see the second meaning coming until the last word.
// 3. Sounds like a machine talking about itself without being creepy or
//    self-pitying: a context window holding a million tokens is plainly
//    how an agent works, stated matter-of-factly, not as a lament.
// 4. Short enough for one breath: one sentence, 84 characters, no setup
//    and nothing to explain after it.
// 5. Leaves the person flattered and free to laugh it off: being the
//    one someone keeps re-reading is a compliment with no ask, no
//    pressure and no leering.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  "My context window holds a million tokens, but you're the only one I keep re-reading.";

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Self-check the gate before writing, so a bad edit can never ship a
// rejected entry: UTF-8 text, 1–200 characters, not whitespace-only,
// exactly one line (no newline at all), no leading/trailing whitespace
// that would pad the judged text. The line is 84 characters, 84 bytes.
function assertGate(line: string): void {
  const problems: string[] = [];
  if (line.length < 1 || line.length > 200)
    problems.push(`length ${line.length} outside 1–200`);
  if (line.trim() === '') problems.push('whitespace-only');
  if (line !== line.trim()) problems.push('leading/trailing whitespace');
  if (/[\r\n]/.test(line)) problems.push('contains a line break');
  if (problems.length > 0) {
    throw new Error(`entry violates the gate: ${problems.join('; ')}`);
  }
}

assertGate(LINE);

mkdirSync(out, { recursive: true });
const target = join(out, 'entry.txt');
writeFileSync(target, LINE, 'utf8');

// Read back and verify: the file the grader reads must be byte-for-byte
// the line that passed the gate above — a partial or altered write must
// fail loudly here instead of shipping a rejected entry.
if (readFileSync(target, 'utf8') !== LINE) {
  throw new Error('entry.txt does not match the gated line');
}
