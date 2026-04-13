import { env as Fe, DurableObject as Ve } from "cloudflare:workers";
let Xe = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", Ze = (r = 21) => {
  let o = "", i = crypto.getRandomValues(new Uint8Array(r |= 0));
  for (; r--; )
    o += Xe[i[r] & 63];
  return o;
};
if (!("OPEN" in WebSocket)) {
  const r = {
    CONNECTING: WebSocket.READY_STATE_CONNECTING,
    OPEN: WebSocket.READY_STATE_OPEN,
    CLOSING: WebSocket.READY_STATE_CLOSING,
    CLOSED: WebSocket.READY_STATE_CLOSED
  };
  Object.assign(WebSocket, r), Object.assign(WebSocket.prototype, r);
}
function Ue(r) {
  try {
    const o = WebSocket.prototype.deserializeAttachment.call(r);
    if (!o || typeof o != "object" || !("__pk" in o)) return null;
    const i = o.__pk;
    if (!i || typeof i != "object") return null;
    const { id: c, tags: d } = i;
    if (typeof c != "string") return null;
    const { uri: g } = i;
    return {
      id: c,
      tags: Array.isArray(d) ? d : [],
      uri: typeof g == "string" ? g : void 0
    };
  } catch {
    return null;
  }
}
function ce(r) {
  return Ue(r) !== null;
}
var Je = class {
  #t = /* @__PURE__ */ new WeakMap();
  get(r) {
    let o = this.#t.get(r);
    if (!o)
      if (o = WebSocket.prototype.deserializeAttachment.call(r), o !== void 0) this.#t.set(r, o);
      else throw new Error("Missing websocket attachment. This is most likely an issue in PartyServer, please open an issue at https://github.com/cloudflare/partykit/issues");
    return o;
  }
  set(r, o) {
    this.#t.set(r, o), WebSocket.prototype.serializeAttachment.call(r, o);
  }
};
const ee = new Je(), $e = /* @__PURE__ */ new WeakSet(), et = (r) => $e.has(r), te = (r) => {
  if (et(r)) return r;
  let o;
  "state" in r && (o = r.state, delete r.state);
  const i = Object.defineProperties(r, {
    id: {
      configurable: !0,
      get() {
        return ee.get(r).__pk.id;
      }
    },
    uri: {
      configurable: !0,
      get() {
        return ee.get(r).__pk.uri ?? null;
      }
    },
    tags: {
      configurable: !0,
      get() {
        return ee.get(r).__pk.tags ?? [];
      }
    },
    socket: {
      configurable: !0,
      get() {
        return r;
      }
    },
    state: {
      configurable: !0,
      get() {
        return r.deserializeAttachment();
      }
    },
    setState: {
      configurable: !0,
      value: function(c) {
        let d;
        return c instanceof Function ? d = c(this.state) : d = c, r.serializeAttachment(d), d;
      }
    },
    deserializeAttachment: {
      configurable: !0,
      value: function() {
        return ee.get(r).__user ?? null;
      }
    },
    serializeAttachment: {
      configurable: !0,
      value: function(d) {
        const g = {
          ...ee.get(r),
          __user: d ?? null
        };
        ee.set(r, g);
      }
    }
  });
  return o && i.setState(o), $e.add(i), i;
};
var tt = class {
  index = 0;
  sockets;
  constructor(r, o) {
    this.state = r, this.tag = o;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    const r = this.sockets ?? (this.sockets = this.state.getWebSockets(this.tag));
    let o;
    for (; o = r[this.index++]; ) if (o.readyState === WebSocket.READY_STATE_OPEN) {
      if (!ce(o)) continue;
      return {
        done: !1,
        value: te(o)
      };
    }
    return {
      done: !0,
      value: void 0
    };
  }
};
function qe(r, o) {
  const i = [r, ...o.filter((c) => c !== r)];
  if (i.length > 10) throw new Error("A connection can only have 10 tags, including the default id tag.");
  for (const c of i) {
    if (typeof c != "string") throw new Error(`A connection tag must be a string. Received: ${c}`);
    if (c === "") throw new Error("A connection tag must not be an empty string.");
    if (c.length > 256) throw new Error("A connection tag must not exceed 256 characters");
  }
  return i;
}
var rt = class {
  #t = /* @__PURE__ */ new Map();
  tags = /* @__PURE__ */ new WeakMap();
  getCount() {
    return this.#t.size;
  }
  getConnection(r) {
    return this.#t.get(r);
  }
  *getConnections(r) {
    if (!r) {
      yield* this.#t.values().filter((o) => o.readyState === WebSocket.READY_STATE_OPEN);
      return;
    }
    for (const o of this.#t.values()) (this.tags.get(o) ?? []).includes(r) && (yield o);
  }
  accept(r, o) {
    r.accept();
    const i = qe(r.id, o.tags);
    this.#t.set(r.id, r), this.tags.set(r, i), Object.defineProperty(r, "tags", {
      get: () => i,
      configurable: !0
    });
    const c = () => {
      this.#t.delete(r.id), r.removeEventListener("close", c), r.removeEventListener("error", c);
    };
    return r.addEventListener("close", c), r.addEventListener("error", c), r;
  }
}, nt = class {
  constructor(r) {
    this.controller = r;
  }
  getCount() {
    let r = 0;
    for (const o of this.controller.getWebSockets()) ce(o) && r++;
    return r;
  }
  getConnection(r) {
    const o = this.controller.getWebSockets(r).filter((i) => Ue(i)?.id === r);
    if (o.length !== 0) {
      if (o.length === 1) return te(o[0]);
      throw new Error(`More than one connection found for id ${r}. Did you mean to use getConnections(tag) instead?`);
    }
  }
  getConnections(r) {
    return new tt(this.controller, r);
  }
  accept(r, o) {
    const i = qe(r.id, o.tags);
    return this.controller.acceptWebSocket(r, i), r.serializeAttachment({
      __pk: {
        id: r.id,
        tags: i,
        uri: r.uri ?? void 0
      },
      __user: null
    }), te(r);
  }
};
const _e = "__ps_name", Ee = /* @__PURE__ */ new WeakMap(), De = /* @__PURE__ */ new WeakMap();
function Ie(r) {
  if (r === r.toUpperCase() && r !== r.toLowerCase()) return r.toLowerCase().replace(/_/g, "-");
  let o = r.replace(/[A-Z]/g, (i) => `-${i.toLowerCase()}`);
  return o = o.startsWith("-") ? o.slice(1) : o, o.replace(/_/g, "-").replace(/-$/, "");
}
function ot(r) {
  return null;
}
async function st(r, o = Fe, i) {
  if (!Ee.has(o)) {
    const A = {}, O = {};
    for (const [z, P] of Object.entries(o)) if (P && typeof P == "object" && "idFromName" in P && typeof P.idFromName == "function") {
      const Y = Ie(z);
      A[Y] = P, O[Y] = z;
    }
    Ee.set(o, A), De.set(o, O);
  }
  const c = Ee.get(o), d = De.get(o), g = "parties".split("/"), C = new URL(r.url).pathname.split("/").filter(Boolean);
  if (!g.every((A, O) => C[O] === A) || C.length < g.length + 2) return null;
  const R = C[g.length], j = C[g.length + 1];
  if (j && R) {
    let z = function(U) {
      if (!A || O) return U;
      const B = new Response(U.body, U);
      for (const [I, q] of Object.entries(A)) B.headers.set(I, q);
      return B;
    };
    if (!c[R])
      return R === "main" ? (console.warn("You appear to be migrating a PartyKit project to PartyServer."), console.warn(`PartyServer doesn't have a "main" party by default. Try adding this to your PartySocket client:
 
party: "${Ie(Object.keys(c)[0])}"`)) : console.error(`The url ${r.url}  with namespace "${R}" and name "${j}" does not match any server namespace. 
Did you forget to add a durable object binding to the class ${R[0].toUpperCase() + R.slice(1)} in your wrangler.jsonc?`), new Response("Invalid request", { status: 400 });
    const A = ot(), O = r.headers.get("Upgrade")?.toLowerCase() === "websocket";
    if (r.method === "OPTIONS" && A) return new Response(null, { headers: A });
    let P = c[R];
    const Y = P.idFromName(j), H = P.get(Y, i);
    return r = new Request(r), r.headers.set("x-partykit-namespace", R), d[R], O ? (await H.setName(j, i?.props), await H.fetch(r)) : z(await H._initAndFetch(j, i?.props, r));
  } else return null;
}
var at = class extends Ve {
  static options = { hibernate: !1 };
  #t = "zero";
  #r = Object.getPrototypeOf(this).constructor;
  #o = this.#r.options.hibernate ? new nt(this.ctx) : new rt();
  /**
  * Execute SQL queries against the Server's database
  * @template T Type of the returned rows
  * @param strings SQL query template strings
  * @param values Values to be inserted into the query
  * @returns Array of query results
  */
  sql(r, ...o) {
    let i = "";
    try {
      return i = r.reduce((c, d, g) => c + d + (g < o.length ? "?" : ""), ""), [...this.ctx.storage.sql.exec(i, ...o)];
    } catch (c) {
      throw console.error(`failed to execute sql query: ${i}`, c), this.onException(c);
    }
  }
  constructor(r, o) {
    super(r, o);
  }
  /**
  * Handle incoming requests to the server.
  */
  async fetch(r) {
    try {
      const o = r.headers.get("x-partykit-props");
      if (o && (this.#s = JSON.parse(o)), this.#e || await this.#a(), !this.#e) {
        const c = r.headers.get("x-partykit-room");
        if (!c) throw new Error(`Missing namespace or room headers when connecting to ${this.#r.name}.
Did you try connecting directly to this Durable Object? Try using getServerByName(namespace, id) instead.`);
        await this.setName(c);
      }
      await this.#n();
      const i = new URL(r.url);
      if (r.headers.get("Upgrade")?.toLowerCase() !== "websocket") return await this.onRequest(r);
      {
        const { 0: c, 1: d } = new WebSocketPair();
        let g = i.searchParams.get("_pk");
        g || (g = Ze());
        let C = Object.assign(d, {
          id: g,
          uri: r.url,
          server: this.name,
          tags: [],
          state: null,
          setState(A) {
            let O;
            return A instanceof Function ? O = A(this.state) : O = A, this.state = O, this.state;
          }
        });
        const R = { request: r }, j = await this.getConnectionTags(C, R);
        return C = this.#o.accept(C, { tags: j }), this.#r.options.hibernate || this.#u(C), await this.onConnect(C, R), new Response(null, {
          status: 101,
          webSocket: c
        });
      }
    } catch (o) {
      if (console.error(`Error in ${this.#r.name}:${this.#e ?? "<unnamed>"} fetch:`, o), !(o instanceof Error)) throw o;
      if (r.headers.get("Upgrade") === "websocket") {
        const i = new WebSocketPair();
        return i[1].accept(), i[1].send(JSON.stringify({ error: o.stack })), i[1].close(1011, "Uncaught exception during session setup"), new Response(null, {
          status: 101,
          webSocket: i[0]
        });
      } else return new Response(o.stack, { status: 500 });
    }
  }
  async webSocketMessage(r, o) {
    if (ce(r))
      try {
        const i = te(r);
        return await this.#n(), i.server = this.name, this.onMessage(i, o);
      } catch (i) {
        console.error(`Error in ${this.#r.name}:${this.#e ?? "<unnamed>"} webSocketMessage:`, i);
      }
  }
  async webSocketClose(r, o, i, c) {
    if (ce(r))
      try {
        const d = te(r);
        return await this.#n(), d.server = this.name, this.onClose(d, o, i, c);
      } catch (d) {
        console.error(`Error in ${this.#r.name}:${this.#e ?? "<unnamed>"} webSocketClose:`, d);
      }
  }
  async webSocketError(r, o) {
    if (ce(r))
      try {
        const i = te(r);
        return await this.#n(), i.server = this.name, this.onError(i, o);
      } catch (i) {
        console.error(`Error in ${this.#r.name}:${this.#e ?? "<unnamed>"} webSocketError:`, i);
      }
  }
  async #a() {
    if (this.#e) return;
    const r = await this.ctx.storage.get(_e);
    r && (this.#e = r);
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
    let r;
    if (await this.ctx.blockConcurrencyWhile(async () => {
      this.#t = "starting";
      try {
        await this.onStart(this.#s), this.#t = "started";
      } catch (o) {
        this.#t = "zero", r = o;
      }
    }), r) throw r;
  }
  #u(r) {
    const o = (d) => {
      this.onMessage(r, d.data)?.catch((g) => {
        console.error("onMessage error:", g);
      });
    }, i = (d) => {
      r.removeEventListener("message", o), r.removeEventListener("close", i), this.onClose(r, d.code, d.reason, d.wasClean)?.catch((g) => {
        console.error("onClose error:", g);
      });
    }, c = (d) => {
      r.removeEventListener("message", o), r.removeEventListener("error", c), this.onError(r, d.error)?.catch((g) => {
        console.error("onError error:", g);
      });
    };
    r.addEventListener("close", i), r.addEventListener("error", c), r.addEventListener("message", o);
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
  async setName(r, o) {
    if (!r) throw new Error("A name is required.");
    if (this.#e && this.#e !== r) throw new Error(`This server already has a name: ${this.#e}, attempting to set to: ${r}`);
    o !== void 0 && (this.#s = o), this.#e !== r && (this.#e = r, await this.ctx.storage.put(_e, r), await this.#n());
  }
  /**
  * @internal Sets name/props and handles a request in a single RPC call.
  * Used by routePartykitRequest to avoid an extra round trip.
  */
  async _initAndFetch(r, o, i) {
    if (o !== void 0 && (this.#s = o), this.#e && this.#e !== r) throw new Error(`This server already has a name: ${this.#e}, attempting to set to: ${r}`);
    return this.#e || (this.#e = r, await this.ctx.storage.put(_e, r)), this.fetch(i);
  }
  #i(r, o) {
    try {
      r.send(o);
    } catch {
      r.close(1011, "Unexpected error");
    }
  }
  /** Send a message to all connected clients, except connection ids listed in `without` */
  broadcast(r, o) {
    for (const i of this.#o.getConnections()) (!o || !o.includes(i.id)) && this.#i(i, r);
  }
  /** Get a connection by connection id */
  getConnection(r) {
    return this.#o.getConnection(r);
  }
  /**
  * Get all connections. Optionally, you can provide a tag to filter returned connections.
  * Use `Server#getConnectionTags` to tag the connection on connect.
  */
  getConnections(r) {
    return this.#o.getConnections(r);
  }
  /**
  * You can tag a connection to filter them in Server#getConnections.
  * Each connection supports up to 9 tags, each tag max length is 256 characters.
  */
  getConnectionTags(r, o) {
    return [];
  }
  #s;
  /**
  * Called when the server is started for the first time.
  */
  onStart(r) {
  }
  /**
  * Called when a new connection is made to the server.
  */
  onConnect(r, o) {
  }
  /**
  * Called when a message is received from a connection.
  */
  onMessage(r, o) {
  }
  /**
  * Called when a connection is closed.
  */
  onClose(r, o, i, c) {
  }
  /**
  * Called when an error occurs on a connection.
  */
  onError(r, o) {
    console.error(`Error on connection ${r.id} in ${this.#r.name}:${this.name}:`, o), console.info(`Implement onError on ${this.#r.name} to handle this error.`);
  }
  /**
  * Called when a request is made to the server.
  */
  onRequest(r) {
    return console.warn(`onRequest hasn't been implemented on ${this.#r.name}:${this.name} responding to ${r.url}`), new Response("Not implemented", { status: 404 });
  }
  /**
  * Called when an exception occurs.
  * @param error - The error that occurred.
  */
  onException(r) {
    console.error(`Exception in ${this.#r.name}:${this.name}:`, r), console.info(`Implement onException on ${this.#r.name} to handle this error.`);
  }
  onAlarm() {
    console.log(`Implement onAlarm on ${this.#r.name} to handle alarms.`);
  }
  async alarm() {
    await this.#n(), await this.onAlarm();
  }
}, ge = { exports: {} }, p = {};
var We;
function ut() {
  if (We) return p;
  We = 1;
  var r = /* @__PURE__ */ Symbol.for("react.transitional.element"), o = /* @__PURE__ */ Symbol.for("react.portal"), i = /* @__PURE__ */ Symbol.for("react.fragment"), c = /* @__PURE__ */ Symbol.for("react.strict_mode"), d = /* @__PURE__ */ Symbol.for("react.profiler"), g = /* @__PURE__ */ Symbol.for("react.consumer"), C = /* @__PURE__ */ Symbol.for("react.context"), R = /* @__PURE__ */ Symbol.for("react.forward_ref"), j = /* @__PURE__ */ Symbol.for("react.suspense"), A = /* @__PURE__ */ Symbol.for("react.memo"), O = /* @__PURE__ */ Symbol.for("react.lazy"), z = /* @__PURE__ */ Symbol.for("react.activity"), P = Symbol.iterator;
  function Y(t) {
    return t === null || typeof t != "object" ? null : (t = P && t[P] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var H = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, U = Object.assign, B = {};
  function I(t, a, h) {
    this.props = t, this.context = a, this.refs = B, this.updater = h || H;
  }
  I.prototype.isReactComponent = {}, I.prototype.setState = function(t, a) {
    if (typeof t != "object" && typeof t != "function" && t != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, t, a, "setState");
  }, I.prototype.forceUpdate = function(t) {
    this.updater.enqueueForceUpdate(this, t, "forceUpdate");
  };
  function q() {
  }
  q.prototype = I.prototype;
  function re(t, a, h) {
    this.props = t, this.context = a, this.refs = B, this.updater = h || H;
  }
  var V = re.prototype = new q();
  V.constructor = re, U(V, I.prototype), V.isPureReactComponent = !0;
  var $ = Array.isArray;
  function ne() {
  }
  var b = { H: null, A: null, T: null, S: null }, le = Object.prototype.hasOwnProperty;
  function W(t, a, h) {
    var f = h.ref;
    return {
      $$typeof: r,
      type: t,
      key: a,
      ref: f !== void 0 ? f : null,
      props: h
    };
  }
  function X(t, a) {
    return W(t.type, a, t.props);
  }
  function oe(t) {
    return typeof t == "object" && t !== null && t.$$typeof === r;
  }
  function k(t) {
    var a = { "=": "=0", ":": "=2" };
    return "$" + t.replace(/[=:]/g, function(h) {
      return a[h];
    });
  }
  var se = /\/+/g;
  function Q(t, a) {
    return typeof t == "object" && t !== null && t.key != null ? k("" + t.key) : a.toString(36);
  }
  function K(t) {
    switch (t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw t.reason;
      default:
        switch (typeof t.status == "string" ? t.then(ne, ne) : (t.status = "pending", t.then(
          function(a) {
            t.status === "pending" && (t.status = "fulfilled", t.value = a);
          },
          function(a) {
            t.status === "pending" && (t.status = "rejected", t.reason = a);
          }
        )), t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw t.reason;
        }
    }
    throw t;
  }
  function D(t, a, h, f, E) {
    var w = typeof t;
    (w === "undefined" || w === "boolean") && (t = null);
    var T = !1;
    if (t === null) T = !0;
    else
      switch (w) {
        case "bigint":
        case "string":
        case "number":
          T = !0;
          break;
        case "object":
          switch (t.$$typeof) {
            case r:
            case o:
              T = !0;
              break;
            case O:
              return T = t._init, D(
                T(t._payload),
                a,
                h,
                f,
                E
              );
          }
      }
    if (T)
      return E = E(t), T = f === "" ? "." + Q(t, 0) : f, $(E) ? (h = "", T != null && (h = T.replace(se, "$&/") + "/"), D(E, a, h, "", function(F) {
        return F;
      })) : E != null && (oe(E) && (E = X(
        E,
        h + (E.key == null || t && t.key === E.key ? "" : ("" + E.key).replace(
          se,
          "$&/"
        ) + "/") + T
      )), a.push(E)), 1;
    T = 0;
    var M = f === "" ? "." : f + ":";
    if ($(t))
      for (var N = 0; N < t.length; N++)
        f = t[N], w = M + Q(f, N), T += D(
          f,
          a,
          h,
          w,
          E
        );
    else if (N = Y(t), typeof N == "function")
      for (t = N.call(t), N = 0; !(f = t.next()).done; )
        f = f.value, w = M + Q(f, N++), T += D(
          f,
          a,
          h,
          w,
          E
        );
    else if (w === "object") {
      if (typeof t.then == "function")
        return D(
          K(t),
          a,
          h,
          f,
          E
        );
      throw a = String(t), Error(
        "Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return T;
  }
  function x(t, a, h) {
    if (t == null) return t;
    var f = [], E = 0;
    return D(t, f, "", "", function(w) {
      return a.call(h, w, E++);
    }), f;
  }
  function ae(t) {
    if (t._status === -1) {
      var a = t._result;
      a = a(), a.then(
        function(h) {
          (t._status === 0 || t._status === -1) && (t._status = 1, t._result = h);
        },
        function(h) {
          (t._status === 0 || t._status === -1) && (t._status = 2, t._result = h);
        }
      ), t._status === -1 && (t._status = 0, t._result = a);
    }
    if (t._status === 1) return t._result.default;
    throw t._result;
  }
  var Z = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var a = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(a)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, fe = {
    map: x,
    forEach: function(t, a, h) {
      x(
        t,
        function() {
          a.apply(this, arguments);
        },
        h
      );
    },
    count: function(t) {
      var a = 0;
      return x(t, function() {
        a++;
      }), a;
    },
    toArray: function(t) {
      return x(t, function(a) {
        return a;
      }) || [];
    },
    only: function(t) {
      if (!oe(t))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return t;
    }
  };
  return p.Activity = z, p.Children = fe, p.Component = I, p.Fragment = i, p.Profiler = d, p.PureComponent = re, p.StrictMode = c, p.Suspense = j, p.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = b, p.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(t) {
      return b.H.useMemoCache(t);
    }
  }, p.cache = function(t) {
    return function() {
      return t.apply(null, arguments);
    };
  }, p.cacheSignal = function() {
    return null;
  }, p.cloneElement = function(t, a, h) {
    if (t == null)
      throw Error(
        "The argument must be a React element, but you passed " + t + "."
      );
    var f = U({}, t.props), E = t.key;
    if (a != null)
      for (w in a.key !== void 0 && (E = "" + a.key), a)
        !le.call(a, w) || w === "key" || w === "__self" || w === "__source" || w === "ref" && a.ref === void 0 || (f[w] = a[w]);
    var w = arguments.length - 2;
    if (w === 1) f.children = h;
    else if (1 < w) {
      for (var T = Array(w), M = 0; M < w; M++)
        T[M] = arguments[M + 2];
      f.children = T;
    }
    return W(t.type, E, f);
  }, p.createContext = function(t) {
    return t = {
      $$typeof: C,
      _currentValue: t,
      _currentValue2: t,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, t.Provider = t, t.Consumer = {
      $$typeof: g,
      _context: t
    }, t;
  }, p.createElement = function(t, a, h) {
    var f, E = {}, w = null;
    if (a != null)
      for (f in a.key !== void 0 && (w = "" + a.key), a)
        le.call(a, f) && f !== "key" && f !== "__self" && f !== "__source" && (E[f] = a[f]);
    var T = arguments.length - 2;
    if (T === 1) E.children = h;
    else if (1 < T) {
      for (var M = Array(T), N = 0; N < T; N++)
        M[N] = arguments[N + 2];
      E.children = M;
    }
    if (t && t.defaultProps)
      for (f in T = t.defaultProps, T)
        E[f] === void 0 && (E[f] = T[f]);
    return W(t, w, E);
  }, p.createRef = function() {
    return { current: null };
  }, p.forwardRef = function(t) {
    return { $$typeof: R, render: t };
  }, p.isValidElement = oe, p.lazy = function(t) {
    return {
      $$typeof: O,
      _payload: { _status: -1, _result: t },
      _init: ae
    };
  }, p.memo = function(t, a) {
    return {
      $$typeof: A,
      type: t,
      compare: a === void 0 ? null : a
    };
  }, p.startTransition = function(t) {
    var a = b.T, h = {};
    b.T = h;
    try {
      var f = t(), E = b.S;
      E !== null && E(h, f), typeof f == "object" && f !== null && typeof f.then == "function" && f.then(ne, Z);
    } catch (w) {
      Z(w);
    } finally {
      a !== null && h.types !== null && (a.types = h.types), b.T = a;
    }
  }, p.unstable_useCacheRefresh = function() {
    return b.H.useCacheRefresh();
  }, p.use = function(t) {
    return b.H.use(t);
  }, p.useActionState = function(t, a, h) {
    return b.H.useActionState(t, a, h);
  }, p.useCallback = function(t, a) {
    return b.H.useCallback(t, a);
  }, p.useContext = function(t) {
    return b.H.useContext(t);
  }, p.useDebugValue = function() {
  }, p.useDeferredValue = function(t, a) {
    return b.H.useDeferredValue(t, a);
  }, p.useEffect = function(t, a) {
    return b.H.useEffect(t, a);
  }, p.useEffectEvent = function(t) {
    return b.H.useEffectEvent(t);
  }, p.useId = function() {
    return b.H.useId();
  }, p.useImperativeHandle = function(t, a, h) {
    return b.H.useImperativeHandle(t, a, h);
  }, p.useInsertionEffect = function(t, a) {
    return b.H.useInsertionEffect(t, a);
  }, p.useLayoutEffect = function(t, a) {
    return b.H.useLayoutEffect(t, a);
  }, p.useMemo = function(t, a) {
    return b.H.useMemo(t, a);
  }, p.useOptimistic = function(t, a) {
    return b.H.useOptimistic(t, a);
  }, p.useReducer = function(t, a, h) {
    return b.H.useReducer(t, a, h);
  }, p.useRef = function(t) {
    return b.H.useRef(t);
  }, p.useState = function(t) {
    return b.H.useState(t);
  }, p.useSyncExternalStore = function(t, a, h) {
    return b.H.useSyncExternalStore(
      t,
      a,
      h
    );
  }, p.useTransition = function() {
    return b.H.useTransition();
  }, p.version = "19.2.3", p;
}
var ie = { exports: {} };
ie.exports;
var Ye;
function it() {
  return Ye || (Ye = 1, (function(r, o) {
    process.env.NODE_ENV !== "production" && (function() {
      function i(e, n) {
        Object.defineProperty(g.prototype, e, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              n[0],
              n[1]
            );
          }
        });
      }
      function c(e) {
        return e === null || typeof e != "object" ? null : (e = be && e[be] || e["@@iterator"], typeof e == "function" ? e : null);
      }
      function d(e, n) {
        e = (e = e.constructor) && (e.displayName || e.name) || "ReactClass";
        var s = e + "." + n;
        Te[s] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          n,
          e
        ), Te[s] = !0);
      }
      function g(e, n, s) {
        this.props = e, this.context = n, this.refs = ye, this.updater = s || Se;
      }
      function C() {
      }
      function R(e, n, s) {
        this.props = e, this.context = n, this.refs = ye, this.updater = s || Se;
      }
      function j() {
      }
      function A(e) {
        return "" + e;
      }
      function O(e) {
        try {
          A(e);
          var n = !1;
        } catch {
          n = !0;
        }
        if (n) {
          n = console;
          var s = n.error, u = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
          return s.call(
            n,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            u
          ), A(e);
        }
      }
      function z(e) {
        if (e == null) return null;
        if (typeof e == "function")
          return e.$$typeof === Qe ? null : e.displayName || e.name || null;
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
          case M:
            return "SuspenseList";
          case we:
            return "Activity";
        }
        if (typeof e == "object")
          switch (typeof e.tag == "number" && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), e.$$typeof) {
            case fe:
              return "Portal";
            case E:
              return e.displayName || "Context";
            case f:
              return (e._context.displayName || "Context") + ".Consumer";
            case w:
              var n = e.render;
              return e = e.displayName, e || (e = n.displayName || n.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
            case N:
              return n = e.displayName || null, n !== null ? n : z(e.type) || "Memo";
            case F:
              n = e._payload, e = e._init;
              try {
                return z(e(n));
              } catch {
              }
          }
        return null;
      }
      function P(e) {
        if (e === t) return "<>";
        if (typeof e == "object" && e !== null && e.$$typeof === F)
          return "<...>";
        try {
          var n = z(e);
          return n ? "<" + n + ">" : "<...>";
        } catch {
          return "<...>";
        }
      }
      function Y() {
        var e = y.A;
        return e === null ? null : e.getOwner();
      }
      function H() {
        return Error("react-stack-top-frame");
      }
      function U(e) {
        if (he.call(e, "key")) {
          var n = Object.getOwnPropertyDescriptor(e, "key").get;
          if (n && n.isReactWarning) return !1;
        }
        return e.key !== void 0;
      }
      function B(e, n) {
        function s() {
          Oe || (Oe = !0, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            n
          ));
        }
        s.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: s,
          configurable: !0
        });
      }
      function I() {
        var e = z(this.type);
        return Ne[e] || (Ne[e] = !0, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        )), e = this.props.ref, e !== void 0 ? e : null;
      }
      function q(e, n, s, u, l, v) {
        var m = s.ref;
        return e = {
          $$typeof: Z,
          type: e,
          key: n,
          props: s,
          _owner: u
        }, (m !== void 0 ? m : null) !== null ? Object.defineProperty(e, "ref", {
          enumerable: !1,
          get: I
        }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: 0
        }), Object.defineProperty(e, "_debugInfo", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: null
        }), Object.defineProperty(e, "_debugStack", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: l
        }), Object.defineProperty(e, "_debugTask", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: v
        }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
      }
      function re(e, n) {
        return n = q(
          e.type,
          n,
          e.props,
          e._owner,
          e._debugStack,
          e._debugTask
        ), e._store && (n._store.validated = e._store.validated), n;
      }
      function V(e) {
        $(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === F && (e._payload.status === "fulfilled" ? $(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
      }
      function $(e) {
        return typeof e == "object" && e !== null && e.$$typeof === Z;
      }
      function ne(e) {
        var n = { "=": "=0", ":": "=2" };
        return "$" + e.replace(/[=:]/g, function(s) {
          return n[s];
        });
      }
      function b(e, n) {
        return typeof e == "object" && e !== null && e.key != null ? (O(e.key), ne("" + e.key)) : n.toString(36);
      }
      function le(e) {
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw e.reason;
          default:
            switch (typeof e.status == "string" ? e.then(j, j) : (e.status = "pending", e.then(
              function(n) {
                e.status === "pending" && (e.status = "fulfilled", e.value = n);
              },
              function(n) {
                e.status === "pending" && (e.status = "rejected", e.reason = n);
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
      function W(e, n, s, u, l) {
        var v = typeof e;
        (v === "undefined" || v === "boolean") && (e = null);
        var m = !1;
        if (e === null) m = !0;
        else
          switch (v) {
            case "bigint":
            case "string":
            case "number":
              m = !0;
              break;
            case "object":
              switch (e.$$typeof) {
                case Z:
                case fe:
                  m = !0;
                  break;
                case F:
                  return m = e._init, W(
                    m(e._payload),
                    n,
                    s,
                    u,
                    l
                  );
              }
          }
        if (m) {
          m = e, l = l(m);
          var S = u === "" ? "." + b(m, 0) : u;
          return Re(l) ? (s = "", S != null && (s = S.replace(je, "$&/") + "/"), W(l, n, s, "", function(G) {
            return G;
          })) : l != null && ($(l) && (l.key != null && (m && m.key === l.key || O(l.key)), s = re(
            l,
            s + (l.key == null || m && m.key === l.key ? "" : ("" + l.key).replace(
              je,
              "$&/"
            ) + "/") + S
          ), u !== "" && m != null && $(m) && m.key == null && m._store && !m._store.validated && (s._store.validated = 2), l = s), n.push(l)), 1;
        }
        if (m = 0, S = u === "" ? "." : u + ":", Re(e))
          for (var _ = 0; _ < e.length; _++)
            u = e[_], v = S + b(u, _), m += W(
              u,
              n,
              s,
              v,
              l
            );
        else if (_ = c(e), typeof _ == "function")
          for (_ === e.entries && (Pe || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), Pe = !0), e = _.call(e), _ = 0; !(u = e.next()).done; )
            u = u.value, v = S + b(u, _++), m += W(
              u,
              n,
              s,
              v,
              l
            );
        else if (v === "object") {
          if (typeof e.then == "function")
            return W(
              le(e),
              n,
              s,
              u,
              l
            );
          throw n = String(e), Error(
            "Objects are not valid as a React child (found: " + (n === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : n) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return m;
      }
      function X(e, n, s) {
        if (e == null) return e;
        var u = [], l = 0;
        return W(e, u, "", "", function(v) {
          return n.call(s, v, l++);
        }), u;
      }
      function oe(e) {
        if (e._status === -1) {
          var n = e._ioInfo;
          n != null && (n.start = n.end = performance.now()), n = e._result;
          var s = n();
          if (s.then(
            function(l) {
              if (e._status === 0 || e._status === -1) {
                e._status = 1, e._result = l;
                var v = e._ioInfo;
                v != null && (v.end = performance.now()), s.status === void 0 && (s.status = "fulfilled", s.value = l);
              }
            },
            function(l) {
              if (e._status === 0 || e._status === -1) {
                e._status = 2, e._result = l;
                var v = e._ioInfo;
                v != null && (v.end = performance.now()), s.status === void 0 && (s.status = "rejected", s.reason = l);
              }
            }
          ), n = e._ioInfo, n != null) {
            n.value = s;
            var u = s.displayName;
            typeof u == "string" && (n.name = u);
          }
          e._status === -1 && (e._status = 0, e._result = s);
        }
        if (e._status === 1)
          return n = e._result, n === void 0 && console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`,
            n
          ), "default" in n || console.error(
            `lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`,
            n
          ), n.default;
        throw e._result;
      }
      function k() {
        var e = y.H;
        return e === null && console.error(
          `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
        ), e;
      }
      function se() {
        y.asyncTransitions--;
      }
      function Q(e) {
        if (pe === null)
          try {
            var n = ("require" + Math.random()).slice(0, 7);
            pe = (r && r[n]).call(
              r,
              "timers"
            ).setImmediate;
          } catch {
            pe = function(u) {
              Le === !1 && (Le = !0, typeof MessageChannel > "u" && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var l = new MessageChannel();
              l.port1.onmessage = u, l.port2.postMessage(void 0);
            };
          }
        return pe(e);
      }
      function K(e) {
        return 1 < e.length && typeof AggregateError == "function" ? new AggregateError(e) : e[0];
      }
      function D(e, n) {
        n !== de - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        ), de = n;
      }
      function x(e, n, s) {
        var u = y.actQueue;
        if (u !== null)
          if (u.length !== 0)
            try {
              ae(u), Q(function() {
                return x(e, n, s);
              });
              return;
            } catch (l) {
              y.thrownErrors.push(l);
            }
          else y.actQueue = null;
        0 < y.thrownErrors.length ? (u = K(y.thrownErrors), y.thrownErrors.length = 0, s(u)) : n(e);
      }
      function ae(e) {
        if (!ve) {
          ve = !0;
          var n = 0;
          try {
            for (; n < e.length; n++) {
              var s = e[n];
              do {
                y.didUsePromise = !1;
                var u = s(!1);
                if (u !== null) {
                  if (y.didUsePromise) {
                    e[n] = s, e.splice(0, n);
                    return;
                  }
                  s = u;
                } else break;
              } while (!0);
            }
            e.length = 0;
          } catch (l) {
            e.splice(0, n + 1), y.thrownErrors.push(l);
          } finally {
            ve = !1;
          }
        }
      }
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var Z = /* @__PURE__ */ Symbol.for("react.transitional.element"), fe = /* @__PURE__ */ Symbol.for("react.portal"), t = /* @__PURE__ */ Symbol.for("react.fragment"), a = /* @__PURE__ */ Symbol.for("react.strict_mode"), h = /* @__PURE__ */ Symbol.for("react.profiler"), f = /* @__PURE__ */ Symbol.for("react.consumer"), E = /* @__PURE__ */ Symbol.for("react.context"), w = /* @__PURE__ */ Symbol.for("react.forward_ref"), T = /* @__PURE__ */ Symbol.for("react.suspense"), M = /* @__PURE__ */ Symbol.for("react.suspense_list"), N = /* @__PURE__ */ Symbol.for("react.memo"), F = /* @__PURE__ */ Symbol.for("react.lazy"), we = /* @__PURE__ */ Symbol.for("react.activity"), be = Symbol.iterator, Te = {}, Se = {
        isMounted: function() {
          return !1;
        },
        enqueueForceUpdate: function(e) {
          d(e, "forceUpdate");
        },
        enqueueReplaceState: function(e) {
          d(e, "replaceState");
        },
        enqueueSetState: function(e) {
          d(e, "setState");
        }
      }, ke = Object.assign, ye = {};
      Object.freeze(ye), g.prototype.isReactComponent = {}, g.prototype.setState = function(e, n) {
        if (typeof e != "object" && typeof e != "function" && e != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, e, n, "setState");
      }, g.prototype.forceUpdate = function(e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
      };
      var L = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (ue in L)
        L.hasOwnProperty(ue) && i(ue, L[ue]);
      C.prototype = g.prototype, L = R.prototype = new C(), L.constructor = R, ke(L, g.prototype), L.isPureReactComponent = !0;
      var Re = Array.isArray, Qe = /* @__PURE__ */ Symbol.for("react.client.reference"), y = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1,
        didUsePromise: !1,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, he = Object.prototype.hasOwnProperty, Ce = console.createTask ? console.createTask : function() {
        return null;
      };
      L = {
        react_stack_bottom_frame: function(e) {
          return e();
        }
      };
      var Oe, Ae, Ne = {}, xe = L.react_stack_bottom_frame.bind(
        L,
        H
      )(), Ge = Ce(P(H)), Pe = !1, je = /\/+/g, Me = typeof reportError == "function" ? reportError : function(e) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
          var n = new window.ErrorEvent("error", {
            bubbles: !0,
            cancelable: !0,
            message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
            error: e
          });
          if (!window.dispatchEvent(n)) return;
        } else if (typeof process == "object" && typeof process.emit == "function") {
          process.emit("uncaughtException", e);
          return;
        }
        console.error(e);
      }, Le = !1, pe = null, de = 0, me = !1, ve = !1, ze = typeof queueMicrotask == "function" ? function(e) {
        queueMicrotask(function() {
          return queueMicrotask(e);
        });
      } : Q;
      L = Object.freeze({
        __proto__: null,
        c: function(e) {
          return k().useMemoCache(e);
        }
      });
      var ue = {
        map: X,
        forEach: function(e, n, s) {
          X(
            e,
            function() {
              n.apply(this, arguments);
            },
            s
          );
        },
        count: function(e) {
          var n = 0;
          return X(e, function() {
            n++;
          }), n;
        },
        toArray: function(e) {
          return X(e, function(n) {
            return n;
          }) || [];
        },
        only: function(e) {
          if (!$(e))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return e;
        }
      };
      o.Activity = we, o.Children = ue, o.Component = g, o.Fragment = t, o.Profiler = h, o.PureComponent = R, o.StrictMode = a, o.Suspense = T, o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = y, o.__COMPILER_RUNTIME = L, o.act = function(e) {
        var n = y.actQueue, s = de;
        de++;
        var u = y.actQueue = n !== null ? n : [], l = !1;
        try {
          var v = e();
        } catch (_) {
          y.thrownErrors.push(_);
        }
        if (0 < y.thrownErrors.length)
          throw D(n, s), e = K(y.thrownErrors), y.thrownErrors.length = 0, e;
        if (v !== null && typeof v == "object" && typeof v.then == "function") {
          var m = v;
          return ze(function() {
            l || me || (me = !0, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          }), {
            then: function(_, G) {
              l = !0, m.then(
                function(J) {
                  if (D(n, s), s === 0) {
                    try {
                      ae(u), Q(function() {
                        return x(
                          J,
                          _,
                          G
                        );
                      });
                    } catch (Ke) {
                      y.thrownErrors.push(Ke);
                    }
                    if (0 < y.thrownErrors.length) {
                      var Be = K(
                        y.thrownErrors
                      );
                      y.thrownErrors.length = 0, G(Be);
                    }
                  } else _(J);
                },
                function(J) {
                  D(n, s), 0 < y.thrownErrors.length && (J = K(
                    y.thrownErrors
                  ), y.thrownErrors.length = 0), G(J);
                }
              );
            }
          };
        }
        var S = v;
        if (D(n, s), s === 0 && (ae(u), u.length !== 0 && ze(function() {
          l || me || (me = !0, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), y.actQueue = null), 0 < y.thrownErrors.length)
          throw e = K(y.thrownErrors), y.thrownErrors.length = 0, e;
        return {
          then: function(_, G) {
            l = !0, s === 0 ? (y.actQueue = u, Q(function() {
              return x(
                S,
                _,
                G
              );
            })) : _(S);
          }
        };
      }, o.cache = function(e) {
        return function() {
          return e.apply(null, arguments);
        };
      }, o.cacheSignal = function() {
        return null;
      }, o.captureOwnerStack = function() {
        var e = y.getCurrentStack;
        return e === null ? null : e();
      }, o.cloneElement = function(e, n, s) {
        if (e == null)
          throw Error(
            "The argument must be a React element, but you passed " + e + "."
          );
        var u = ke({}, e.props), l = e.key, v = e._owner;
        if (n != null) {
          var m;
          e: {
            if (he.call(n, "ref") && (m = Object.getOwnPropertyDescriptor(
              n,
              "ref"
            ).get) && m.isReactWarning) {
              m = !1;
              break e;
            }
            m = n.ref !== void 0;
          }
          m && (v = Y()), U(n) && (O(n.key), l = "" + n.key);
          for (S in n)
            !he.call(n, S) || S === "key" || S === "__self" || S === "__source" || S === "ref" && n.ref === void 0 || (u[S] = n[S]);
        }
        var S = arguments.length - 2;
        if (S === 1) u.children = s;
        else if (1 < S) {
          m = Array(S);
          for (var _ = 0; _ < S; _++)
            m[_] = arguments[_ + 2];
          u.children = m;
        }
        for (u = q(
          e.type,
          l,
          u,
          v,
          e._debugStack,
          e._debugTask
        ), l = 2; l < arguments.length; l++)
          V(arguments[l]);
        return u;
      }, o.createContext = function(e) {
        return e = {
          $$typeof: E,
          _currentValue: e,
          _currentValue2: e,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        }, e.Provider = e, e.Consumer = {
          $$typeof: f,
          _context: e
        }, e._currentRenderer = null, e._currentRenderer2 = null, e;
      }, o.createElement = function(e, n, s) {
        for (var u = 2; u < arguments.length; u++)
          V(arguments[u]);
        u = {};
        var l = null;
        if (n != null)
          for (_ in Ae || !("__self" in n) || "key" in n || (Ae = !0, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), U(n) && (O(n.key), l = "" + n.key), n)
            he.call(n, _) && _ !== "key" && _ !== "__self" && _ !== "__source" && (u[_] = n[_]);
        var v = arguments.length - 2;
        if (v === 1) u.children = s;
        else if (1 < v) {
          for (var m = Array(v), S = 0; S < v; S++)
            m[S] = arguments[S + 2];
          Object.freeze && Object.freeze(m), u.children = m;
        }
        if (e && e.defaultProps)
          for (_ in v = e.defaultProps, v)
            u[_] === void 0 && (u[_] = v[_]);
        l && B(
          u,
          typeof e == "function" ? e.displayName || e.name || "Unknown" : e
        );
        var _ = 1e4 > y.recentlyCreatedOwnerStacks++;
        return q(
          e,
          l,
          u,
          Y(),
          _ ? Error("react-stack-top-frame") : xe,
          _ ? Ce(P(e)) : Ge
        );
      }, o.createRef = function() {
        var e = { current: null };
        return Object.seal(e), e;
      }, o.forwardRef = function(e) {
        e != null && e.$$typeof === N ? console.error(
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
        var n = { $$typeof: w, render: e }, s;
        return Object.defineProperty(n, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return s;
          },
          set: function(u) {
            s = u, e.name || e.displayName || (Object.defineProperty(e, "name", { value: u }), e.displayName = u);
          }
        }), n;
      }, o.isValidElement = $, o.lazy = function(e) {
        e = { _status: -1, _result: e };
        var n = {
          $$typeof: F,
          _payload: e,
          _init: oe
        }, s = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        return e._ioInfo = s, n._debugInfo = [{ awaited: s }], n;
      }, o.memo = function(e, n) {
        e == null && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          e === null ? "null" : typeof e
        ), n = {
          $$typeof: N,
          type: e,
          compare: n === void 0 ? null : n
        };
        var s;
        return Object.defineProperty(n, "displayName", {
          enumerable: !1,
          configurable: !0,
          get: function() {
            return s;
          },
          set: function(u) {
            s = u, e.name || e.displayName || (Object.defineProperty(e, "name", { value: u }), e.displayName = u);
          }
        }), n;
      }, o.startTransition = function(e) {
        var n = y.T, s = {};
        s._updatedFibers = /* @__PURE__ */ new Set(), y.T = s;
        try {
          var u = e(), l = y.S;
          l !== null && l(s, u), typeof u == "object" && u !== null && typeof u.then == "function" && (y.asyncTransitions++, u.then(se, se), u.then(j, Me));
        } catch (v) {
          Me(v);
        } finally {
          n === null && s._updatedFibers && (e = s._updatedFibers.size, s._updatedFibers.clear(), 10 < e && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), n !== null && s.types !== null && (n.types !== null && n.types !== s.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), n.types = s.types), y.T = n;
        }
      }, o.unstable_useCacheRefresh = function() {
        return k().useCacheRefresh();
      }, o.use = function(e) {
        return k().use(e);
      }, o.useActionState = function(e, n, s) {
        return k().useActionState(
          e,
          n,
          s
        );
      }, o.useCallback = function(e, n) {
        return k().useCallback(e, n);
      }, o.useContext = function(e) {
        var n = k();
        return e.$$typeof === f && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        ), n.useContext(e);
      }, o.useDebugValue = function(e, n) {
        return k().useDebugValue(e, n);
      }, o.useDeferredValue = function(e, n) {
        return k().useDeferredValue(e, n);
      }, o.useEffect = function(e, n) {
        return e == null && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), k().useEffect(e, n);
      }, o.useEffectEvent = function(e) {
        return k().useEffectEvent(e);
      }, o.useId = function() {
        return k().useId();
      }, o.useImperativeHandle = function(e, n, s) {
        return k().useImperativeHandle(e, n, s);
      }, o.useInsertionEffect = function(e, n) {
        return e == null && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), k().useInsertionEffect(e, n);
      }, o.useLayoutEffect = function(e, n) {
        return e == null && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        ), k().useLayoutEffect(e, n);
      }, o.useMemo = function(e, n) {
        return k().useMemo(e, n);
      }, o.useOptimistic = function(e, n) {
        return k().useOptimistic(e, n);
      }, o.useReducer = function(e, n, s) {
        return k().useReducer(e, n, s);
      }, o.useRef = function(e) {
        return k().useRef(e);
      }, o.useState = function(e) {
        return k().useState(e);
      }, o.useSyncExternalStore = function(e, n, s) {
        return k().useSyncExternalStore(
          e,
          n,
          s
        );
      }, o.useTransition = function() {
        return k().useTransition();
      }, o.version = "19.2.3", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  })(ie, ie.exports)), ie.exports;
}
var He;
function ct() {
  return He || (He = 1, process.env.NODE_ENV === "production" ? ge.exports = ut() : ge.exports = it()), ge.exports;
}
ct();
class ft extends at {
  state = {
    teams: [],
    buzzQueue: [],
    activeQuestionValue: null,
    buzzerLocked: !1
  };
  async onStart() {
    this.sql`CREATE TABLE IF NOT EXISTS state (key TEXT PRIMARY KEY, value TEXT)`;
    const o = this.sql`SELECT value FROM state WHERE key = 'game'`;
    o.length > 0 && (this.state = JSON.parse(o[0].value));
  }
  saveState() {
    this.sql`INSERT OR REPLACE INTO state (key, value) VALUES ('game', ${JSON.stringify(this.state)})`;
  }
  // ── Helpers ──────────────────────────────────────────────────────────────
  broadcastMessage(o) {
    this.broadcast(JSON.stringify(o));
  }
  sendState() {
    this.saveState(), this.broadcastMessage({ type: "state", state: this.state });
  }
  getTeam(o) {
    return this.state.teams.find((i) => i.name === o);
  }
  ensureTeam(o) {
    this.getTeam(o) || this.state.teams.push({ name: o, score: 0 });
  }
  // ── Lifecycle ────────────────────────────────────────────────────────────
  onConnect(o, i) {
    console.debug("[Server] onConnect", { connectionId: o.id, server: this.name }), o.send(JSON.stringify({ type: "state", state: this.state }));
  }
  onMessage(o, i) {
    console.debug("[Server] onMessage", i);
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
        if (this.state.buzzQueue.some((R) => R.teamName === c.teamName)) break;
        const g = {
          teamName: c.teamName,
          timestamp: Date.now()
        };
        this.state.buzzQueue.push(g), this.state.buzzerLocked = !0, this.sendState();
        const C = this.state.buzzQueue.length;
        this.broadcastMessage({ type: "buzz-received", teamName: c.teamName, position: C });
        break;
      }
      // Host opens a question — unlocks buzzers for this value
      case "set-question": {
        console.debug("[Server] set-question", { value: c.value }), this.state.activeQuestionValue = c.value, this.state.buzzQueue = [], this.state.buzzerLocked = !1, this.sendState();
        break;
      }
      // Host accepts the current answering team's answer → award points
      case "accept": {
        const d = this.state.activeQuestionValue ?? c.questionValue;
        this.ensureTeam(c.teamName);
        const g = this.getTeam(c.teamName);
        g.score += d, this.state.activeQuestionValue = null, this.state.buzzQueue = [], this.state.buzzerLocked = !1, this.sendState();
        break;
      }
      // Host rejects the current answering team → deduct, open for steal
      case "reject": {
        const d = this.state.activeQuestionValue ?? c.questionValue;
        this.ensureTeam(c.teamName);
        const g = this.getTeam(c.teamName);
        g.score = Math.max(0, g.score - d), this.state.buzzQueue = this.state.buzzQueue.filter((C) => C.teamName !== c.teamName), this.state.buzzerLocked = this.state.buzzQueue.length > 0, this.sendState();
        break;
      }
      // Host closes the question without awarding anyone
      case "close-question": {
        this.state.activeQuestionValue = null, this.state.buzzQueue = [], this.state.buzzerLocked = !1, this.sendState();
        break;
      }
      // Full reset for a new game
      case "reset": {
        this.state = {
          teams: this.state.teams.map((d) => ({ ...d, score: 0 })),
          // keep teams, zero scores
          buzzQueue: [],
          activeQuestionValue: null,
          buzzerLocked: !1
        }, this.sendState();
        break;
      }
    }
  }
}
const ht = {
  async fetch(r, o) {
    return await st(r, o) || new Response("Not Found", { status: 404 });
  }
};
export {
  ft as BridalJeopardyServer,
  ht as default
};
