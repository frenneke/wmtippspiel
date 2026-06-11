import { getStore } from "@netlify/blobs";

const KEY = "state";

function clamp(v) {
  v = parseInt(v, 10);
  if (isNaN(v)) v = 0;
  return Math.max(0, Math.min(99, v));
}

function json(obj) {
  return new Response(JSON.stringify(obj), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function commit(store, state) {
  state.rev = (state.rev || 0) + 1;
  await store.setJSON(KEY, state);
}

export default async (req) => {
  const store = getStore("wm2026-tippspiel");
  let state = await store.get(KEY, { type: "json" });
  if (!state) state = { players: [], tips: {}, results: {}, rev: 0 };

  if (req.method === "GET") return json(state);

  let body = {};
  try { body = await req.json(); } catch (e) {}
  const act = body.action;

  if (act === "get") return json(state);

  // Mitspieler hinzufügen
  if (act === "addPlayer") {
    const name = (body.name || "").trim();
    if (name && !state.players.some((p) => p.toLowerCase() === name.toLowerCase())) {
      state.players.push(name);
      if (!state.tips[name]) state.tips[name] = {};
      await commit(store, state);
    }
    return json(state);
  }

  // Mitspieler entfernen
  if (act === "removePlayer") {
    state.players = state.players.filter((p) => p !== body.name);
    delete state.tips[body.name];
    await commit(store, state);
    return json(state);
  }

  // Tipp setzen – Sperre: ein bereits abgegebener Tipp wird NIE überschrieben
  if (act === "setTip") {
    const p = body.player;
    const no = body.no;
    if (p && state.players.includes(p) && no != null) {
      if (!state.tips[p]) state.tips[p] = {};
      if (!state.tips[p][no]) {
        state.tips[p][no] = { h: clamp(body.h), a: clamp(body.a), locked: true };
        await commit(store, state);
      }
    }
    return json(state);
  }

  // Offizielles Ergebnis setzen oder (bei leer) löschen
  if (act === "setResult") {
    const no = body.no;
    if (no != null) {
      if (body.h === "" || body.h == null || body.a === "" || body.a == null) {
        delete state.results[no];
      } else {
        state.results[no] = { h: clamp(body.h), a: clamp(body.a) };
      }
      await commit(store, state);
    }
    return json(state);
  }

  return json(state);
};
