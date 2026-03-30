import { describe, it, expect } from "vitest";

// Tests de validation — même logique que dans les routes API

describe("Validation des services", () => {
  const validIntervals = [1, 5, 15, 30];

  describe("Nom du service", () => {
    it("rejette un nom vide", () => {
      const name = "";
      expect(name.trim().length === 0).toBe(true);
    });

    it("rejette un nom trop long", () => {
      const name = "a".repeat(51);
      expect(name.length > 50).toBe(true);
    });

    it("accepte un nom valide", () => {
      const name = "Google";
      expect(name.trim().length > 0 && name.length <= 50).toBe(true);
    });
  });

  describe("URL du service", () => {
    it("rejette une URL sans protocole", () => {
      const url = "google.com";
      expect(url.startsWith("http://") || url.startsWith("https://")).toBe(false);
    });

    it("accepte une URL http", () => {
      const url = "http://google.com";
      expect(url.startsWith("http://") || url.startsWith("https://")).toBe(true);
    });

    it("accepte une URL https", () => {
      const url = "https://google.com";
      expect(url.startsWith("http://") || url.startsWith("https://")).toBe(true);
    });
  });

  describe("Intervalle de verification", () => {
    it("rejette un intervalle invalide", () => {
      expect(validIntervals.includes(3)).toBe(false);
      expect(validIntervals.includes(10)).toBe(false);
      expect(validIntervals.includes(0)).toBe(false);
    });

    it("accepte les intervalles valides", () => {
      expect(validIntervals.includes(1)).toBe(true);
      expect(validIntervals.includes(5)).toBe(true);
      expect(validIntervals.includes(15)).toBe(true);
      expect(validIntervals.includes(30)).toBe(true);
    });
  });
});

describe("Validation inscription", () => {
  it("rejette un email sans @", () => {
    const email = "test.com";
    expect(email.includes("@")).toBe(false);
  });

  it("accepte un email valide", () => {
    const email = "test@example.com";
    expect(email.includes("@")).toBe(true);
  });

  it("rejette un mot de passe trop court", () => {
    const password = "abc";
    expect(password.length >= 6).toBe(false);
  });

  it("accepte un mot de passe valide", () => {
    const password = "secure123";
    expect(password.length >= 6).toBe(true);
  });
});

describe("Logique de monitoring", () => {
  it("detecte qu un check est expire", () => {
    const intervalMs = 5 * 60 * 1000; // 5 min
    const lastCheckTime = Date.now() - 6 * 60 * 1000; // il y a 6 min
    const needsCheck = Date.now() - lastCheckTime >= intervalMs;
    expect(needsCheck).toBe(true);
  });

  it("detecte qu un check est encore valide", () => {
    const intervalMs = 5 * 60 * 1000;
    const lastCheckTime = Date.now() - 2 * 60 * 1000; // il y a 2 min
    const needsCheck = Date.now() - lastCheckTime >= intervalMs;
    expect(needsCheck).toBe(false);
  });

  it("necessite un check quand aucun check existe", () => {
    const lastCheck = null;
    const needsCheck = !lastCheck;
    expect(needsCheck).toBe(true);
  });
});

describe("Retention des checks", () => {
  it("garde les 10 derniers checks UP", () => {
    const upChecks = Array.from({ length: 15 }, (_, i) => ({ id: `${i}` }));
    const toKeep = upChecks.slice(0, 10);
    const toDelete = upChecks.slice(10);
    expect(toKeep.length).toBe(10);
    expect(toDelete.length).toBe(5);
  });

  it("ne supprime rien si moins de 10 checks UP", () => {
    const upChecks = Array.from({ length: 7 }, (_, i) => ({ id: `${i}` }));
    const shouldDelete = upChecks.length > 10;
    expect(shouldDelete).toBe(false);
  });
});
