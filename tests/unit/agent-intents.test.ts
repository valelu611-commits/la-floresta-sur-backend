import { describe, expect, it } from "vitest";
import { detectIntents, keywordsFromQuestion, normalize } from "../../src/agent/intents.js";

describe("intenciones del agente", () => {
  it("normaliza tildes y mayusculas", () => {
    expect(normalize("¿Dónde hay VETERINARIAS?")).toBe("donde hay veterinarias");
  });

  it("detecta categorias por sinonimos", () => {
    expect(detectIntents("donde puedo llevar a mi perro al veterinario")).toContain("veterinarias");
    expect(detectIntents("hay huecos y obras en la calle 50 sur")).toContain("malla-vial");
    expect(detectIntents("que estaciones de transmilenio quedan cerca")).toContain("transporte");
  });

  it("encuentra varias categorias en una pregunta cruzada", () => {
    const intents = detectIntents("quiero saber de robos y tambien de camaras de seguridad");
    expect(intents).toContain("seguridad");
    expect(intents).toContain("camaras");
  });

  it("devuelve arreglo vacio si no reconoce el tema", () => {
    expect(detectIntents("cual es la capital de Francia")).toEqual([]);
  });

  it("extrae palabras utiles sin palabras vacias", () => {
    const words = keywordsFromQuestion("donde estan las panaderias del barrio");
    expect(words).not.toContain("donde");
    expect(words).toContain("panaderias");
  });
});
