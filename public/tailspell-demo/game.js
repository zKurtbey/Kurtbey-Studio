/* Tailspell: Word Chain — browser demo.
   Relaxed mode only, Dawn world, Blobby companion, plus two fixed minigames (Challenge, Secret Word).
   Rules are ported from the iOS app (GameEngine, LengthDirector, DailyWordGame). */
"use strict";

// ───────────────────────── Storage (never required) ─────────────────────────
const store = {
  get(k, d) { try { const v = localStorage.getItem("ts." + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("ts." + k, JSON.stringify(v)); } catch {} },
};

// ───────────────────────── Languages ─────────────────────────
const LANGS = {
  en: { letters: "abcdefghijklmnopqrstuvwxyz", rows: ["qwertyuiop", "asdfghjkl", "zxcvbnm"], name: "English", locale: "en-US", title: ["WORD", "CHAIN"] },
  tr: { letters: "abcçdefgğhıijklmnoöprsştuüvyz", rows: ["ertyuıopğü", "asdfghjklşi", "zcvbnmöç"], name: "Türkçe", locale: "tr-TR", title: ["KELİME", "TÜRET"] },
  it: { letters: "abcdefghijklmnopqrstuvwxyz", rows: ["qwertyuiop", "asdfghjkl", "zxcvbnm"], name: "Italiano", locale: "it-IT", title: ["PAROLE", "A CATENA"] },
  de: { letters: "abcdefghijklmnopqrstuvwxyzäöü", rows: ["qwertzuiopü", "asdfghjklöä", "yxcvbnm"], name: "Deutsch", locale: "de-DE", title: ["WORT", "KETTE"] },
  fr: { letters: "abcdefghijklmnopqrstuvwxyz", rows: ["azertyuiop", "qsdfghjklm", "wxcvbn"], name: "Français", locale: "fr-FR", title: ["MOTS", "CHAÎNE"] },
  es: { letters: "abcdefghijklmnopqrstuvwxyzñ", rows: ["qwertyuiop", "asdfghjklñ", "zxcvbnm"], name: "Español", locale: "es-ES", title: ["PALABRA", "CADENA"] },
};
const LANG_ORDER = ["en", "tr", "it", "de", "fr", "es"];
// The Secret Word of each language never changes in the demo.
const SECRET = { tr: "kalem", en: "maker", it: "anima", de: "apfel", fr: "cadre", es: "arena" };

function pickLanguage() {
  const saved = store.get("lang", null);
  if (saved && LANGS[saved]) return saved;
  for (const code of (navigator.languages || [navigator.language || "en"])) {
    const c = String(code).slice(0, 2).toLowerCase();
    if (LANGS[c]) return c;
  }
  return "en";
}

const T = {
  play: ["PLAY", "OYNA", "GIOCA", "SPIELEN", "JOUER", "JUGAR"],
  challenge: ["Challenge", "Meydan Okuma", "Sfida", "Herausforderung", "Défi", "Desafío"],
  challengeSub: ["Same start every time, one life", "Hep aynı başlangıç, tek can", "Stesso inizio ogni volta, una vita", "Immer gleicher Start, ein Leben", "Même départ, une seule vie", "Mismo inicio, una vida"],
  wordGame: ["Secret Word", "Gizli Kelime", "Parola segreta", "Geheimwort", "Mot secret", "Palabra secreta"],
  wordSub: ["Spell it with your last letters", "Son harflerinle onu yaz", "Scrivila con le ultime lettere", "Mit den letzten Buchstaben bilden", "Écris-le avec tes dernières lettres", "Escríbela con tus últimas letras"],
  best: ["Best", "En iyi", "Record", "Rekord", "Record", "Récord"],
  streak: ["Streak", "Seri", "Serie", "Serie", "Série", "Racha"],
  words: ["Words", "Kelime", "Parole", "Wörter", "Mots", "Palabras"],
  score: ["Score", "Puan", "Punti", "Punkte", "Score", "Puntos"],
  relaxed: ["Relaxed", "Rahat", "Rilassato", "Entspannt", "Détendu", "Relajado"],
  letters: ["{n} letters", "{n} harf", "{n} lettere", "{n} Buchstaben", "{n} lettres", "{n} letras"],
  notAWord: ["Not a word", "Geçerli bir kelime değil", "Parola non valida", "Kein gültiges Wort", "Mot invalide", "Palabra no válida"],
  alreadyUsed: ["Already used", "Bu kelimeyi kullandın", "Già usata", "Schon benutzt", "Déjà utilisé", "Ya usada"],
  typo: ["Almost! One letter off, try again", "Az kaldı! Bir harf yanlış, tekrar dene", "Quasi! Una lettera sbagliata, riprova", "Fast! Ein Buchstabe falsch, nochmal", "Presque ! Une lettre fausse, réessaie", "¡Casi! Una letra mal, inténtalo otra vez"],
  shieldSaved: ["Shield saved your streak", "Kalkan serini korudu", "Lo scudo ha salvato la serie", "Der Schild hat deine Serie gerettet", "Le bouclier a sauvé ta série", "El escudo salvó tu racha"],
  shieldEarned: ["Streak shield earned", "Seri kalkanı kazandın", "Scudo serie ottenuto", "Serienschutz verdient", "Bouclier de série gagné", "Escudo de racha conseguido"],
  lifeHealed: ["+1 life", "+1 can", "+1 vita", "+1 Leben", "+1 vie", "+1 vida"],
  gameOver: ["Game over", "Oyun bitti", "Partita finita", "Spiel vorbei", "Partie terminée", "Fin de la partida"],
  playAgain: ["Play again", "Tekrar oyna", "Gioca ancora", "Nochmal spielen", "Rejouer", "Jugar otra vez"],
  menu: ["Menu", "Menü", "Menu", "Menü", "Menu", "Menú"],
  longest: ["Longest word", "En uzun kelime", "Parola più lunga", "Längstes Wort", "Mot le plus long", "Palabra más larga"],
  coins: ["Coins", "Jeton", "Monete", "Münzen", "Pièces", "Monedas"],
  newBest: ["New best!", "Yeni rekor!", "Nuovo record!", "Neuer Rekord!", "Nouveau record !", "¡Nuevo récord!"],
  skip: ["Skip", "Atla", "Salta", "Weiter", "Passer", "Saltar"],
  noCoins: ["Not enough coins", "Yeterli jeton yok", "Monete insufficienti", "Nicht genug Münzen", "Pas assez de pièces", "No hay monedas suficientes"],
  letterCount: ["Letter count", "Harf sayısı", "Numero di lettere", "Buchstabenzahl", "Nombre de lettres", "Número de letras"],
  firstLetter: ["First letter", "İlk harf", "Prima lettera", "Erster Buchstabe", "Première lettre", "Primera letra"],
  won: ["Solved!", "Çözdün!", "Risolta!", "Gelöst!", "Résolu !", "¡Resuelta!"],
  lost: ["Out of guesses", "Tahmin hakkın bitti", "Tentativi finiti", "Keine Versuche mehr", "Plus d'essais", "Sin intentos"],
  guesses: ["Guesses", "Tahmin", "Tentativi", "Versuche", "Essais", "Intentos"],
  secretWas: ["Secret word", "Gizli kelime", "Parola segreta", "Geheimwort", "Mot secret", "Palabra secreta"],
  wordHelp: [
    "Each word ends with the next letter of the secret word (locked in the last tile) and starts with the last letter of your previous word. Every word you send uses a guess.",
    "Her kelime gizli kelimenin sıradaki harfiyle biter (son kutuda kilitli) ve bir önceki kelimenin son harfiyle başlar. Gönderdiğin her kelime bir tahmin hakkı kullanır.",
    "Ogni parola finisce con la lettera successiva della parola segreta (bloccata nell'ultima casella) e inizia con l'ultima lettera della parola precedente. Ogni parola inviata usa un tentativo.",
    "Jedes Wort endet mit dem nächsten Buchstaben des Geheimworts (im letzten Feld gesperrt) und beginnt mit dem letzten Buchstaben deines vorigen Worts. Jedes Wort kostet einen Versuch.",
    "Chaque mot finit par la lettre suivante du mot secret (bloquée dans la dernière case) et commence par la dernière lettre de ton mot précédent. Chaque mot envoyé utilise un essai.",
    "Cada palabra termina con la siguiente letra de la palabra secreta (bloqueada en la última casilla) y empieza con la última letra de tu palabra anterior. Cada palabra enviada usa un intento.",
  ],
  howTo: ["Start every word with the last letter of the previous one.", "Her kelimeye bir önceki kelimenin son harfiyle başla.", "Inizia ogni parola con l'ultima lettera della precedente.", "Beginne jedes Wort mit dem letzten Buchstaben des vorherigen.", "Commence chaque mot par la dernière lettre du précédent.", "Empieza cada palabra con la última letra de la anterior."],
  getApp: ["Get the full game on the App Store", "Tam oyunu App Store'dan indir", "Scarica il gioco completo sull'App Store", "Vollversion im App Store holen", "Le jeu complet sur l'App Store", "Juego completo en la App Store"],
  loading: ["Loading dictionary…", "Sözlük yükleniyor…", "Caricamento dizionario…", "Wörterbuch wird geladen…", "Chargement du dictionnaire…", "Cargando diccionario…"],
  loadFail: ["Could not load the dictionary", "Sözlük yüklenemedi", "Impossibile caricare il dizionario", "Wörterbuch konnte nicht geladen werden", "Impossible de charger le dictionnaire", "No se pudo cargar el diccionario"],
  language: ["Language", "Dil", "Lingua", "Sprache", "Langue", "Idioma"],
};
const LANG_COL = { en: 0, tr: 1, it: 2, de: 3, fr: 4, es: 5 };
let lang = pickLanguage();
const t = (k, n) => { const row = T[k]; if (!row) return k; const s = row[LANG_COL[lang]] ?? row[0]; return n == null ? s : s.replace("{n}", n); };

const L = () => LANGS[lang];
function display(s) { return lang === "tr" ? s.toLocaleLowerCase("tr-TR") : s.toLocaleUpperCase(L().locale); }

// ───────────────────────── RNG (SplitMix64, as in the app) ─────────────────────────
const M64 = (1n << 64n) - 1n;
class SplitMix64 {
  constructor(seed) { this.s = BigInt.asUintN(64, BigInt(seed)); }
  next() {
    this.s = (this.s + 0x9E3779B97F4A7C15n) & M64;
    let z = this.s;
    z = ((z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n) & M64;
    z = ((z ^ (z >> 27n)) * 0x94D049BB133111EBn) & M64;
    return z ^ (z >> 31n);
  }
  int(lo, hi) { return lo + Number(this.next() % BigInt(hi - lo + 1)); }
  bool() { return (this.next() & 1n) === 1n; }
  pick(arr) { return arr.length ? arr[this.int(0, arr.length - 1)] : undefined; }
}
const randomSeed = () => BigInt(Math.floor(Math.random() * 2 ** 32)) << 20n ^ BigInt(Math.floor(Math.random() * 2 ** 32));
const langHash = (code) => [...code].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0);

// ───────────────────────── Lexicon (KLX1 binary, see Tools/build_lexicon.py) ─────────────────────────
class Lexicon {
  constructor(buf) {
    const d = new Uint8Array(buf);
    if (d[0] !== 75 || d[1] !== 76 || d[2] !== 88 || d[3] !== 49) throw new Error("bad lexicon");
    this.a = d[4]; this.lo = d[5]; this.hi = d[6];
    const n = this.a * (this.hi - this.lo + 1), dv = new DataView(buf);
    this.off = new Uint32Array(n); this.cnt = new Uint32Array(n);
    for (let i = 0; i < n; i++) { this.off[i] = dv.getUint32(8 + i * 8, true); this.cnt[i] = dv.getUint32(12 + i * 8, true); }
    this.d = d;
  }
  bucket(len, f) { return (len < this.lo || len > this.hi || f < 0 || f >= this.a) ? -1 : (len - this.lo) * this.a + f; }
  count(len, f) { const b = this.bucket(len, f); return b < 0 ? 0 : this.cnt[b]; }
  contains(w) {
    const len = w.length, b = this.bucket(len, w[0]);
    if (b < 0) return false;
    let lo = 0, hi = this.cnt[b] - 1; const base = this.off[b], d = this.d;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1, p = base + mid * len;
      let c = 0;
      for (let i = 0; i < len; i++) { const x = d[p + i] - w[i]; if (x) { c = x; break; } }
      if (c === 0) return true;
      if (c < 0) lo = mid + 1; else hi = mid - 1;
    }
    return false;
  }
  scan(len, f, fn) {
    const b = this.bucket(len, f); if (b < 0) return;
    const base = this.off[b], n = this.cnt[b], d = this.d;
    for (let i = 0; i < n; i++) if (fn(d.subarray(base + i * len, base + (i + 1) * len))) return;
  }
  word(len, f, i) { const b = this.bucket(len, f); if (b < 0 || i < 0 || i >= this.cnt[b]) return null; const p = this.off[b] + i * len; return this.d.subarray(p, p + len); }
}

const lexCache = {};
async function loadLexicon(code) {
  if (lexCache[code]) return lexCache[code];
  const res = await fetch(`lex/${code}.lex.gz`);
  if (!res.ok) throw new Error("http " + res.status);
  let buf;
  const raw = await res.arrayBuffer();
  const u = new Uint8Array(raw);
  if (u[0] === 0x1f && u[1] === 0x8b) {
    const ds = new DecompressionStream("gzip");
    buf = await new Response(new Blob([raw]).stream().pipeThrough(ds)).arrayBuffer();
  } else buf = raw; // a server that already un-gzipped it
  return (lexCache[code] = new Lexicon(buf));
}

// Word helpers bound to a language + lexicon.
class WordSource {
  constructor(code, lex) {
    this.code = code; this.lex = lex;
    this.letters = [...LANGS[code].letters];
    this.index = new Map(this.letters.map((c, i) => [c, i]));
    this.playCache = new Map();
  }
  enc(word) { const out = []; for (const c of word) { const i = this.index.get(c); if (i == null) return null; out.push(i); } return out; }
  txt(bytes) { let s = ""; for (const b of bytes) s += this.letters[b]; return s; }
  count(len, first) { const i = this.index.get(first); return i == null ? 0 : this.lex.count(len, i); }
  contains(word) { const e = this.enc(word); return !!e && this.lex.contains(e); }
  isPlayable(first) {
    if (!this.playCache.has(first)) {
      let ok = false; for (let l = 3; l <= 12; l++) if (this.count(l, first) >= LengthDirector.minimumWords) { ok = true; break; }
      this.playCache.set(first, ok);
    }
    return this.playCache.get(first);
  }
  get playableLetters() { return this.letters.filter((c) => this.isPlayable(c)); }
  randomWord(len, first, used) {
    const f = this.index.get(first), n = this.lex.count(len, f); if (!n) return null;
    const start = Math.floor(Math.random() * n);
    for (let k = 0; k < Math.min(n, 400); k++) { const s = this.txt(this.lex.word(len, f, (start + k) % n)); if (!used.has(s)) return s; }
    return null;
  }
  completion(prefix, len, used) {
    const f = this.index.get(prefix[0]), enc = this.enc(prefix); if (f == null || !enc) return null;
    let found = null;
    this.lex.scan(len, f, (w) => { for (let i = 0; i < enc.length; i++) if (w[i] !== enc[i]) return false; const s = this.txt(w); if (used.has(s)) return false; found = s; return true; });
    return found;
  }
  isNearMiss(word, used) {
    const f = this.index.get(word[0]); if (f == null) return false;
    const enc = [...word].map((c) => this.index.get(c) ?? 255);
    let hit = false;
    this.lex.scan(enc.length, f, (w) => {
      let diff = 0; for (let i = 0; i < enc.length; i++) if (w[i] !== enc[i] && ++diff > 1) return false;
      if (diff === 1 && !used.has(this.txt(w))) { hit = true; return true; }
      return false;
    });
    return hit;
  }
}

// ───────────────────────── LengthDirector (rise-and-fall waves) ─────────────────────────
class LengthDirector {
  static minimumWords = 25;
  constructor(seed) { this.rng = new SplitMix64(seed); this.current = 3; this.rising = true; this.peak = 5; this.trough = 3; }
  start(count) {
    const r = this.rng;
    this.current = r.int(3, 6); this.rising = r.bool();
    this.peak = Math.min(12, this.current + r.int(1, 3)); this.trough = 3;
    this.current = this.feasible(this.current, count);
    return this.current;
  }
  next(count) {
    const r = this.rng; let c = this.current;
    if (this.rising) {
      c += (c < this.peak - 2 && r.int(0, 3) === 0) ? 2 : 1;
      if (c >= this.peak) { c = Math.min(c, this.peak); this.rising = false; }
    } else {
      c -= (c > this.trough + 2 && r.int(0, 3) === 0) ? 2 : 1;
      if (c <= this.trough) {
        c = Math.max(c, this.trough); this.rising = true;
        this.peak = Math.min(12, this.peak + r.int(1, 2));
        this.trough = r.int(3, Math.max(3, this.peak - 3));
      }
    }
    if (r.int(0, 2) === 0) c = r.int(3, Math.min(12, Math.max(this.peak, this.current) + 1));
    c = Math.min(Math.max(c, 3), 12);
    this.current = this.feasible(c, count);
    return this.current;
  }
  random(count) {
    const opts = []; for (let l = 3; l <= 12; l++) if (count(l) >= LengthDirector.minimumWords && l <= Math.max(this.peak, this.current) + 1) opts.push(l);
    this.current = opts.length ? this.rng.pick(opts) : this.feasible(this.current, count);
    return this.current;
  }
  feasible(target, count) {
    const ok = (l) => l >= 3 && l <= 12 && count(l) >= LengthDirector.minimumWords;
    if (ok(target)) return target;
    for (let d = 1; d <= 12; d++) { if (ok(target - d)) return target - d; if (ok(target + d)) return target + d; }
    return Math.min(Math.max(target, 3), 12);
  }
}

// ───────────────────────── Wallet / progress ─────────────────────────
const wallet = {
  coins: store.get("coins", 150),
  add(n) { this.coins += n; store.set("coins", this.coins); ui.coins(); },
  spend(n) { if (this.coins < n) return false; this.coins -= n; store.set("coins", this.coins); ui.coins(); return true; },
};
const progress = {
  bestStreak: store.get("bestStreak", 0),
  totalWords: store.get("totalWords", 0),
  addWord() { this.totalWords++; store.set("totalWords", this.totalWords); },
  recordStreak(s) { if (s > this.bestStreak) { this.bestStreak = s; store.set("bestStreak", s); } },
};

// ───────────────────────── Chain game engine (Relaxed) ─────────────────────────
const PRIZE_COINS = { lucky: 3, big: 10, jackpot: 40 };
function coinMultiplier(s) { return s >= 100 ? 10 : s >= 50 ? 5 : s >= 25 ? 4 : s >= 10 ? 3 : s >= 5 ? 2 : 1; }

class ChainGame {
  constructor(src, { challenge = false } = {}) {
    this.src = src; this.challenge = challenge;
    const seed = challenge ? BigInt(0xC4A11E46 + langHash(src.code) * 1000003) : randomSeed();
    this.director = new LengthDirector(seed);
    const cands = src.playableLetters;
    this.requiredFirst = challenge ? cands[Number(seed % BigInt(cands.length))] : cands[Math.floor(Math.random() * cands.length)];
    const first = this.requiredFirst;
    this.targetLength = this.director.start((l) => src.count(l, first));
    this.risingTrend = this.director.rising;
    this.maxLives = challenge ? 1 : 3; this.lives = this.maxLives;
    this.typed = []; this.chain = []; this.used = new Set();
    this.score = 0; this.streak = 0; this.bestStreakThisGame = 0; this.longest = ""; this.coinsEarned = 0;
    this.freeShield = false; this.nextShieldAt = 10; this.typoGuardsLeft = 3; this.slipped = false;
    this.failedThisWord = false; this.hintLetter = null; this.isOver = false;
    this.bestKey = challenge ? `best.challenge.${src.code}` : `best.relaxed.${src.code}`;
    this.bestScore = store.get(this.bestKey, 0);
    this.prepareTurn();
  }
  prepareTurn() { this.pendingPrize = this.rollPrize(this.targetLength); this.hintLetter = null; this.slipped = false; }
  rollPrize(len) {
    const f = (1 + 0.12 * Math.max(0, len - 5)) * 0.6, r = Math.random();
    if (r < 0.005 * f) return "jackpot"; if (r < 0.055 * f) return "big"; if (r < 0.195 * f) return "lucky"; return null;
  }
  get isFull() { return this.typed.length >= this.targetLength - 1; }
  type(c) {
    if (this.isOver || this.isFull || !this.src.index.has(c)) return null;
    this.typed.push(c); this.hintLetter = null;
    return this.isFull ? this.submit() : { kind: "typed" };
  }
  backspace() { if (!this.isOver && this.typed.length) { this.typed.pop(); this.hintLetter = null; } }
  submit() {
    const word = this.requiredFirst + this.typed.join("");
    if (!this.src.contains(word)) {
      if (this.typoGuardsLeft > 0 && !this.slipped && this.src.isNearMiss(word, this.used)) {
        this.typoGuardsLeft--; this.slipped = true; this.typed.pop();
        return { kind: "typo" };
      }
      return this.reject("notAWord");
    }
    if (this.used.has(word)) return this.reject("alreadyUsed");
    return this.accept(word);
  }
  accept(word) {
    this.used.add(word); this.streak++;
    const mult = 1 + Math.min(this.streak - 1, 10) * 0.1;
    const points = Math.round(word.length * word.length * mult);
    this.score += points;
    const cm = coinMultiplier(this.streak);
    const coins = (Math.max(1, word.length - 2) + (this.streak % 5 === 0 ? 5 : 0)) * cm;
    const prize = this.pendingPrize, prizeCoins = prize ? PRIZE_COINS[prize] : 0;
    wallet.add(coins + prizeCoins); this.coinsEarned += coins + prizeCoins;
    progress.addWord(); progress.recordStreak(this.streak);
    this.bestStreakThisGame = Math.max(this.bestStreakThisGame, this.streak);
    this.failedThisWord = false;
    let shieldEarned = false, lifeRestored = false;
    if (!this.freeShield && this.streak >= this.nextShieldAt) { this.freeShield = true; shieldEarned = true; }
    if (!this.challenge && this.streak % 10 === 0 && this.lives < this.maxLives) { this.lives++; lifeRestored = true; }
    if (word.length > this.longest.length) this.longest = word;
    this.chain.push({ word }); this.typed = [];
    this.advance(word);
    return { kind: "accepted", word, points, coins, prize, prizeCoins, multiplier: cm, shieldEarned, lifeRestored, big: word.length >= 8 || this.streak % 5 === 0 };
  }
  advance(word) {
    let next = word[word.length - 1];
    if (!this.src.isPlayable(next)) { const p = this.src.playableLetters; next = p[Math.floor(Math.random() * p.length)]; }
    this.requiredFirst = next;
    this.targetLength = this.director.next((l) => this.src.count(l, next));
    this.risingTrend = this.director.rising;
    this.prepareTurn();
  }
  loseStreak() {
    if (this.streak === 0) return null;
    if (this.freeShield) { this.freeShield = false; this.nextShieldAt = this.streak + 10; return "shield"; }
    this.streak = 0; return "lost";
  }
  reject(reason) {
    this.typed = [];
    if (reason === "alreadyUsed") return { kind: "rejected", reason };
    const streakResult = this.loseStreak();
    this.failedThisWord = true; this.lives--;
    if (this.lives <= 0) { this.finish(); return { kind: "rejected", reason, streakResult, over: true }; }
    return { kind: "rejected", reason, streakResult };
  }
  get canSkip() { return this.failedThisWord && !this.isOver; }
  skip() {
    if (!this.canSkip || !wallet.spend(40)) return false;
    this.failedThisWord = false; this.typed = []; this.hintLetter = null;
    const filled = this.src.randomWord(this.targetLength, this.requiredFirst, this.used);
    if (filled) { this.used.add(filled); this.chain.push({ word: filled, skipped: true }); this.advance(filled); }
    else {
      const cur = this.requiredFirst, opts = this.src.playableLetters.filter((c) => c !== cur);
      const letter = opts[Math.floor(Math.random() * opts.length)] || cur;
      this.requiredFirst = letter; this.targetLength = this.director.random((l) => this.src.count(l, letter));
      this.risingTrend = this.director.rising; this.prepareTurn();
    }
    return true;
  }
  changeLength() {
    if (this.isOver) return false;
    const first = this.requiredFirst, opts = [];
    for (let l = 3; l <= 12; l++) if (l !== this.targetLength && this.src.count(l, first) >= LengthDirector.minimumWords) opts.push(l);
    if (!opts.length || !wallet.spend(30)) return false;
    const len = opts[Math.floor(Math.random() * opts.length)];
    this.risingTrend = len > this.targetLength; this.targetLength = len;
    this.typed = []; this.hintLetter = null; this.slipped = false; this.pendingPrize = this.rollPrize(len);
    return true;
  }
  hint() {
    if (this.isOver || this.hintLetter || this.isFull) return false;
    const prefix = this.requiredFirst + this.typed.join("");
    const word = this.src.completion(prefix, this.targetLength, this.used);
    if (!word || !wallet.spend(20)) return false;
    this.hintLetter = [...word][prefix.length];
    return true;
  }
  finish() {
    this.isOver = true;
    this.isNewBest = this.score > this.bestScore && this.score > 0;
    if (this.isNewBest) { this.bestScore = this.score; store.set(this.bestKey, this.score); }
  }
}

// ───────────────────────── Secret Word (fixed target, from DailyWordGame) ─────────────────────────
class SecretWordGame {
  constructor(src) {
    this.src = src; this.target = [...SECRET[src.code]];
    this.base = BigInt(0x5EED0D41A11) ^ BigInt(langHash(src.code));
    this.words = []; this.guessesUsed = 0; this.changesUsed = 0; this.status = "playing"; this.typed = []; this.first = null;
    this.counts = new Map();
    this.length = this.pickLength(null, this.target[0], 0n) ?? 5;
  }
  get round() { return this.words.length; }
  get maxGuesses() { return this.target.length + 3; }
  get maxChanges() { return this.target.length; }
  get guessesLeft() { return Math.max(0, this.maxGuesses - this.guessesUsed); }
  get changesLeft() { return Math.max(0, this.maxChanges - this.changesUsed); }
  get isOver() { return this.status !== "playing"; }
  get needed() { return this.round < this.target.length ? this.target[this.round] : null; }
  get freeCount() { return Math.max(0, this.length - 1 - (this.first ? 1 : 0)); }
  get currentWord() { return (this.first || "") + this.typed.join("") + (this.needed || ""); }
  rng(salt) { return new SplitMix64(this.base + salt * 0x9E3779B9n); }
  answers(len, first, last) {
    const key = `${len}|${first || "*"}|${last}`;
    if (this.counts.has(key)) return this.counts.get(key);
    const li = this.src.index.get(last); let n = 0;
    if (li != null) {
      const firsts = first ? [this.src.index.get(first)] : this.src.letters.map((_, i) => i);
      for (const f of firsts) if (f != null) this.src.lex.scan(len, f, (w) => { if (w[w.length - 1] === li) n++; return false; });
    }
    this.counts.set(key, n); return n;
  }
  pickLength(first, last, salt) {
    const fits = []; for (let l = 3; l <= 8; l++) if (this.answers(l, first, last) >= 3) fits.push(l);
    const comfy = fits.filter((l) => l >= 4 && l <= 6);
    return this.rng(salt).pick(comfy.length ? comfy : fits);
  }
  otherLengths() { const n = this.needed; if (!n) return []; const o = []; for (let l = 3; l <= 8; l++) if (l !== this.length && this.answers(l, this.first, n) >= 3) o.push(l); return o; }
  otherFirsts() { const n = this.needed; if (!n || !this.first) return []; return this.src.letters.filter((c) => c !== this.first && this.answers(this.length, c, n) >= 3); }
  get canChangeLength() { return !this.isOver && this.changesLeft > 0 && this.otherLengths().length > 0; }
  get canChangeFirst() { return !this.isOver && this.changesLeft > 0 && !!this.first && this.otherFirsts().length > 0; }
  type(c) {
    if (this.isOver || this.typed.length >= this.freeCount || !this.src.index.has(c)) return null;
    this.typed.push(c);
    return this.typed.length === this.freeCount ? this.send() : { kind: "typed" };
  }
  backspace() { if (!this.isOver && this.typed.length) this.typed.pop(); }
  send() {
    const needed = this.needed; if (!needed) return null;
    const word = this.currentWord; this.guessesUsed++;
    if (this.words.includes(word)) return this.reject("alreadyUsed");
    if (this.src.contains(word)) {
      this.words.push(word); this.typed = [];
      if (this.round === this.target.length) { this.status = "won"; const c = 50 + 10 * this.guessesLeft; wallet.add(c); return { kind: "accepted", word, won: true, coins: c }; }
      this.first = needed;
      this.length = this.pickLength(needed, this.target[this.round], BigInt(this.round * 31)) ?? 5;
      if (this.guessesUsed >= this.maxGuesses) this.status = "lost";
      return { kind: "accepted", word, lost: this.status === "lost" };
    }
    return this.reject("notAWord");
  }
  reject(reason) { this.typed = []; if (this.guessesUsed >= this.maxGuesses) this.status = "lost"; return { kind: "rejected", reason, lost: this.status === "lost" }; }
  changeLength() {
    if (!this.canChangeLength) return false;
    const o = this.otherLengths(), comfy = o.filter((l) => l >= 4 && l <= 6);
    this.length = this.rng(BigInt(1000 + this.changesUsed * 7 + this.round)).pick(comfy.length ? comfy : o);
    this.changesUsed++; this.typed = []; return true;
  }
  changeFirst() {
    if (!this.canChangeFirst) return false;
    this.first = this.rng(BigInt(2000 + this.changesUsed * 7 + this.round)).pick(this.otherFirsts());
    this.changesUsed++; this.typed = []; return true;
  }
}

// ───────────────────────── Sound ─────────────────────────
const sound = {
  on: store.get("sound", true), ctx: null, buffers: {}, amb: null, hot: null, ready: false,
  files: ["sfx_key", "sfx_wrong", "sfx_accept_confetti", "sfx_coin", "sfx_gameover", "sfx_win", "sfx_lifelost", "sfx_lifeheal",
    "sfx_prize_lucky", "sfx_prize_big", "sfx_prize_jackpot", "sfx_click", "sfx_used", "sfx_unlock", "voice_blob", "cel_blob", "amb_dawn", "amb_dawn_hot"],
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    this.ctx = new AC(); this.master = this.ctx.createGain(); this.master.gain.value = this.on ? 1 : 0; this.master.connect(this.ctx.destination);
    Promise.all(this.files.map((f) => fetch(`sfx/${f}.mp3`).then((r) => r.arrayBuffer()).then((b) => new Promise((ok) => this.ctx.decodeAudioData(b, (d) => { this.buffers[f] = d; ok(); }, () => ok()))).catch(() => {})))
      .then(() => { this.ready = true; this.startAmbience(); });
  },
  play(name, vol = 1, rate = 1) {
    if (!this.ctx || !this.buffers[name]) return;
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
    s.buffer = this.buffers[name]; s.playbackRate.value = rate; g.gain.value = vol; s.connect(g); g.connect(this.master); s.start();
  },
  loop(name, vol) {
    const s = this.ctx.createBufferSource(), g = this.ctx.createGain();
    s.buffer = this.buffers[name]; s.loop = true; g.gain.value = vol; s.connect(g); g.connect(this.master); s.start(); return g;
  },
  startAmbience() {
    if (this.amb || !this.buffers.amb_dawn) return;
    this.amb = this.loop("amb_dawn", 0.35); this.hot = this.loop("amb_dawn_hot", 0);
  },
  setHype(h) { if (this.hot) { const now = this.ctx.currentTime; this.hot.gain.setTargetAtTime(0.4 * h, now, 0.6); this.amb.gain.setTargetAtTime(0.35 * (1 - 0.6 * h), now, 0.6); } },
  toggle() { this.on = !this.on; store.set("sound", this.on); if (this.master) this.master.gain.value = this.on ? 1 : 0; ui.soundIcon(); },
};

// ───────────────────────── Helpers for drawing ─────────────────────────
function rnd(i, salt = 0) {
  let x = (Math.imul(i, 73856093) ^ Math.imul(salt, 19349663) ^ 0x5bd1e995) >>> 0;
  x = Math.imul(x ^ (x >>> 15), 0x2c1b3c6d) >>> 0;
  x = Math.imul(x ^ (x >>> 12), 0x297a2d39) >>> 0;
  x = (x ^ (x >>> 15)) >>> 0;
  return (x & 0xffffff) / 0x1000000;
}
const wrap = (x, m) => ((x % m) + m) % m;
const fract = (x) => x - Math.floor(x);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => { const c = clamp01(x); return c * c * (3 - 2 * c); };
function hex(h, a = 1) { return `rgba(${(h >> 16) & 255},${(h >> 8) & 255},${h & 255},${a})`; }
function mix(h1, h2, k) {
  const r = Math.round(((h1 >> 16) & 255) * (1 - k) + ((h2 >> 16) & 255) * k), g = Math.round(((h1 >> 8) & 255) * (1 - k) + ((h2 >> 8) & 255) * k), b = Math.round((h1 & 255) * (1 - k) + (h2 & 255) * k);
  return (r << 16) | (g << 8) | b;
}

// ───────────────────────── World: Dawn background ─────────────────────────
const DAWN = { base: [0x2B1B5A, 0x8B3A8F, 0xF2776B], blobs: [0xFF9A76, 0xFFC371, 0xC86DD7, 0x6A4CC9, 0xFF6B9D] };
const world = {
  t: 0, boost: 0, hype: 0, hypeTarget: 0, last: 0,
  kick(a = 1) { this.boost = Math.min(this.boost + a, 2.5); },
  setStreak(s) { this.hypeTarget = Math.min(1, Math.pow(Math.max(0, s) / 30, 0.8)); sound.setHype(this.hypeTarget); },
};
const bg = document.getElementById("bg"), bgc = bg.getContext("2d");
let W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
  for (const c of [bg, fx]) { c.width = W * DPR; c.height = H * DPR; }
}
function terrain(ctx, t, base, amp, wl, speed, phase, fill) {
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W + 8; x += 8) { const u = (x + t * speed) / wl + phase; ctx.lineTo(x, base + amp * (0.6 * Math.sin(u) + 0.4 * Math.sin(u * 2.3 + 1.3))); }
  ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
function cloud(ctx, cx, cy, s, a) {
  ctx.fillStyle = `rgba(255,255,255,${a})`;
  for (const [dx, dy, w, h] of [[-34, 4, 60, 30], [0, -8, 74, 44], [36, 4, 62, 32], [4, 8, 110, 28]]) {
    ctx.beginPath(); ctx.ellipse(cx + dx * s, cy + dy * s, (w * s) / 2, (h * s) / 2, 0, 0, Math.PI * 2); ctx.fill();
  }
}
let floating = [];
function refreshFloating() { const ls = [...L().letters]; floating = Array.from({ length: 14 }, (_, i) => ls[Math.floor(rnd(i, 77) * ls.length) % ls.length]); }
function drawBackground(t, h) {
  const ctx = bgc; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const heat = smooth(h) * 0.55, sway = 0.15 * Math.sin(t * 0.05);
  const g = ctx.createLinearGradient(W * (0.5 - sway), 0, W * (0.5 + sway), H);
  DAWN.base.forEach((c, i) => g.addColorStop(i / (DAWN.base.length - 1), hex(mix(c, 0xE0281E, heat))));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const big = Math.max(W, H);
  DAWN.blobs.forEach((c0, i) => {
    const sp = 0.10 + 0.031 * i;
    const cx = W * (0.5 + 0.40 * Math.sin(t * sp + i * 1.7)), cy = H * (0.5 + 0.42 * Math.cos(t * sp * 0.8 + i * 2.3));
    const r = big * (0.42 + 0.10 * Math.sin(t * 0.17 + i)), c = mix(c0, i % 2 ? 0xFF6A1A : 0xE0281E, Math.min(1, heat * 1.2));
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); rg.addColorStop(0, hex(c, 0.62)); rg.addColorStop(1, hex(c, 0));
    ctx.fillStyle = rg; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  });
  // Dawn scene
  const sx = W * 0.74, sy = H * 0.27 + 8 * Math.sin(t * 0.3);
  const sg = ctx.createRadialGradient(sx, sy, 20, sx, sy, 230); sg.addColorStop(0, hex(0xFFE9A8, 0.55)); sg.addColorStop(1, hex(0xFFB27A, 0));
  ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, 230, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hex(0xFFF0C2, 0.9); ctx.beginPath(); ctx.arc(sx, sy, 52, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 7; i++) {
    const sp = 6 + 10 * rnd(i, 1), span = W + 320;
    cloud(ctx, wrap(rnd(i, 2) * span + t * sp, span) - 160, H * (0.08 + 0.5 * rnd(i, 3)), 0.7 + 0.9 * rnd(i, 4), 0.10 + 0.10 * rnd(i, 5));
  }
  terrain(ctx, t, H * 0.80, 34, 90, 10, 0.4, hex(0x3A1D6B, 0.45));
  terrain(ctx, t, H * 0.86, 28, 70, 18, 2.1, hex(0x2A1252, 0.55));
  terrain(ctx, t, H * 0.92, 22, 55, 30, 4.0, hex(0x1B0A3A, 0.65));
  if (h > 0.01) drawFire(ctx, t, h);
  // Floating letters
  ctx.font = `900 64px ${getComputedStyle(document.body).fontFamily}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff";
  floating.forEach((ch, i) => {
    const sp = 10 + 16 * rnd(i, 1), span = H + 160;
    const y = H + 80 - wrap(t * sp + rnd(i, 2) * span, span), x = W * rnd(i, 3) + 18 * Math.sin(t * 0.4 + i), s = 0.5 + 0.9 * rnd(i, 4);
    ctx.save(); ctx.globalAlpha = 0.05 + 0.07 * rnd(i, 5); ctx.translate(x, y);
    ctx.rotate(((-25 + 50 * rnd(i, 6) + 8 * Math.sin(t * 0.3 + i)) * Math.PI) / 180); ctx.scale(s, s); ctx.fillText(display(ch), 0, 0); ctx.restore();
  });
}
function drawFire(ctx, t, h) {
  const heat = smooth(h), bottom = H, top = bottom * (1 - 0.18 - 0.30 * heat);
  const g = ctx.createLinearGradient(0, top, 0, bottom); g.addColorStop(0, hex(0xE0281E, 0)); g.addColorStop(1, hex(0xE0281E, 0.35 * heat));
  ctx.fillStyle = g; ctx.fillRect(0, top, W, bottom - top);
  [[0xC4161C, 1.0, 0.55, 9], [0xFF6A1A, 0.78, 0.7, 8], [0xFFD04A, 0.5, 0.8, 7]].forEach(([col, scale, alpha, count], li) => {
    const w = W / count; ctx.fillStyle = hex(col, alpha * Math.min(1, heat * 1.6));
    for (let i = 0; i < count + 1; i++) {
      const seed = i * 7 + li * 13, flick = 0.65 + 0.35 * Math.sin(t * (2.2 + rnd(i, 40 + li) * 1.6) + seed);
      const ht = H * (0.05 + 0.24 * heat) * scale * (0.6 + 0.6 * rnd(i, 50 + li)) * flick, x = (i + 0.5 * (li % 2)) * w, lean = 14 * Math.sin(t * 1.3 + seed) * heat;
      ctx.beginPath(); ctx.moveTo(x - w * 0.62, bottom + 4);
      ctx.quadraticCurveTo(x - w * 0.5, bottom - ht * 0.45, x + lean, bottom - ht);
      ctx.quadraticCurveTo(x + w * 0.5 + lean, bottom - ht * 0.45, x + w * 0.62, bottom + 4); ctx.fill();
    }
  });
}

// ───────────────────────── Blobby (the default companion) ─────────────────────────
const SKIN = { top: 0xFFE98A, bottom: 0xFFB347, ink: "#4A2538" };
const G = { bx: -68, by: -126, bw: 136, bh: 126, topR: 68, botR: 54, eyeX: 25, eyeY: -76, mouthY: -42, mouthHW: 17, cheekX: 46, cheekY: -52, shoulderX: 62, shoulderY: -52 };
const mascot = {
  mood: "idle", since: performance.now() / 1000, resetTimer: 0, pose: null, last: 0,
  set(mood, resetAfter) {
    this.mood = mood; this.since = performance.now() / 1000; clearTimeout(this.resetTimer);
    if (resetAfter) this.resetTimer = setTimeout(() => this.set("idle"), resetAfter * 1000);
  },
  target(t, mt) {
    const m = this.mood, happy = m === "happy" || m === "celebrate", sad = m === "sad", thinking = m === "thinking", cel = m === "celebrate";
    const p = { happy: +happy, mouthOpen: +happy, thinking: +thinking, smile: happy ? 1 : sad ? -0.9 : thinking ? 0.05 : 0.55, brow: sad || thinking ? 1 : 0 };
    [p.bIL, p.bOL] = sad ? [-7, 1] : thinking ? [0, 2] : [-5, 0];
    [p.bIR, p.bOR] = sad ? [-7, 1] : thinking ? [-7, -7] : [-5, 0];
    if (thinking) { p.lookX = 4 + 3.5 * Math.cos(t * 1.3); p.lookY = -4.5 + 1.5 * Math.sin(t * 2.1); }
    else if (sad) { p.lookX = 0; p.lookY = 4.5; } else { p.lookX = 1.6 * Math.sin(t * 0.7); p.lookY = 0.6 * Math.sin(t * 0.5); }
    p.lift = m === "happy" ? 34 * Math.abs(Math.sin(mt * 8.5)) * Math.exp(-mt * 2.4) : cel ? 52 * Math.abs(Math.sin(mt * 7)) * Math.exp(-mt * 0.85) : 0;
    p.tilt = thinking ? 0.05 * Math.sin(t * 1.6) : cel ? 0.08 * Math.sin(mt * 7) : 0;
    p.droop = +sad; p.sad = +sad; p.celebrate = +cel; p.sparkle = +happy; p.excite = cel ? 1 : happy ? 0.85 : 0; p.wave = cel ? 1 : happy ? 0.6 : 0;
    p.hype = world.hype;
    const sy = G.shoulderY;
    for (const s of [-1, 1]) {
      let x = s * 84, y = sy + 22 + 3 * Math.sin(t * 2.2 + s);
      if (m === "happy") { x = s * 88; y = sy - 34; } else if (cel) { x = s * 84; y = sy - 86; } else if (sad) { x = s * 74; y = sy + 38; }
      else if (thinking && s > 0) { x = 24; y = G.mouthY + 12 + 1.5 * Math.sin(t * 2); }
      if (s < 0) { p.hLX = x; p.hLY = y; } else { p.hRX = x; p.hRY = y; }
    }
    return p;
  },
  update(now) {
    const t = now, mt = Math.max(0, now - this.since), dt = Math.min(0.05, Math.max(0, now - (this.last || now))); this.last = now;
    const tg = this.target(t, mt);
    if (!this.pose) this.pose = { ...tg };
    else {
      const ease = (keys, rate) => { const k = 1 - Math.exp(-rate * dt); for (const kk of keys) this.pose[kk] += (tg[kk] - this.pose[kk]) * k; };
      ease(["smile", "mouthOpen", "happy", "thinking", "brow", "bIL", "bOL", "bIR", "bOR", "lookX", "lookY"], 11);
      ease(["hLX", "hLY", "hRX", "hRY", "wave"], 9);
      ease(["tilt", "droop", "sad", "celebrate", "sparkle", "excite"], 8);
      ease(["lift"], 26); ease(["hype"], 4);
    }
    this.pose.t = t; this.pose.mt = mt;
    this.pose.act = this.mood === "celebrate" && mt < 1.9 ? mt : -1;
    return this.pose;
  },
};
function star(ctx, cx, cy, r) {
  const k = r * 0.28; ctx.beginPath(); ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + k, cy - k, cx + r, cy); ctx.quadraticCurveTo(cx + k, cy + k, cx, cy + r);
  ctx.quadraticCurveTo(cx - k, cy + k, cx - r, cy); ctx.quadraticCurveTo(cx - k, cy - k, cx, cy - r); ctx.fill();
}
function paintMascot(canvas, p) {
  const rect = canvas.getBoundingClientRect(); if (!rect.width) return;
  const cw = Math.round(rect.width * DPR);
  if (canvas.width !== cw) { canvas.width = cw; canvas.height = cw; }
  const ctx = canvas.getContext("2d"), size = canvas.width, unit = (size / (1 + 0.5)) / 240, off = (size - 240 * unit) / 2;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, size, size);
  ctx.setTransform(unit, 0, 0, unit, off, off);
  const t = p.t, heat = smooth(p.hype) * 0.32;
  let actLift = 0; if (p.act >= 0) actLift = 34 * Math.abs(Math.sin(p.act * 9)) * Math.exp(-p.act * 0.8);
  const lift = p.lift + actLift, breathe = Math.sin(t * 2.2);
  const sy = 1 + 0.02 * breathe + p.lift * 0.0018 - 0.07 * p.droop, sx = 1 - 0.012 * breathe - p.lift * 0.0014 + 0.03 * p.droop;
  const gx = 120, gy = 215, ss = Math.max(0.4, 1 - lift / 140);
  ctx.fillStyle = "rgba(0,0,0," + 0.22 * ss + ")"; ctx.beginPath(); ctx.ellipse(gx, gy + 1, 52 * ss, 7 * ss, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.translate(gx, gy - lift + 3 * p.droop); ctx.rotate(p.tilt); ctx.scale(sx, sy);
  const top = mix(SKIN.top, 0xFF3B2F, heat), bot = mix(SKIN.bottom, 0xFF3B2F, heat);
  // feet
  ctx.fillStyle = hex(bot, 0.95); for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 28, 0, 18, 8, 0, 0, Math.PI * 2); ctx.fill(); }
  // body
  const { bx, by, bw, bh, topR, botR } = G;
  ctx.beginPath(); ctx.moveTo(bx + topR, by); ctx.lineTo(bx + bw - topR, by); ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + topR);
  ctx.lineTo(bx + bw, by + bh - botR); ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - botR, by + bh); ctx.lineTo(bx + botR, by + bh);
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - botR); ctx.lineTo(bx, by + topR); ctx.quadraticCurveTo(bx, by, bx + topR, by); ctx.closePath();
  const bg2 = ctx.createLinearGradient(0, by, 0, by + bh); bg2.addColorStop(0, hex(top)); bg2.addColorStop(1, hex(bot)); ctx.fillStyle = bg2; ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.32)"; ctx.beginPath(); ctx.ellipse(bx + 37, by + 24, 17, 10, 0, 0, Math.PI * 2); ctx.fill();
  // face
  const blinkPhase = fract(t / 3.7), blink = blinkPhase < 0.06 ? 1 - Math.sin((Math.PI * blinkPhase) / 0.06) : 1, openH = Math.max(0.08, blink), round = 1 - p.happy;
  for (const s of [-1, 1]) {
    const cx = s * G.eyeX, cy = G.eyeY;
    if (round > 0.01) {
      ctx.globalAlpha = round; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(cx, cy, 15, 15 * openH, 0, 0, Math.PI * 2); ctx.fill();
      const pupil = clamp01((blink - 0.2) / 0.4);
      if (pupil > 0) {
        ctx.globalAlpha = round * pupil; ctx.fillStyle = SKIN.ink; ctx.beginPath(); ctx.arc(cx + p.lookX, cy + p.lookY, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx + p.lookX - 1, cy + p.lookY - 3, 2.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    if (p.happy > 0.01) {
      ctx.globalAlpha = p.happy; ctx.strokeStyle = SKIN.ink; ctx.lineWidth = 5.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - 11, cy + 4); ctx.quadraticCurveTo(cx, cy - 15, cx + 11, cy + 4); ctx.stroke(); ctx.globalAlpha = 1;
    }
    if (p.brow > 0.01) {
      const inner = s < 0 ? p.bIL : p.bIR, outer = s < 0 ? p.bOL : p.bOR;
      ctx.globalAlpha = 0.85 * p.brow; ctx.strokeStyle = SKIN.ink; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - 11 * s, cy - 24 + inner); ctx.lineTo(cx + 11 * s, cy - 24 + outer); ctx.stroke(); ctx.globalAlpha = 1;
    }
  }
  ctx.fillStyle = hex(0xFF6F91, 0.45 + 0.3 * p.happy);
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * G.cheekX, G.cheekY + 6, 10, 6, 0, 0, Math.PI * 2); ctx.fill(); }
  const my = G.mouthY, mw = G.mouthHW, lineA = (1 - p.mouthOpen) * (1 - p.thinking);
  if (lineA > 0.01) { ctx.globalAlpha = lineA; ctx.strokeStyle = SKIN.ink; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-mw, my - 3); ctx.quadraticCurveTo(0, my - 3 + 30 * p.smile, mw, my - 3); ctx.stroke(); }
  if (p.thinking > 0.01) { ctx.globalAlpha = p.thinking; ctx.fillStyle = SKIN.ink; const mx = 6 * Math.sin(t * 1.3); ctx.beginPath(); ctx.ellipse(mx, my - 1, 5, (8 + 2 * Math.sin(t * 3)) / 2, 0, 0, Math.PI * 2); ctx.fill(); }
  if (p.mouthOpen > 0.03) {
    ctx.globalAlpha = Math.min(1, p.mouthOpen * 2); ctx.beginPath(); ctx.moveTo(-mw * 1.18, my - 6); ctx.quadraticCurveTo(0, my - 6 + 46 * p.mouthOpen, mw * 1.18, my - 6); ctx.closePath();
    ctx.fillStyle = "#7A2640"; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = "#FF7C9C"; ctx.beginPath(); ctx.ellipse(0, my + 15, 9, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  ctx.globalAlpha = 1;
  // arms
  for (const s of [-1, 1]) {
    let hx = s < 0 ? p.hLX : p.hRX, hy = s < 0 ? p.hLY : p.hRY;
    hx += p.wave * 8 * Math.sin(t * 12 + s); hy += p.wave * 10 * Math.sin(t * 14 + s * 1.5);
    const shx = s * G.shoulderX, shy = G.shoulderY;
    ctx.strokeStyle = hex(bot); ctx.lineWidth = 12; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(shx, shy); ctx.quadraticCurveTo((shx + hx) / 2 + s * 10, (shy + hy) / 2 + 6, hx, hy); ctx.stroke();
    ctx.fillStyle = hex(top); ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.fill();
  }
  // tuft
  ctx.strokeStyle = hex(bot); ctx.lineWidth = 6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(0, -124); ctx.quadraticCurveTo(-14, -132, -10, -146); ctx.moveTo(2, -124); ctx.quadraticCurveTo(16, -128, 16, -142); ctx.stroke();
  ctx.restore();
  // extras
  if (p.thinking > 0.02) {
    ctx.globalAlpha = p.thinking; const bob = 2 * Math.sin(t * 2);
    ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.arc(166, 84 + bob, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.arc(178, 66 + bob, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.ellipse(201, 32 + bob, 33, 22, 0, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 3; i++) { const a = 0.35 + 0.65 * Math.max(0, Math.sin(t * 4 - i * 0.9)); ctx.fillStyle = hex(SKIN.bottom, 0.5 + 0.5 * a); ctx.beginPath(); ctx.arc(185 + i * 16, 32 + bob, 4 + 1.5 * a, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  const cols = [0xFFE27A, 0xFF8FB1, 0x7CF5E1, 0xFFFFFF];
  if (p.sparkle > 0.02) {
    const life = 1.1 + 1.1 * p.celebrate, fade = Math.max(0, 1 - p.mt / life) * p.sparkle;
    for (let i = 0; i < 7; i++) {
      const vis = i < 4 ? 1 : p.celebrate, a = (i / 7) * Math.PI * 2 + p.mt * 1.5, r = 88 + 26 * Math.sin(p.mt * 5 + i) + 30 * (1 - fade);
      ctx.fillStyle = hex(cols[i % 4], fade * vis); star(ctx, 120 + Math.cos(a) * r, 120 + Math.sin(a) * r * 0.85, (6 + 6 * rnd(i, 3)) * (0.5 + 0.5 * Math.abs(Math.sin(p.mt * 6 + i))));
    }
  }
  if (p.act >= 0) {
    const ap = clamp01(p.act / 1.9), fade = Math.min(1, (1 - ap) * 3);
    for (let i = 0; i < 9; i++) {
      const age = fract(p.act * 1.2 + i / 9);
      ctx.fillStyle = hex(cols[i % 4], (1 - age) * fade); star(ctx, 120 + 80 * Math.sin(i * 2.4 + p.act) * (0.5 + 0.5 * age), gy - 40 - lift - age * 130, 5 + 5 * (1 - age));
    }
  }
  if (p.sad > 0.05) { const f = fract(t * 0.9); ctx.fillStyle = hex(0x7CC8FF, 0.9 * (1 - f) * p.sad); ctx.beginPath(); ctx.ellipse(100, 126 + 40 * f, 4, 6, 0, 0, Math.PI * 2); ctx.fill(); }
}

// ───────────────────────── Confetti (Dawn's celebration) ─────────────────────────
const fx = document.getElementById("fx"), fxc = fx.getContext("2d");
let parts = [];
function burst(el, n = 36, big = false) {
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const cols = ["#FFD27A", "#FF8FB1", "#7CF5E1", "#C98BFF", "#FFFFFF", "#FF9A76"];
  for (let i = 0; i < n * (big ? 2 : 1); i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3, sp = 4 + Math.random() * (big ? 9 : 6);
    parts.push({ x: cx + (Math.random() - 0.5) * r.width, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      w: 5 + Math.random() * 5, h: 8 + Math.random() * 6, c: cols[i % cols.length], life: 1 });
  }
}
function drawFx(dt) {
  fxc.setTransform(DPR, 0, 0, DPR, 0, 0); fxc.clearRect(0, 0, W, H);
  parts = parts.filter((p) => p.life > 0 && p.y < H + 40);
  for (const p of parts) {
    p.vy += 0.22 * dt * 60; p.vx *= 0.99; p.x += p.vx * dt * 60; p.y += p.vy * dt * 60; p.rot += p.vr; p.life -= dt * 0.55;
    fxc.save(); fxc.globalAlpha = Math.max(0, Math.min(1, p.life * 2)); fxc.translate(p.x, p.y); fxc.rotate(p.rot);
    fxc.fillStyle = p.c; fxc.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2))); fxc.restore();
  }
}

// ───────────────────────── Main loop ─────────────────────────
let lastFrame = performance.now();
function frame(now) {
  const dt = Math.min(0.1, Math.max(0, (now - lastFrame) / 1000)); lastFrame = now;
  world.hype += (world.hypeTarget - world.hype) * (1 - Math.exp(-(world.hypeTarget > world.hype ? 1.4 : 0.9) * dt));
  world.t += dt * (1 + world.boost * 3); world.boost *= Math.exp(-dt * 1.6);
  drawBackground(world.t, world.hype);
  const pose = mascot.update(now / 1000);
  const c = document.querySelector(".screen.active canvas.mascot"); if (c) paintMascot(c, pose);
  drawFx(dt);
  requestAnimationFrame(frame);
}

// ───────────────────────── UI ─────────────────────────
const $ = (id) => document.getElementById(id);
const svg = (id, cls = "ico") => `<svg class="${cls}"><use href="#${id}"/></svg>`;
let screen = "menu", game = null, wgame = null, src = null;

const ui = {
  coins() { document.querySelectorAll(".coinCount").forEach((e) => (e.textContent = wallet.coins)); },
  soundIcon() { $("soundBtn").innerHTML = svg(sound.on ? "i-sound" : "i-mute"); },
  texts() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach((e) => (e.textContent = t(e.dataset.t)));
    $("langCode").textContent = lang.toUpperCase();
    $("title1").textContent = L().title[0]; $("title2").textContent = L().title[1];
  },
  menuStats() {
    $("statBest").textContent = store.get(`best.relaxed.${lang}`, 0);
    $("statStreak").textContent = progress.bestStreak; $("statWords").textContent = progress.totalWords;
  },
};

function show(name) {
  screen = name;
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === name));
  if (name === "menu") { ui.menuStats(); mascot.set("idle"); world.setStreak(0); }
}

function toast(id, text, kind = "bad") {
  const el = $(id); el.textContent = text; el.className = "toast show " + kind;
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 1700);
}

function buildKeyboard(el, onKey, onBack) {
  const rows = L().rows; el.innerHTML = "";
  rows.forEach((row, ri) => {
    const r = document.createElement("div"); r.className = "krow";
    for (const ch of row) {
      const b = document.createElement("button"); b.className = "key"; b.textContent = display(ch); b.dataset.k = ch;
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); onKey(ch); flashKey(b); });
      r.appendChild(b);
    }
    if (ri === rows.length - 1) {
      const b = document.createElement("button"); b.className = "key wide"; b.innerHTML = svg("i-back"); b.setAttribute("aria-label", "Backspace");
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); onBack(); flashKey(b); });
      r.appendChild(b);
    }
    el.appendChild(r);
  });
}
function flashKey(b) { b.classList.add("flash"); setTimeout(() => b.classList.remove("flash"), 90); }

function tileSize(n, el) {
  const w = Math.min(50, (el.clientWidth - 6 * (n - 1)) / n);
  return { w, h: Math.min(w * 1.3, 66), f: w * 0.62 };
}

// ── chain game rendering
function renderHearts() {
  const h = $("hearts"); h.innerHTML = "";
  for (let i = 0; i < game.maxLives; i++) h.insertAdjacentHTML("beforeend", svg("i-heart", i < game.lives ? "" : "lost"));
}
function renderChain() {
  const c = $("chain"), last = game.chain.slice(-4);
  c.innerHTML = last.map((e, i) => {
    const w = display(e.word), body = w.slice(0, -1), end = w.slice(-1);
    const op = 0.35 + 0.65 * ((i + 1) / last.length);
    return `<div class="word${e.skipped ? " skipped" : ""}${i === last.length - 1 && e.fresh ? " new" : ""}" style="opacity:${op}">${body}<i>${end}</i></div>`;
  }).join("");
  game.chain.forEach((e) => (e.fresh = false));
}
function renderTiles() {
  const el = $("tiles"), n = game.targetLength, { w, h, f } = tileSize(n, el);
  let html = "";
  for (let i = 0; i < n; i++) {
    const letter = i === 0 ? game.requiredFirst : game.typed[i - 1];
    const cursor = i > 0 && i - 1 === game.typed.length;
    const cls = ["tile", i === 0 ? "first" : "", letter && i > 0 ? "filled" : "", cursor ? "cursor" : "", i > 0 && !letter && game.pendingPrize ? game.pendingPrize : ""].join(" ");
    const inner = letter ? display(letter) : cursor && game.hintLetter ? `<span class="hint">${display(game.hintLetter)}</span>` : "";
    html += `<div class="${cls}" style="width:${w}px;height:${h}px;font-size:${f}px">${inner}</div>`;
  }
  el.innerHTML = html;
}
function renderGame() {
  $("score").textContent = game.score;
  $("mult").textContent = "x" + coinMultiplier(game.streak);
  $("streakNum").textContent = game.streak;
  $("shieldChip").hidden = !game.freeShield;
  $("lenChip").innerHTML = `${t("letters", game.targetLength)} ${svg(game.risingTrend ? "i-up" : "i-down")}`;
  $("skipBtn").hidden = !game.canSkip;
  $("hintBtn").disabled = !!game.hintLetter || game.isOver;
  renderHearts(); renderChain(); renderTiles();
}

async function withLexicon(fn) {
  if (src && src.code === lang) return fn();
  $("loading").hidden = false; $("loading").querySelector("p").textContent = t("loading");
  try { src = new WordSource(lang, await loadLexicon(lang)); $("loading").hidden = true; fn(); }
  catch (e) { console.error(e); $("loading").querySelector("p").textContent = t("loadFail"); setTimeout(() => ($("loading").hidden = true), 2200); }
}

function startGame(challenge) {
  sound.init(); sound.play("sfx_click", 0.6);
  withLexicon(() => {
    game = new ChainGame(src, { challenge });
    $("modeTag").textContent = challenge ? t("challenge") : t("relaxed");
    buildKeyboard($("kb"), chainKey, chainBack);
    show("game"); world.setStreak(0); mascot.set("idle"); renderGame();
  });
}

function chainKey(ch) {
  if (!game || game.isOver) return;
  const r = game.type(ch); if (!r) return;
  sound.play("sfx_key", 0.5, 0.95 + Math.random() * 0.1);
  if (r.kind === "typed") { mascot.set("thinking"); renderTiles(); return; }
  handleChainResult(r);
}
function chainBack() { if (!game) return; game.backspace(); if (!game.typed.length) mascot.set("idle"); renderTiles(); }

function handleChainResult(r) {
  if (r.kind === "typo") { toast("toast", t("typo"), "gold"); sound.play("sfx_used", 0.7); mascot.set("thinking"); renderTiles(); return; }
  if (r.kind === "accepted") {
    game.chain[game.chain.length - 1].fresh = true;
    burst($("tiles"), 26, r.big); world.kick(r.big ? 1.6 : 1); world.setStreak(game.streak);
    sound.play("sfx_accept_confetti", 0.8); sound.play("voice_blob", 0.6);
    if (r.big) { sound.play("cel_blob", 0.7); mascot.set("celebrate", 1.8); } else mascot.set("happy", 1.1);
    if (r.prize) { sound.play("sfx_prize_" + r.prize, 0.8); toast("toast", `+${r.points}   +${r.coins + r.prizeCoins}`, "gold"); }
    else toast("toast", `+${r.points}`, "good");
    if (r.shieldEarned) setTimeout(() => { toast("toast", t("shieldEarned"), "good"); sound.play("sfx_unlock", 0.6); }, 700);
    if (r.lifeRestored) setTimeout(() => { toast("toast", t("lifeHealed"), "good"); sound.play("sfx_lifeheal", 0.7); }, 400);
    $("score").classList.remove("bump"); void $("score").offsetWidth; $("score").classList.add("bump");
    renderGame(); return;
  }
  // rejected
  const tiles = $("tiles"); tiles.classList.remove("shake"); void tiles.offsetWidth; tiles.classList.add("shake");
  mascot.set("sad", 1.2);
  if (r.reason === "alreadyUsed") { toast("toast", t("alreadyUsed")); sound.play("sfx_used", 0.7); renderGame(); return; }
  sound.play("sfx_wrong", 0.7); sound.play("sfx_lifelost", 0.5);
  toast("toast", r.streakResult === "shield" ? t("shieldSaved") : t("notAWord"), r.streakResult === "shield" ? "good" : "bad");
  world.setStreak(game.streak);
  renderGame();
  const hearts = $("hearts").children; if (hearts[game.lives]) hearts[game.lives].classList.add("pop");
  if (r.over) setTimeout(endChainGame, 900);
}

function endChainGame() {
  sound.play(game.isNewBest ? "sfx_win" : "sfx_gameover", 0.8);
  mascot.set(game.isNewBest ? "celebrate" : "sad");
  if (game.isNewBest) burst($("endSheet"), 50, true);
  $("endTitle").textContent = t("gameOver");
  $("endBest").hidden = !game.isNewBest; $("endBest").textContent = t("newBest");
  $("endStats").innerHTML = [
    [t("score"), game.score], [t("best"), game.bestScore], [t("words"), game.chain.filter((e) => !e.skipped).length], [t("coins"), "+" + game.coinsEarned],
    [t("streak"), game.bestStreakThisGame], [t("longest"), game.longest ? display(game.longest) : "-"],
  ].map(([k, v]) => `<div><b>${v}</b><small>${k}</small></div>`).join("");
  $("endChain").innerHTML = game.chain.map((e) => `<span>${display(e.word)}</span>`).join("");
  $("againBtn").onclick = () => { $("endSheet").hidden = true; startGame(game.challenge); };
  $("endSheet").hidden = false;
}

// ── secret word rendering
function renderWord() {
  const g = wgame;
  $("guessDots").innerHTML = Array.from({ length: g.maxGuesses }, (_, i) => `<i class="${i < g.guessesUsed ? "used" : ""}"></i>`).join("");
  $("changesLeft").textContent = g.changesLeft;
  $("target").innerHTML = g.target.map((c, i) => `<div class="tile ${i < g.round ? "done" : i === g.round && !g.isOver ? "now" : ""}">${display(c)}</div>`).join("");
  const last = g.words.slice(-3);
  $("wchain").innerHTML = last.map((w, i) => { const d = display(w); return `<div class="word" style="opacity:${0.4 + 0.6 * ((i + 1) / last.length)}">${d.slice(0, -1)}<i>${d.slice(-1)}</i></div>`; }).join("");
  const el = $("wtiles");
  if (g.isOver) { el.innerHTML = ""; }
  else {
    const n = g.length, { w, h, f } = tileSize(n, el); let html = "", k = 0;
    for (let i = 0; i < n; i++) {
      const style = `style="width:${w}px;height:${h}px;font-size:${f}px"`;
      if (i === 0 && g.first) { html += `<div class="tile first" ${style}>${display(g.first)}</div>`; continue; }
      if (i === n - 1) { html += `<div class="tile locked" ${style}>${display(g.needed)}${svg("i-lock", "lk")}</div>`; continue; }
      const letter = g.typed[k], cursor = k === g.typed.length; k++;
      html += `<div class="tile ${letter ? "filled" : ""} ${cursor ? "cursor" : ""}" ${style}>${letter ? display(letter) : ""}</div>`;
    }
    el.innerHTML = html;
  }
  $("wLen").disabled = !g.canChangeLength; $("wFirst").disabled = !g.canChangeFirst;
}
function startWord() {
  sound.init(); sound.play("sfx_click", 0.6);
  withLexicon(() => {
    wgame = new SecretWordGame(src);
    buildKeyboard($("wkb"), wordKey, () => { wgame.backspace(); renderWord(); });
    show("word"); mascot.set("idle"); renderWord();
    if (!store.get("seenWordHelp", false)) { store.set("seenWordHelp", true); $("helpSheet").hidden = false; }
  });
}
function wordKey(ch) {
  if (!wgame || wgame.isOver) return;
  const r = wgame.type(ch); if (!r) return;
  sound.play("sfx_key", 0.5, 0.95 + Math.random() * 0.1);
  if (r.kind === "typed") { mascot.set("thinking"); renderWord(); return; }
  if (r.kind === "accepted") {
    burst($("wtiles"), 26, r.won); world.kick(1); sound.play("sfx_accept_confetti", 0.8); sound.play("voice_blob", 0.6);
    mascot.set(r.won ? "celebrate" : "happy", r.won ? null : 1.1); toast("wtoast", display(r.word), "good");
  } else {
    const el = $("wtiles"); el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
    sound.play("sfx_wrong", 0.7); mascot.set("sad", 1.2); toast("wtoast", t(r.reason));
  }
  renderWord();
  if (wgame.isOver) setTimeout(endWord, 900);
}
function endWord() {
  const g = wgame, won = g.status === "won";
  sound.play(won ? "sfx_win" : "sfx_gameover", 0.8); mascot.set(won ? "celebrate" : "sad");
  if (won) { burst($("endSheet"), 50, true); sound.play("cel_blob", 0.7); }
  $("endTitle").textContent = won ? t("won") : t("lost"); $("endBest").hidden = true;
  $("endStats").innerHTML = [[t("secretWas"), display(g.target.join(""))], [t("guesses"), `${won ? g.guessesUsed : "X"}/${g.maxGuesses}`]]
    .concat(won ? [[t("coins"), "+" + (50 + 10 * g.guessesLeft)]] : [])
    .map(([k, v]) => `<div><b>${v}</b><small>${k}</small></div>`).join("");
  $("endChain").innerHTML = g.words.map((w) => `<span>${display(w)}</span>`).join("");
  $("againBtn").onclick = () => { $("endSheet").hidden = true; startWord(); };
  $("endSheet").hidden = false;
}

// ── language sheet
function openLanguages() {
  sound.init(); sound.play("sfx_click", 0.5);
  $("langList").innerHTML = LANG_ORDER.map((c) => `<button data-l="${c}" class="${c === lang ? "on" : ""}"><span>${LANGS[c].name}</span><span>${c.toUpperCase()}</span></button>`).join("");
  $("langSheet").hidden = false;
}
$("langList").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  lang = b.dataset.l; store.set("lang", lang); refreshFloating(); ui.texts(); ui.menuStats(); $("langSheet").hidden = true;
  loadLexicon(lang).catch(() => {}); // warm up
});
$("langSheet").addEventListener("click", (e) => { if (e.target === $("langSheet")) $("langSheet").hidden = true; });

// ── wiring
$("langBtn").onclick = openLanguages;
$("soundBtn").onclick = () => { sound.init(); sound.toggle(); };
$("playBtn").onclick = () => startGame(false);
$("challengeBtn").onclick = () => startGame(true);
$("wordBtn").onclick = startWord;
$("homeBtn").onclick = () => { sound.play("sfx_click", 0.5); if (game && !game.isOver && game.chain.length) game.finish(); show("menu"); };
$("wordHome").onclick = () => { sound.play("sfx_click", 0.5); show("menu"); };
$("endMenuBtn").onclick = () => { $("endSheet").hidden = true; show("menu"); };
$("wordHelpBtn").onclick = () => ($("helpSheet").hidden = false);
$("helpOk").onclick = () => ($("helpSheet").hidden = true);
$("lenBtn").onclick = () => { if (game.changeLength()) { sound.play("sfx_coin", 0.6); mascot.set("thinking"); renderGame(); } else toast("toast", t("noCoins")); };
$("hintBtn").onclick = () => { if (game.hint()) { sound.play("sfx_coin", 0.6); renderTiles(); renderGame(); } else if (wallet.coins < 20) toast("toast", t("noCoins")); };
$("skipBtn").onclick = () => { if (game.skip()) { sound.play("sfx_coin", 0.6); mascot.set("happy", 0.9); game.chain[game.chain.length - 1].fresh = true; renderGame(); } else toast("toast", t("noCoins")); };
$("wLen").onclick = () => { if (wgame.changeLength()) { sound.play("sfx_click", 0.6); renderWord(); } };
$("wFirst").onclick = () => { if (wgame.changeFirst()) { sound.play("sfx_click", 0.6); renderWord(); } };

// Physical keyboard
function normalize(k) {
  if (k.length !== 1) return null;
  let c = lang === "tr" ? k.toLocaleLowerCase("tr-TR") : k.toLocaleLowerCase(L().locale);
  if (L().letters.includes(c)) return c;
  c = c.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return L().letters.includes(c) ? c : null;
}
window.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (!$("endSheet").hidden || !$("langSheet").hidden || !$("helpSheet").hidden) { if (e.key === "Escape") { $("langSheet").hidden = true; $("helpSheet").hidden = true; } return; }
  const active = screen === "game" ? [chainKey, chainBack, "kb"] : screen === "word" ? [wordKey, () => { wgame.backspace(); renderWord(); }, "wkb"] : null;
  if (!active) { if (e.key === "Enter") startGame(false); return; }
  if (e.key === "Backspace") { e.preventDefault(); active[1](); return; }
  const c = normalize(e.key); if (!c) return;
  e.preventDefault(); active[0](c);
  const b = $(active[2]).querySelector(`[data-k="${CSS.escape(c)}"]`); if (b) flashKey(b);
});
window.addEventListener("resize", () => { resize(); if (screen === "game" && game) renderTiles(); if (screen === "word" && wgame) renderWord(); });
document.addEventListener("visibilitychange", () => { if (sound.ctx) document.hidden ? sound.ctx.suspend() : sound.ctx.resume(); });

// boot
resize(); refreshFloating(); ui.texts(); ui.coins(); ui.soundIcon(); ui.menuStats();
requestAnimationFrame(frame);
loadLexicon(lang).catch(() => {});
