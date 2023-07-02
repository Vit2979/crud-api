(() => {
  "use strict";
  var t = {
    n: (e) => {
      var n = e && e.__esModule ? () => e.default : () => e;
      return t.d(n, { a: n }), n;
    },
    d: (e, n) => {
      for (var r in n)
        t.o(n, r) &&
          !t.o(e, r) &&
          Object.defineProperty(e, r, { enumerable: !0, get: n[r] });
    },
    o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
  };
  const e = require("http"),
    n = require("crypto");
  var r = t.n(n);
  const o = new Uint8Array(256);
  let i = o.length;
  function s() {
    return (
      i > o.length - 16 && (r().randomFillSync(o), (i = 0)),
      o.slice(i, (i += 16))
    );
  }
  const c =
      /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
    u = [];
  for (let t = 0; t < 256; ++t) u.push((t + 256).toString(16).substr(1));
  const a = function (t, e = 0) {
      const n = (
        u[t[e + 0]] +
        u[t[e + 1]] +
        u[t[e + 2]] +
        u[t[e + 3]] +
        "-" +
        u[t[e + 4]] +
        u[t[e + 5]] +
        "-" +
        u[t[e + 6]] +
        u[t[e + 7]] +
        "-" +
        u[t[e + 8]] +
        u[t[e + 9]] +
        "-" +
        u[t[e + 10]] +
        u[t[e + 11]] +
        u[t[e + 12]] +
        u[t[e + 13]] +
        u[t[e + 14]] +
        u[t[e + 15]]
      ).toLowerCase();
      if (
        !(function (t) {
          return "string" == typeof t && c.test(t);
        })(n)
      )
        throw TypeError("Stringified UUID is invalid");
      return n;
    },
    f = function (t, e, n) {
      const r = (t = t || {}).random || (t.rng || s)();
      if (((r[6] = (15 & r[6]) | 64), (r[8] = (63 & r[8]) | 128), e)) {
        n = n || 0;
        for (let t = 0; t < 16; ++t) e[n + t] = r[t];
        return e;
      }
      return a(r);
    };
  var d = function (t, e, n, r) {
      return new (n || (n = Promise))(function (o, i) {
        function s(t) {
          try {
            u(r.next(t));
          } catch (t) {
            i(t);
          }
        }
        function c(t) {
          try {
            u(r.throw(t));
          } catch (t) {
            i(t);
          }
        }
        function u(t) {
          var e;
          t.done
            ? o(t.value)
            : ((e = t.value),
              e instanceof n
                ? e
                : new n(function (t) {
                    t(e);
                  })).then(s, c);
        }
        u((r = r.apply(t, e || [])).next());
      });
    },
    l = function (t, e, n, r) {
      return new (n || (n = Promise))(function (o, i) {
        function s(t) {
          try {
            u(r.next(t));
          } catch (t) {
            i(t);
          }
        }
        function c(t) {
          try {
            u(r.throw(t));
          } catch (t) {
            i(t);
          }
        }
        function u(t) {
          var e;
          t.done
            ? o(t.value)
            : ((e = t.value),
              e instanceof n
                ? e
                : new n(function (t) {
                    t(e);
                  })).then(s, c);
        }
        u((r = r.apply(t, e || [])).next());
      });
    };
  const h = (t, e, n) => {
      t.writeHead(e, { "Content-Type": "application/json" }), t.end(n);
    },
    v = new (class {
      constructor() {
        this.users = [];
      }
      getUsers() {
        return d(this, void 0, void 0, function* () {
          return this.users;
        });
      }
      addUser() {
        return d(this, void 0, void 0, function* () {
          const t = { id: this.getId(), username: "", age: 0, hobbies: [] };
          return this.users.push(t), t;
        });
      }
      getId() {
        let t = "",
          e = !1;
        for (; !e; ) {
          t = f();
          let n = !1;
          this.users.forEach((e) => {
            e.id === t && (n = !0);
          }),
            n || (e = !0);
        }
        return t;
      }
    })(),
    y = (0, e.createServer)((t, e) => {
      const { method: n, url: r } = t;
      if (n && r)
        if ("GET" === n && "/api/users" === r)
          ((t, e) => {
            l(void 0, void 0, void 0, function* () {
              let n,
                r = "";
              try {
                const t = yield e.getUsers();
                (r = JSON.stringify(t)), (n = 200);
              } catch (t) {
                (r = JSON.stringify({ message: "Errors on the server side" })),
                  (n = 500);
              }
              h(t, n, r);
            });
          })(e, v);
        else if ("POST" === n && "/api/users" === r)
          ((t, e) => {
            l(void 0, void 0, void 0, function* () {
              let n,
                r = "";
              try {
                const t = yield e.addUser();
                (r = JSON.stringify(t)), (n = 201);
              } catch (t) {
                (r = JSON.stringify({ message: "Errors on the server side" })),
                  (n = 500);
              }
              h(t, n, r);
            });
          })(e, v);
        else {
          const t = JSON.stringify({ message: "Route Not Found" }),
            n = 404;
          e.writeHead(n, { "Content-Type": "application/json" }), e.end(t);
        }
    });
  y.listen(5e3, "localhost", () => {
    console.log("Сервер запущен на порту 5000");
  });
})();
