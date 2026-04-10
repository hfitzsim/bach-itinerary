var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-QCtxTw/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// dist/server/bach-itinerary.js
import { DurableObject as Ge } from "cloudflare:workers";
var Be = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
var Ke = /* @__PURE__ */ __name((n = 21) => {
  let o = "", i = crypto.getRandomValues(new Uint8Array(n |= 0));
  for (; n--; )
    o += Be[i[n] & 63];
  return o;
}, "Ke");
if (!("OPEN" in WebSocket)) {
  const n = {
    CONNECTING: WebSocket.READY_STATE_CONNECTING,
    OPEN: WebSocket.READY_STATE_OPEN,
    CLOSING: WebSocket.READY_STATE_CLOSING,
    CLOSED: WebSocket.READY_STATE_CLOSED
  };
  Object.assign(WebSocket, n), Object.assign(WebSocket.prototype, n);
}
function We(n) {
  try {
    const o = WebSocket.prototype.deserializeAttachment.call(n);
    if (!o || typeof o != "object" || !("__pk" in o)) return null;
    const i = o.__pk;
    if (!i || typeof i != "object") return null;
    const { id: c, tags: m } = i;
    if (typeof c != "string") return null;
    const { uri: E } = i;
    return {
      id: c,
      tags: Array.isArray(m) ? m : [],
      uri: typeof E == "string" ? E : void 0
    };
  } catch {
    return null;
  }
}
__name(We, "We");
function ue(n) {
  return We(n) !== null;
}
__name(ue, "ue");
var Ve = class {
  static {
    __name(this, "Ve");
  }
  #t = /* @__PURE__ */ new WeakMap();
  get(n) {
    let o = this.#t.get(n);
    if (!o)
      if (o = WebSocket.prototype.deserializeAttachment.call(n), o !== void 0) this.#t.set(n, o);
      else throw new Error("Missing websocket attachment. This is most likely an issue in PartyServer, please open an issue at https://github.com/cloudflare/partykit/issues");
    return o;
  }
  set(n, o) {
    this.#t.set(n, o), WebSocket.prototype.serializeAttachment.call(n, o);
  }
};
var V = new Ve();
var Ie = /* @__PURE__ */ new WeakSet();
var Fe = /* @__PURE__ */ __name((n) => Ie.has(n), "Fe");
var F = /* @__PURE__ */ __name((n) => {
  if (Fe(n)) return n;
  let o;
  "state" in n && (o = n.state, delete n.state);
  const i = Object.defineProperties(n, {
    id: {
      configurable: true,
      get() {
        return V.get(n).__pk.id;
      }
    },
    uri: {
      configurable: true,
      get() {
        return V.get(n).__pk.uri ?? null;
      }
    },
    tags: {
      configurable: true,
      get() {
        return V.get(n).__pk.tags ?? [];
      }
    },
    socket: {
      configurable: true,
      get() {
        return n;
      }
    },
    state: {
      configurable: true,
      get() {
        return n.deserializeAttachment();
      }
    },
    setState: {
      configurable: true,
      value: /* @__PURE__ */ __name(function(c) {
        let m;
        return c instanceof Function ? m = c(this.state) : m = c, n.serializeAttachment(m), m;
      }, "value")
    },
    deserializeAttachment: {
      configurable: true,
      value: /* @__PURE__ */ __name(function() {
        return V.get(n).__user ?? null;
      }, "value")
    },
    serializeAttachment: {
      configurable: true,
      value: /* @__PURE__ */ __name(function(m) {
        const E = {
          ...V.get(n),
          __user: m ?? null
        };
        V.set(n, E);
      }, "value")
    }
  });
  return o && i.setState(o), Ie.add(i), i;
}, "F");
var Xe = class {
  static {
    __name(this, "Xe");
  }
  index = 0;
  sockets;
  constructor(n, o) {
    this.state = n, this.tag = o;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    const n = this.sockets ?? (this.sockets = this.state.getWebSockets(this.tag));
    let o;
    for (; o = n[this.index++]; ) if (o.readyState === WebSocket.READY_STATE_OPEN) {
      if (!ue(o)) continue;
      return {
        done: false,
        value: F(o)
      };
    }
    return {
      done: true,
      value: void 0
    };
  }
};
function He(n, o) {
  const i = [n, ...o.filter((c) => c !== n)];
  if (i.length > 10) throw new Error("A connection can only have 10 tags, including the default id tag.");
  for (const c of i) {
    if (typeof c != "string") throw new Error(`A connection tag must be a string. Received: ${c}`);
    if (c === "") throw new Error("A connection tag must not be an empty string.");
    if (c.length > 256) throw new Error("A connection tag must not exceed 256 characters");
  }
  return i;
}
__name(He, "He");
var Ze = class {
  static {
    __name(this, "Ze");
  }
  #t = /* @__PURE__ */ new Map();
  tags = /* @__PURE__ */ new WeakMap();
  getCount() {
    return this.#t.size;
  }
  getConnection(n) {
    return this.#t.get(n);
  }
  *getConnections(n) {
    if (!n) {
      yield* this.#t.values().filter((o) => o.readyState === WebSocket.READY_STATE_OPEN);
      return;
    }
    for (const o of this.#t.values()) (this.tags.get(o) ?? []).includes(n) && (yield o);
  }
  accept(n, o) {
    n.accept();
    const i = He(n.id, o.tags);
    this.#t.set(n.id, n), this.tags.set(n, i), Object.defineProperty(n, "tags", {
      get: /* @__PURE__ */ __name(() => i, "get"),
      configurable: true
    });
    const c = /* @__PURE__ */ __name(() => {
      this.#t.delete(n.id), n.removeEventListener("close", c), n.removeEventListener("error", c);
    }, "c");
    return n.addEventListener("close", c), n.addEventListener("error", c), n;
  }
};
var Je = class {
  static {
    __name(this, "Je");
  }
  constructor(n) {
    this.controller = n;
  }
  getCount() {
    let n = 0;
    for (const o of this.controller.getWebSockets()) ue(o) && n++;
    return n;
  }
  getConnection(n) {
    const o = this.controller.getWebSockets(n).filter((i) => We(i)?.id === n);
    if (o.length !== 0) {
      if (o.length === 1) return F(o[0]);
      throw new Error(`More than one connection found for id ${n}. Did you mean to use getConnections(tag) instead?`);
    }
  }
  getConnections(n) {
    return new Xe(this.controller, n);
  }
  accept(n, o) {
    const i = He(n.id, o.tags);
    return this.controller.acceptWebSocket(n, i), n.serializeAttachment({
      __pk: {
        id: n.id,
        tags: i,
        uri: n.uri ?? void 0
      },
      __user: null
    }), F(n);
  }
};
var ve = "__ps_name";
var et = class extends Ge {
  static {
    __name(this, "et");
  }
  static options = { hibernate: false };
  #t = "zero";
  #r = Object.getPrototypeOf(this).constructor;
  #o = this.#r.options.hibernate ? new Je(this.ctx) : new Ze();
  /**
  * Execute SQL queries against the Server's database
  * @template T Type of the returned rows
  * @param strings SQL query template strings
  * @param values Values to be inserted into the query
  * @returns Array of query results
  */
  sql(n, ...o) {
    let i = "";
    try {
      return i = n.reduce((c, m, E) => c + m + (E < o.length ? "?" : ""), ""), [...this.ctx.storage.sql.exec(i, ...o)];
    } catch (c) {
      throw console.error(`failed to execute sql query: ${i}`, c), this.onException(c);
    }
  }
  constructor(n, o) {
    super(n, o);
  }
  /**
  * Handle incoming requests to the server.
  */
  async fetch(n) {
    try {
      const o = n.headers.get("x-partykit-props");
      if (o && (this.#s = JSON.parse(o)), this.#e || await this.#a(), !this.#e) {
        const c = n.headers.get("x-partykit-room");
        if (!c) throw new Error(`Missing namespace or room headers when connecting to ${this.#r.name}.
Did you try connecting directly to this Durable Object? Try using getServerByName(namespace, id) instead.`);
        await this.setName(c);
      }
      await this.#n();
      const i = new URL(n.url);
      if (n.headers.get("Upgrade")?.toLowerCase() !== "websocket") return await this.onRequest(n);
      {
        const { 0: c, 1: m } = new WebSocketPair();
        let E = i.searchParams.get("_pk");
        E || (E = Ke());
        let C = Object.assign(m, {
          id: E,
          uri: n.url,
          server: this.name,
          tags: [],
          state: null,
          setState(L) {
            let N;
            return L instanceof Function ? N = L(this.state) : N = L, this.state = N, this.state;
          }
        });
        const j = { request: n }, H = await this.getConnectionTags(C, j);
        return C = this.#o.accept(C, { tags: H }), this.#r.options.hibernate || this.#u(C), await this.onConnect(C, j), new Response(null, {
          status: 101,
          webSocket: c
        });
      }
    } catch (o) {
      if (console.error(`Error in ${this.#r.name}:${this.#e ?? "<unnamed>"} fetch:`, o), !(o instanceof Error)) throw o;
      if (n.headers.get("Upgrade") === "websocket") {
        const i = new WebSocketPair();
        return i[1].accept(), i[1].send(JSON.stringify({ error: o.stack })), i[1].close(1011, "Uncaught exception during session setup"), new Response(null, {
          status: 101,
          webSocket: i[0]
        });
      } else return new Response(o.stack, { status: 500 });
    }
  }
  async webSocketMessage(n, o) {
    if (ue(n))
      try {
        const i = F(n);
        return await this.#n(), i.server = this.name, this.onMessage(i, o);
      } catch (i) {
        console.error(`Error in ${this.#r.name}:${this.#e ?? "<unnamed>"} webSocketMessage:`, i);
      }
  }
  async webSocketClose(n, o, i, c) {
    if (ue(n))
      try {
        const m = F(n);
        return await this.#n(), m.server = this.name, this.onClose(m, o, i, c);
      } catch (m) {
        console.error(`Error in ${this.#r.name}:${this.#e ?? "<unnamed>"} webSocketClose:`, m);
      }
  }
  async webSocketError(n, o) {
    if (ue(n))
      try {
        const i = F(n);
        return await this.#n(), i.server = this.name, this.onError(i, o);
      } catch (i) {
        console.error(`Error in ${this.#r.name}:${this.#e ?? "<unnamed>"} webSocketError:`, i);
      }
  }
  async #a() {
    if (this.#e) return;
    const n = await this.ctx.storage.get(ve);
    n && (this.#e = n);
  }
  /**
  * @internal — Do not use directly. This is an escape hatch for frameworks
  * (like Agents) that receive calls via native DO RPC, bypassing the
  * standard fetch/alarm/webSocket entry points where initialization
  * normally happens. Calling this from application code is unsupported
  * and may break without notice.
  */
  async __unsafe_ensureInitialized() {
    await this.#n();
  }
  async #n() {
    if (this.#t === "started") return;
    await this.#a();
    let n;
    if (await this.ctx.blockConcurrencyWhile(async () => {
      this.#t = "starting";
      try {
        await this.onStart(this.#s), this.#t = "started";
      } catch (o) {
        this.#t = "zero", n = o;
      }
    }), n) throw n;
  }
  #u(n) {
    const o = /* @__PURE__ */ __name((m) => {
      this.onMessage(n, m.data)?.catch((E) => {
        console.error("onMessage error:", E);
      });
    }, "o"), i = /* @__PURE__ */ __name((m) => {
      n.removeEventListener("message", o), n.removeEventListener("close", i), this.onClose(n, m.code, m.reason, m.wasClean)?.catch((E) => {
        console.error("onClose error:", E);
      });
    }, "i"), c = /* @__PURE__ */ __name((m) => {
      n.removeEventListener("message", o), n.removeEventListener("error", c), this.onError(n, m.error)?.catch((E) => {
        console.error("onError error:", E);
      });
    }, "c");
    n.addEventListener("close", i), n.addEventListener("error", c), n.addEventListener("message", o);
  }
  #e;
  /**
  * The name for this server. Write-once-only.
  * Hydrated from durable storage by #ensureInitialized() on every
  * entry point (fetch, alarm, webSocketMessage/Close/Error).
  */
  get name() {
    if (!this.#e) throw new Error(`Attempting to read .name on ${this.#r.name} before it was set. The name can be set by explicitly calling .setName(name) on the stub, or by using routePartyKitRequest(). This is a known issue and will be fixed soon. Follow https://github.com/cloudflare/workerd/issues/2240 for more updates.`);
    return this.#e;
  }
  async setName(n, o) {
    if (!n) throw new Error("A name is required.");
    if (this.#e && this.#e !== n) throw new Error(`This server already has a name: ${this.#e}, attempting to set to: ${n}`);
    o !== void 0 && (this.#s = o), this.#e !== n && (this.#e = n, await this.ctx.storage.put(ve, n), await this.#n());
  }
  /**
  * @internal Sets name/props and handles a request in a single RPC call.
  * Used by routePartykitRequest to avoid an extra round trip.
  */
  async _initAndFetch(n, o, i) {
    if (o !== void 0 && (this.#s = o), this.#e && this.#e !== n) throw new Error(`This server already has a name: ${this.#e}, attempting to set to: ${n}`);
    return this.#e || (this.#e = n, await this.ctx.storage.put(ve, n)), this.fetch(i);
  }
  #i(n, o) {
    try {
      n.send(o);
    } catch {
      n.close(1011, "Unexpected error");
    }
  }
  /** Send a message to all connected clients, except connection ids listed in `without` */
  broadcast(n, o) {
    for (const i of this.#o.getConnections()) (!o || !o.includes(i.id)) && this.#i(i, n);
  }
  /** Get a connection by connection id */
  getConnection(n) {
    return this.#o.getConnection(n);
  }
  /**
  * Get all connections. Optionally, you can provide a tag to filter returned connections.
  * Use `Server#getConnectionTags` to tag the connection on connect.
  */
  getConnections(n) {
    return this.#o.getConnections(n);
  }
  /**
  * You can tag a connection to filter them in Server#getConnections.
  * Each connection supports up to 9 tags, each tag max length is 256 characters.
  */
  getConnectionTags(n, o) {
    return [];
  }
  #s;
  /**
  * Called when the server is started for the first time.
  */
  onStart(n) {
  }
  /**
  * Called when a new connection is made to the server.
  */
  onConnect(n, o) {
  }
  /**
  * Called when a message is received from a connection.
  */
  onMessage(n, o) {
  }
  /**
  * Called when a connection is closed.
  */
  onClose(n, o, i, c) {
  }
  /**
  * Called when an error occurs on a connection.
  */
  onError(n, o) {
    console.error(`Error on connection ${n.id} in ${this.#r.name}:${this.name}:`, o), console.info(`Implement onError on ${this.#r.name} to handle this error.`);
  }
  /**
  * Called when a request is made to the server.
  */
  onRequest(n) {
    return console.warn(`onRequest hasn't been implemented on ${this.#r.name}:${this.name} responding to ${n.url}`), new Response("Not implemented", { status: 404 });
  }
  /**
  * Called when an exception occurs.
  * @param error - The error that occurred.
  */
  onException(n) {
    console.error(`Exception in ${this.#r.name}:${this.name}:`, n), console.info(`Implement onException on ${this.#r.name} to handle this error.`);
  }
  onAlarm() {
    console.log(`Implement onAlarm on ${this.#r.name} to handle alarms.`);
  }
  async alarm() {
    await this.#n(), await this.onAlarm();
  }
};
var ge = { exports: {} };
var ae = { exports: {} };
ae.exports;
var De;
function rt() {
  return De || (De = 1, (function(n, o) {
    (function() {
      function i(e, r) {
        Object.defineProperty(E.prototype, e, {
          get: /* @__PURE__ */ __name(function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              r[0],
              r[1]
            );
          }, "get")
        });
      }
      __name(i, "i");
      function c(e) {
        return e === null || typeof e != "object" ? null : (e = we && e[we] || e["@@iterator"], typeof e == "function" ? e : null);
      }
      __name(c, "c");
      function m(e, r) {
        e = (e = e.constructor) && (e.displayName || e.name) || "ReactClass";
        var s = e + "." + r;
        be[s] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          r,
          e
        ), be[s] = true);
      }
      __name(m, "m");
      function E(e, r, s) {
        this.props = e, this.context = r, this.refs = ye, this.updater = s || Te;
      }
      __name(E, "E");
      function C() {
      }
      __name(C, "C");
      function j(e, r, s) {
        this.props = e, this.context = r, this.refs = ye, this.updater = s || Te;
      }
      __name(j, "j");
      function H() {
      }
      __name(H, "H");
      function L(e) {
        return "" + e;
      }
      __name(L, "L");
      function N(e) {
        try {
          L(e);
          var r = false;
        } catch {
          r = true;
        }
        if (r) {
          r = console;
          var s = r.error, u = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
          return s.call(
            r,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            u
          ), L(e);
        }
      }
      __name(N, "N");
      function q(e) {
        if (e == null) return null;
        if (typeof e == "function")
          return e.$$typeof === Ue ? null : e.displayName || e.name || null;
        if (typeof e == "string") return e;
        switch (e) {
          case t:
            return "Fragment";
          case h:
            return "Profiler";
          case a:
            return "StrictMode";
          case T:
            return "Suspense";
          case A:
            return "SuspenseList";
          case Ee:
            return "Activity";
        }
        if (typeof e == "object")
          switch (typeof e.tag == "number" && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), e.$$typeof) {
            case le:
              return "Portal";
            case v:
              return e.displayName || "Context";
            case l:
              return (e._context.displayName || "Context") + ".Consumer";
            case w:
              var r = e.render;
              return e = e.displayName, e || (e = r.displayName || r.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
            case R:
              return r = e.displayName || null, r !== null ? r : q(e.type) || "Memo";
            case $:
              r = e._payload, e = e._init;
              try {
                return q(e(r));
              } catch {
              }
          }
        return null;
      }
      __name(q, "q");
      function X(e) {
        if (e === t) return "<>";
        if (typeof e == "object" && e !== null && e.$$typeof === $)
          return "<...>";
        try {
          var r = q(e);
          return r ? "<" + r + ">" : "<...>";
        } catch {
          return "<...>";
        }
      }
      __name(X, "X");
      function ie() {
        var e = g.A;
        return e === null ? null : e.getOwner();
      }
      __name(ie, "ie");
      function Z() {
        return Error("react-stack-top-frame");
      }
      __name(Z, "Z");
      function J(e) {
        if (he.call(e, "key")) {
          var r = Object.getOwnPropertyDescriptor(e, "key").get;
          if (r && r.isReactWarning) return false;
        }
        return e.key !== void 0;
      }
      __name(J, "J");
      function ce(e, r) {
        function s() {
          Ce || (Ce = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            r
          ));
        }
        __name(s, "s");
        s.isReactWarning = true, Object.defineProperty(e, "key", {
          get: s,
          configurable: true
        });
      }
      __name(ce, "ce");
      function D() {
        var e = q(this.type);
        return Oe[e] || (Oe[e] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        )), e = this.props.ref, e !== void 0 ? e : null;
      }
      __name(D, "D");
      function Q(e, r, s, u, f, y) {
        var d = s.ref;
        return e = {
          $$typeof: B,
          type: e,
          key: r,
          props: s,
          _owner: u
        }, (d !== void 0 ? d : null) !== null ? Object.defineProperty(e, "ref", {
          enumerable: false,
          get: D
        }) : Object.defineProperty(e, "ref", { enumerable: false, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        }), Object.defineProperty(e, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        }), Object.defineProperty(e, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: f
        }), Object.defineProperty(e, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: y
        }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
      }
      __name(Q, "Q");
      function ee(e, r) {
        return r = Q(
          e.type,
          r,
          e.props,
          e._owner,
          e._debugStack,
          e._debugTask
        ), e._store && (r._store.validated = e._store.validated), r;
      }
      __name(ee, "ee");
      function x(e) {
        z(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === $ && (e._payload.status === "fulfilled" ? z(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
      }
      __name(x, "x");
      function z(e) {
        return typeof e == "object" && e !== null && e.$$typeof === B;
      }
      __name(z, "z");
      function te(e) {
        var r = { "=": "=0", ":": "=2" };
        return "$" + e.replace(/[=:]/g, function(s) {
          return r[s];
        });
      }
      __name(te, "te");
      function b(e, r) {
        return typeof e == "object" && e !== null && e.key != null ? (N(e.key), te("" + e.key)) : r.toString(36);
      }
      __name(b, "b");
      function fe(e) {
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw e.reason;
          default:
            switch (typeof e.status == "string" ? e.then(H, H) : (e.status = "pending", e.then(
              function(r) {
                e.status === "pending" && (e.status = "fulfilled", e.value = r);
              },
              function(r) {
                e.status === "pending" && (e.status = "rejected", e.reason = r);
              }
            )), e.status) {
              case "fulfilled":
                return e.value;
              case "rejected":
                throw e.reason;
            }
        }
        throw e;
      }
      __name(fe, "fe");
      function M(e, r, s, u, f) {
        var y = typeof e;
        (y === "undefined" || y === "boolean") && (e = null);
        var d = false;
        if (e === null) d = true;
        else
          switch (y) {
            case "bigint":
            case "string":
            case "number":
              d = true;
              break;
            case "object":
              switch (e.$$typeof) {
                case B:
                case le:
                  d = true;
                  break;
                case $:
                  return d = e._init, M(
                    d(e._payload),
                    r,
                    s,
                    u,
                    f
                  );
              }
          }
        if (d) {
          d = e, f = f(d);
          var S = u === "" ? "." + b(d, 0) : u;
          return ke(f) ? (s = "", S != null && (s = S.replace(Pe, "$&/") + "/"), M(f, r, s, "", function(I) {
            return I;
          })) : f != null && (z(f) && (f.key != null && (d && d.key === f.key || N(f.key)), s = ee(
            f,
            s + (f.key == null || d && d.key === f.key ? "" : ("" + f.key).replace(
              Pe,
              "$&/"
            ) + "/") + S
          ), u !== "" && d != null && z(d) && d.key == null && d._store && !d._store.validated && (s._store.validated = 2), f = s), r.push(f)), 1;
        }
        if (d = 0, S = u === "" ? "." : u + ":", ke(e))
          for (var _ = 0; _ < e.length; _++)
            u = e[_], y = S + b(u, _), d += M(
              u,
              r,
              s,
              y,
              f
            );
        else if (_ = c(e), typeof _ == "function")
          for (_ === e.entries && (Ne || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), Ne = true), e = _.call(e), _ = 0; !(u = e.next()).done; )
            u = u.value, y = S + b(u, _++), d += M(
              u,
              r,
              s,
              y,
              f
            );
        else if (y === "object") {
          if (typeof e.then == "function")
            return M(
              fe(e),
              r,
              s,
              u,
              f
            );
          throw r = String(e), Error(
            "Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return d;
      }
      __name(M, "M");
      function G(e, r, s) {
        if (e == null) return e;
        var u = [], f = 0;
        return M(e, u, "", "", function(y) {
          return r.call(s, y, f++);
        }), u;
      }
      __name(G, "G");
      function re(e) {
        if (e._status === -1) {
          var r = e._ioInfo;
          r != null && (r.start = r.end = performance.now()), r = e._result;
          var s = r();
          if (s.then(
            function(f) {
              if (e._status === 0 || e._status === -1) {
                e._status = 1, e._result = f;
                var y = e._ioInfo;
                y != null && (y.end = performance.now()), s.status === void 0 && (s.status = "fulfilled", s.value = f);
              }
            },
            function(f) {
              if (e._status === 0 || e._status === -1) {
                e._status = 2, e._result = f;
                var y = e._ioInfo;
                y != null && (y.end = performance.now()), s.status === void 0 && (s.status = "rejected", s.reason = f);
              }
            }
          ), r = e._ioInfo, r != null) {
            r.value = s;
            var u = s.displayName;
            typeof u == "string" && (r.name = u);
          }
          e._status === -1 && (e._status = 0, e._result = s);
        }
        if (e._status === 1)
          return r = e._result, r === void 0 && console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`,
            r
          ), "default" in r || console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`,
            r
          ), r.default;
        throw e._result;
      }
      __name(re, "re");
      function k() {
        var e = g.H;
        return e === null && console.error(
          `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
        ), e;
      }
      __name(k, "k");
      function ne() {
        g.asyncTransitions--;
      }
      __name(ne, "ne");
      function Y(e) {
        if (pe === null)
          try {
            var r = ("require" + Math.random()).slice(0, 7);
            pe = (n && n[r]).call(
              n,
              "timers"
            ).setImmediate;
          } catch {
            pe = /* @__PURE__ */ __name(function(u) {
              Me === false && (Me = true, typeof MessageChannel > "u" && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var f = new MessageChannel();
              f.port1.onmessage = u, f.port2.postMessage(void 0);
            }, "pe");
          }
        return pe(e);
      }
      __name(Y, "Y");
      function U(e) {
        return 1 < e.length && typeof AggregateError == "function" ? new AggregateError(e) : e[0];
      }
      __name(U, "U");
      function P(e, r) {
        r !== de - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        ), de = r;
      }
      __name(P, "P");
      function W(e, r, s) {
        var u = g.actQueue;
        if (u !== null)
          if (u.length !== 0)
            try {
              oe(u), Y(function() {
                return W(e, r, s);
              });
              return;
            } catch (f) {
              g.thrownErrors.push(f);
            }
          else g.actQueue = null;
        0 < g.thrownErrors.length ? (u = U(g.thrownErrors), g.thrownErrors.length = 0, s(u)) : r(e);
      }
      __name(W, "W");
      function oe(e) {
        if (!_e) {
          _e = true;
          var r = 0;
          try {
            for (; r < e.length; r++) {
              var s = e[r];
              do {
                g.didUsePromise = false;
                var u = s(false);
                if (u !== null) {
                  if (g.didUsePromise) {
                    e[r] = s, e.splice(0, r);
                    return;
                  }
                  s = u;
                } else break;
              } while (true);
            }
            e.length = 0;
          } catch (f) {
            e.splice(0, r + 1), g.thrownErrors.push(f);
          } finally {
            _e = false;
          }
        }
      }
      __name(oe, "oe");
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var B = /* @__PURE__ */ Symbol.for("react.transitional.element"), le = /* @__PURE__ */ Symbol.for("react.portal"), t = /* @__PURE__ */ Symbol.for("react.fragment"), a = /* @__PURE__ */ Symbol.for("react.strict_mode"), h = /* @__PURE__ */ Symbol.for("react.profiler"), l = /* @__PURE__ */ Symbol.for("react.consumer"), v = /* @__PURE__ */ Symbol.for("react.context"), w = /* @__PURE__ */ Symbol.for("react.forward_ref"), T = /* @__PURE__ */ Symbol.for("react.suspense"), A = /* @__PURE__ */ Symbol.for("react.suspense_list"), R = /* @__PURE__ */ Symbol.for("react.memo"), $ = /* @__PURE__ */ Symbol.for("react.lazy"), Ee = /* @__PURE__ */ Symbol.for("react.activity"), we = Symbol.iterator, be = {}, Te = {
        isMounted: /* @__PURE__ */ __name(function() {
          return false;
        }, "isMounted"),
        enqueueForceUpdate: /* @__PURE__ */ __name(function(e) {
          m(e, "forceUpdate");
        }, "enqueueForceUpdate"),
        enqueueReplaceState: /* @__PURE__ */ __name(function(e) {
          m(e, "replaceState");
        }, "enqueueReplaceState"),
        enqueueSetState: /* @__PURE__ */ __name(function(e) {
          m(e, "setState");
        }, "enqueueSetState")
      }, Se = Object.assign, ye = {};
      Object.freeze(ye), E.prototype.isReactComponent = {}, E.prototype.setState = function(e, r) {
        if (typeof e != "object" && typeof e != "function" && e != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, e, r, "setState");
      }, E.prototype.forceUpdate = function(e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
      };
      var O = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (se in O)
        O.hasOwnProperty(se) && i(se, O[se]);
      C.prototype = E.prototype, O = j.prototype = new C(), O.constructor = j, Se(O, E.prototype), O.isPureReactComponent = true;
      var ke = Array.isArray, Ue = /* @__PURE__ */ Symbol.for("react.client.reference"), g = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, he = Object.prototype.hasOwnProperty, Re = console.createTask ? console.createTask : function() {
        return null;
      };
      O = {
        react_stack_bottom_frame: /* @__PURE__ */ __name(function(e) {
          return e();
        }, "react_stack_bottom_frame")
      };
      var Ce, Ae, Oe = {}, $e = O.react_stack_bottom_frame.bind(
        O,
        Z
      )(), qe = Re(X(Z)), Ne = false, Pe = /\/+/g, je = typeof reportError == "function" ? reportError : function(e) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
          var r = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
            error: e
          });
          if (!window.dispatchEvent(r)) return;
        } else if (typeof process == "object" && typeof process.emit == "function") {
          process.emit("uncaughtException", e);
          return;
        }
        console.error(e);
      }, Me = false, pe = null, de = 0, me = false, _e = false, ze = typeof queueMicrotask == "function" ? function(e) {
        queueMicrotask(function() {
          return queueMicrotask(e);
        });
      } : Y;
      O = Object.freeze({
        __proto__: null,
        c: /* @__PURE__ */ __name(function(e) {
          return k().useMemoCache(e);
        }, "c")
      });
      var se = {
        map: G,
        forEach: /* @__PURE__ */ __name(function(e, r, s) {
          G(
            e,
            function() {
              r.apply(this, arguments);
            },
            s
          );
        }, "forEach"),
        count: /* @__PURE__ */ __name(function(e) {
          var r = 0;
          return G(e, function() {
            r++;
          }), r;
        }, "count"),
        toArray: /* @__PURE__ */ __name(function(e) {
          return G(e, function(r) {
            return r;
          }) || [];
        }, "toArray"),
        only: /* @__PURE__ */ __name(function(e) {
          if (!z(e))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return e;
        }, "only")
      };
      o.Activity = Ee, o.Children = se, o.Component = E, o.Fragment = t, o.Profiler = h, o.PureComponent = j, o.StrictMode = a, o.Suspense = T, o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = g, o.__COMPILER_RUNTIME = O, o.act = function(e) {
        var r = g.actQueue, s = de;
        de++;
        var u = g.actQueue = r !== null ? r : [], f = false;
        try {
          var y = e();
        } catch (_) {
          g.thrownErrors.push(_);
        }
        if (0 < g.thrownErrors.length)
          throw P(r, s), e = U(g.thrownErrors), g.thrownErrors.length = 0, e;
        if (y !== null && typeof y == "object" && typeof y.then == "function") {
          var d = y;
          return ze(function() {
            f || me || (me = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          }), {
            then: /* @__PURE__ */ __name(function(_, I) {
              f = true, d.then(
                function(K) {
                  if (P(r, s), s === 0) {
                    try {
                      oe(u), Y(function() {
                        return W(
                          K,
                          _,
                          I
                        );
                      });
                    } catch (xe) {
                      g.thrownErrors.push(xe);
                    }
                    if (0 < g.thrownErrors.length) {
                      var Qe = U(
                        g.thrownErrors
                      );
                      g.thrownErrors.length = 0, I(Qe);
                    }
                  } else _(K);
                },
                function(K) {
                  P(r, s), 0 < g.thrownErrors.length && (K = U(
                    g.thrownErrors
                  ), g.thrownErrors.length = 0), I(K);
                }
              );
            }, "then")
          };
        }
        var S = y;
        if (P(r, s), s === 0 && (oe(u), u.length !== 0 && ze(function() {
          f || me || (me = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), g.actQueue = null), 0 < g.thrownErrors.length)
          throw e = U(g.thrownErrors), g.thrownErrors.length = 0, e;
        return {
          then: /* @__PURE__ */ __name(function(_, I) {
            f = true, s === 0 ? (g.actQueue = u, Y(function() {
              return W(
                S,
                _,
                I
              );
            })) : _(S);
          }, "then")
        };
      }, o.cache = function(e) {
        return function() {
          return e.apply(null, arguments);
        };
      }, o.cacheSignal = function() {
        return null;
      }, o.captureOwnerStack = function() {
        var e = g.getCurrentStack;
        return e === null ? null : e();
      }, o.cloneElement = function(e, r, s) {
        if (e == null)
          throw Error(
            "The argument must be a React element, but you passed " + e + "."
          );
        var u = Se({}, e.props), f = e.key, y = e._owner;
        if (r != null) {
          var d;
          e: {
            if (he.call(r, "ref") && (d = Object.getOwnPropertyDescriptor(
              r,
              "ref"
            ).get) && d.isReactWarning) {
              d = false;
              break e;
            }
            d = r.ref !== void 0;
          }
          d && (y = ie()), J(r) && (N(r.key), f = "" + r.key);
          for (S in r)
            !he.call(r, S) || S === "key" || S === "__self" || S === "__source" || S === "ref" && r.ref === void 0 || (u[S] = r[S]);
        }
        var S = arguments.length - 2;
        if (S === 1) u.children = s;
        else if (1 < S) {
          d = Array(S);
          for (var _ = 0; _ < S; _++)
            d[_] = arguments[_ + 2];
          u.children = d;
        }
        for (u = Q(
          e.type,
          f,
          u,
          y,
          e._debugStack,
          e._debugTask
        ), f = 2; f < arguments.length; f++)
          x(arguments[f]);
        return u;
      }, o.createContext = function(e) {
        return e = {
          $$typeof: v,
          _currentValue: e,
          _currentValue2: e,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        }, e.Provider = e, e.Consumer = {
          $$typeof: l,
          _context: e
        }, e._currentRenderer = null, e._currentRenderer2 = null, e;
      }, o.createElement = function(e, r, s) {
        for (var u = 2; u < arguments.length; u++)
          x(arguments[u]);
        u = {};
        var f = null;
        if (r != null)
          for (_ in Ae || !("__self" in r) || "key" in r || (Ae = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), J(r) && (N(r.key), f = "" + r.key), r)
            he.call(r, _) && _ !== "key" && _ !== "__self" && _ !== "__source" && (u[_] = r[_]);
        var y = arguments.length - 2;
        if (y === 1) u.children = s;
        else if (1 < y) {
          for (var d = Array(y), S = 0; S < y; S++)
            d[S] = arguments[S + 2];
          Object.freeze && Object.freeze(d), u.children = d;
        }
        if (e && e.defaultProps)
          for (_ in y = e.defaultProps, y)
            u[_] === void 0 && (u[_] = y[_]);
        f && ce(
          u,
          typeof e == "function" ? e.displayName || e.name || "Unknown" : e
        );
        var _ = 1e4 > g.recentlyCreatedOwnerStacks++;
        return Q(
          e,
          f,
          u,
          ie(),
          _ ? Error("react-stack-top-frame") : $e,
          _ ? Re(X(e)) : qe
        );
      }, o.createRef = function() {
        var e = { current: null };
        return Object.seal(e), e;
      }, o.forwardRef = function(e) {
        e != null && e.$$typeof === R ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : typeof e != "function" ? console.error(
          "forwardRef requires a render function but was given %s.",
          e === null ? "null" : typeof e
        ) : e.length !== 0 && e.length !== 2 && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          e.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        ), e != null && e.defaultProps != null && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var r = { $$typeof: w, render: e }, s;
        return Object.defineProperty(r, "displayName", {
          enumerable: false,
          configurable: true,
          get: /* @__PURE__ */ __name(function() {
            return s;
          }, "get"),
          set: /* @__PURE__ */ __name(function(u) {
            s = u, e.name || e.displayName || (Object.defineProperty(e, "name", { value: u }), e.displayName = u);
          }, "set")
        }), r;
      }, o.isValidElement = z, o.lazy = function(e) {
        e = { _status: -1, _result: e };
        var r = {
          $$typeof: $,
          _payload: e,
          _init: re
        }, s = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        return e._ioInfo = s, r._debugInfo = [{ awaited: s }], r;
      }, o.memo = function(e, r) {
        e == null && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          e === null ? "null" : typeof e
        ), r = {
          $$typeof: R,
          type: e,
          compare: r === void 0 ? null : r
        };
        var s;
        return Object.defineProperty(r, "displayName", {
          enumerable: false,
          configurable: true,
          get: /* @__PURE__ */ __name(function() {
            return s;
          }, "get"),
          set: /* @__PURE__ */ __name(function(u) {
            s = u, e.name || e.displayName || (Object.defineProperty(e, "name", { value: u }), e.displayName = u);
          }, "set")
        }), r;
      }, o.startTransition = function(e) {
        var r = g.T, s = {};
        s._updatedFibers = /* @__PURE__ */ new Set(), g.T = s;
        try {
          var u = e(), f = g.S;
          f !== null && f(s, u), typeof u == "object" && u !== null && typeof u.then == "function" && (g.asyncTransitions++, u.then(ne, ne), u.then(H, je));
        } catch (y) {
          je(y);
        } finally {
          r === null && s._updatedFibers && (e = s._updatedFibers.size, s._updatedFibers.clear(), 10 < e && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), r !== null && s.types !== null && (r.types !== null && r.types !== s.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), r.types = s.types), g.T = r;
        }
      }, o.unstable_useCacheRefresh = function() {
        return k().useCacheRefresh();
      }, o.use = function(e) {
        return k().use(e);
      }, o.useActionState = function(e, r, s) {
        return k().useActionState(
          e,
          r,
          s
        );
      }, o.useCallback = function(e, r) {
        return k().useCallback(e, r);
      }, o.useContext = function(e) {
        var r = k();
        return e.$$typeof === l && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        ), r.useContext(e);
      }, o.useDebugValue = function(e, r) {
        return k().useDebugValue(e, r);
      }, o.useDeferredValue = function(e, r) {
        return k().useDeferredValue(e, r);
      }, o.useEffect = function(e, r) {
        return e == null && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), k().useEffect(e, r);
      }, o.useEffectEvent = function(e) {
        return k().useEffectEvent(e);
      }, o.useId = function() {
        return k().useId();
      }, o.useImperativeHandle = function(e, r, s) {
        return k().useImperativeHandle(e, r, s);
      }, o.useInsertionEffect = function(e, r) {
        return e == null && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), k().useInsertionEffect(e, r);
      }, o.useLayoutEffect = function(e, r) {
        return e == null && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), k().useLayoutEffect(e, r);
      }, o.useMemo = function(e, r) {
        return k().useMemo(e, r);
      }, o.useOptimistic = function(e, r) {
        return k().useOptimistic(e, r);
      }, o.useReducer = function(e, r, s) {
        return k().useReducer(e, r, s);
      }, o.useRef = function(e) {
        return k().useRef(e);
      }, o.useState = function(e) {
        return k().useState(e);
      }, o.useSyncExternalStore = function(e, r, s) {
        return k().useSyncExternalStore(
          e,
          r,
          s
        );
      }, o.useTransition = function() {
        return k().useTransition();
      }, o.version = "19.2.3", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  })(ae, ae.exports)), ae.exports;
}
__name(rt, "rt");
var Ye;
function nt() {
  return Ye || (Ye = 1, false ? ge.exports = tt() : ge.exports = rt()), ge.exports;
}
__name(nt, "nt");
nt();
var st = class extends et {
  static {
    __name(this, "st");
  }
  state = {
    teams: [],
    buzzQueue: [],
    activeQuestionValue: null,
    buzzerLocked: false
  };
  // ── Helpers ──────────────────────────────────────────────────────────────
  broadcast(o) {
    super.broadcast(JSON.stringify(o));
  }
  broadcastMessage(o) {
    this.broadcast(JSON.stringify(o));
  }
  sendState() {
    this.broadcastMessage({ type: "state", state: this.state });
  }
  getTeam(o) {
    return this.state.teams.find((i) => i.name === o);
  }
  ensureTeam(o) {
    this.getTeam(o) || this.state.teams.push({ name: o, score: 0 });
  }
  // ── Lifecycle ────────────────────────────────────────────────────────────
  onConnect(o, i) {
    o.send(JSON.stringify({ type: "state", state: this.state }));
  }
  onMessage(o, i) {
    let c;
    try {
      c = JSON.parse(i);
    } catch {
      return;
    }
    switch (c.type) {
      // A team captain registers their team name when they load the buzzer
      case "register-team": {
        this.ensureTeam(c.teamName), this.sendState();
        break;
      }
      // A team captain hits the buzzer
      case "buzz": {
        if (this.state.buzzQueue.some((j) => j.teamName === c.teamName)) break;
        const E = {
          teamName: c.teamName,
          timestamp: Date.now()
        };
        this.state.buzzQueue.push(E), this.state.buzzerLocked = true, this.sendState();
        const C = this.state.buzzQueue.length;
        this.broadcastMessage({ type: "buzz-received", teamName: c.teamName, position: C });
        break;
      }
      // Host opens a question — unlocks buzzers for this value
      case "set-question": {
        this.state.activeQuestionValue = c.value, this.state.buzzQueue = [], this.state.buzzerLocked = false, this.sendState();
        break;
      }
      // Host accepts the current answering team's answer → award points
      case "accept": {
        const m = this.state.activeQuestionValue ?? c.questionValue;
        this.ensureTeam(c.teamName);
        const E = this.getTeam(c.teamName);
        E.score += m, this.state.activeQuestionValue = null, this.state.buzzQueue = [], this.state.buzzerLocked = false, this.sendState();
        break;
      }
      // Host rejects the current answering team → deduct, open for steal
      case "reject": {
        const m = this.state.activeQuestionValue ?? c.questionValue;
        this.ensureTeam(c.teamName);
        const E = this.getTeam(c.teamName);
        E.score = Math.max(0, E.score - m), this.state.buzzQueue = this.state.buzzQueue.filter((C) => C.teamName !== c.teamName), this.state.buzzerLocked = this.state.buzzQueue.length > 0, this.sendState();
        break;
      }
      // Host closes the question without awarding anyone
      case "close-question": {
        this.state.activeQuestionValue = null, this.state.buzzQueue = [], this.state.buzzerLocked = false, this.sendState();
        break;
      }
      // Full reset for a new game
      case "reset": {
        this.state = {
          teams: this.state.teams.map((m) => ({ ...m, score: 0 })),
          // keep teams, zero scores
          buzzQueue: [],
          activeQuestionValue: null,
          buzzerLocked: false
        }, this.sendState();
        break;
      }
    }
  }
};
var at = {};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-QCtxTw/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = at;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-QCtxTw/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  st as BridalJeopardyServer,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=bach-itinerary.js.map
