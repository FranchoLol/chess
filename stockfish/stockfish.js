/*!
 * Stockfish copyright T. Romstad, M. Costalba, J. Kiiski, G. Linscott
 * and other contributors.
 *
 * Released under the GNU General Public License v3.
 *
 * Compiled to JavaScript and WebAssembly by Niklas Fiekas
 * <niklas.fiekas@backscattering.de> using Emscripten.
 *
 * https://github.com/niklasf/stockfish.wasm
 */

var Stockfish = (function () {
  var _scriptDir =
    typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return function (Stockfish) {
    Stockfish = Stockfish || {};

    function d() {
      k.buffer != l && n(k.buffer);
      return ba;
    }
    function t() {
      k.buffer != l && n(k.buffer);
      return ca;
    }
    function v() {
      k.buffer != l && n(k.buffer);
      return da;
    }
    function y() {
      k.buffer != l && n(k.buffer);
      return ea;
    }
    function fa() {
      k.buffer != l && n(k.buffer);
      return ha;
    }
    null;
    var z;
    z || (z = typeof Stockfish !== "undefined" ? Stockfish : {});
    var ia, ja;
    z.ready = new Promise(function (a, b) {
      ia = a;
      ja = b;
    });
    (function () {
      function a() {
        var g = e.shift();
        if (!b && void 0 !== g) {
          if ("quit" === g) return z.terminate();
          var m = z.ccall("uci_command", "number", ["string"], [g]);
          m && e.unshift(g);
          h = m ? 2 * h : 1;
          setTimeout(a, h);
        }
      }
      var b = !1,
        c = [];
      z.print = function (g) {
        0 === c.length
          ? console.log(g)
          : setTimeout(function () {
              for (var m = 0; m < c.length; m++) c[m](g);
            });
      };
      z.addMessageListener = function (g) {
        c.push(g);
      };
      z.removeMessageListener = function (g) {
        g = c.indexOf(g);
        0 <= g && c.splice(g, 1);
      };
      z.terminate = function () {
        b = !0;
        A.Ea();
      };
      var e = [],
        h = 1;
      z.postMessage = function (g) {
        e.push(g);
      };
      z.postRun = function () {
        z.postMessage = function (g) {
          e.push(g);
          1 === e.length && a();
        };
        a();
      };
    })();
    var B = {},
      C;
    for (C in z) z.hasOwnProperty(C) && (B[C] = z[C]);
    var ka = [],
      la = "./this.program";
    function ma(a, b) {
      throw b;
    }
    var na = !1,
      D = !1,
      E = !1;
    na = "object" === typeof window;
    D = "function" === typeof importScripts;
    E =
      "object" === typeof process &&
      "object" === typeof process.versions &&
      "string" === typeof process.versions.node;
    var F = z.ENVIRONMENT_IS_PTHREAD || !1;
    F && (l = z.buffer);
    var G = "";
    function oa(a) {
      return z.locateFile ? z.locateFile(a, G) : G + a;
    }
    var H, I, J, K;
    if (E) {
      G = D ? require("path").dirname(G) + "/" : __dirname + "/";
      H = function (a, b) {
        J || (J = require("fs"));
        K || (K = require("path"));
        a = K.normalize(a);
        return J.readFileSync(a, b ? null : "utf8");
      };
      I = function (a) {
        a = H(a, !0);
        a.buffer || (a = new Uint8Array(a));
        assert(a.buffer);
        return a;
      };
      1 < process.argv.length && (la = process.argv[1].replace(/\\/g, "/"));
      ka = process.argv.slice(2);
      process.on("uncaughtException", function (a) {
        if (!(a instanceof L)) throw a;
      });
      process.on("unhandledRejection", M);
      ma = function (a) {
        process.exit(a);
      };
      z.inspect = function () {
        return "[Emscripten Module object]";
      };
      var pa;
      try {
        pa = require("worker_threads");
      } catch (a) {
        throw (
          (console.error(
            'The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?'
          ),
          a)
        );
      }
      global.Worker = pa.Worker;
    } else if (na || D)
      D
        ? (G = self.location.href)
        : "undefined" !== typeof document &&
          document.currentScript &&
          (G = document.currentScript.src),
        _scriptDir && (G = _scriptDir),
        0 !== G.indexOf("blob:")
          ? (G = G.substr(0, G.lastIndexOf("/") + 1))
          : (G = ""),
        E
          ? ((H = function (a, b) {
              J || (J = require("fs"));
              K || (K = require("path"));
              a = K.normalize(a);
              return J.readFileSync(a, b ? null : "utf8");
            }),
            (I = function (a) {
              a = H(a, !0);
              a.buffer || (a = new Uint8Array(a));
              assert(a.buffer);
              return a;
            }))
          : ((H = function (a) {
              var b = new XMLHttpRequest();
              b.open("GET", a, !1);
              b.send(null);
              return b.responseText;
            }),
            D &&
              (I = function (a) {
                var b = new XMLHttpRequest();
                b.open("GET", a, !1);
                b.responseType = "arraybuffer";
                b.send(null);
                return new Uint8Array(b.response);
              }));
    E &&
      "undefined" === typeof performance &&
      (global.performance = require("perf_hooks").performance);
    var qa = z.print || console.log.bind(console),
      N = z.printErr || console.warn.bind(console);
    for (C in B) B.hasOwnProperty(C) && (z[C] = B[C]);
    B = null;
    z.arguments && (ka = z.arguments);
    z.thisProgram && (la = z.thisProgram);
    z.quit && (ma = z.quit);
    var ra, P;
    z.wasmBinary && (P = z.wasmBinary);
    var noExitRuntime;
    z.noExitRuntime && (noExitRuntime = z.noExitRuntime);
    "object" !== typeof WebAssembly && M("no native wasm support detected");
    var k,
      ta,
      ua = !1;
    function assert(a, b) {
      a || M("Assertion failed: " + b);
    }
    function va(a) {
      var b = z["_" + a];
      assert(
        b,
        "Cannot call unknown function " + a + ", make sure it is exported"
      );
      return b;
    }
    function wa(a, b, c) {
      c = b + c;
      for (var e = ""; !(b >= c); ) {
        var h = a[b++];
        if (!h) break;
        if (h & 128) {
          var g = a[b++] & 63;
          if (192 == (h & 224)) e += String.fromCharCode(((h & 31) << 6) | g);
          else {
            var m = a[b++] & 63;
            h =
              224 == (h & 240)
                ? ((h & 15) << 12) | (g << 6) | m
                : ((h & 7) << 18) | (g << 12) | (m << 6) | (a[b++] & 63);
            65536 > h
              ? (e += String.fromCharCode(h))
              : ((h -= 65536),
                (e += String.fromCharCode(
                  55296 | (h >> 10),
                  56320 | (h & 1023)
                )));
          }
        } else e += String.fromCharCode(h);
      }
      return e;
    }
    function Q(a) {
      return a ? wa(t(), a, void 0) : "";
    }
    function xa(a, b, c, e) {
      if (0 < e) {
        e = c + e - 1;
        for (var h = 0; h < a.length; ++h) {
          var g = a.charCodeAt(h);
          if (55296 <= g && 57343 >= g) {
            var m = a.charCodeAt(++h);
            g = (65536 + ((g & 1023) << 10)) | (m & 1023);
          }
          if (127 >= g) {
            if (c >= e) break;
            b[c++] = g;
          } else {
            if (2047 >= g) {
              if (c + 1 >= e) break;
              b[c++] = 192 | (g >> 6);
            } else {
              if (65535 >= g) {
                if (c + 2 >= e) break;
                b[c++] = 224 | (g >> 12);
              } else {
                if (c + 3 >= e) break;
                b[c++] = 240 | (g >> 18);
                b[c++] = 128 | ((g >> 12) & 63);
              }
              b[c++] = 128 | ((g >> 6) & 63);
            }
            b[c++] = 128 | (g & 63);
          }
        }
        b[c] = 0;
      }
    }
    function ya(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var e = a.charCodeAt(c);
        55296 <= e &&
          57343 >= e &&
          (e = (65536 + ((e & 1023) << 10)) | (a.charCodeAt(++c) & 1023));
        127 >= e ? ++b : (b = 2047 >= e ? b + 2 : 65535 >= e ? b + 3 : b + 4);
      }
      return b;
    }
    function za(a) {
      var b = ya(a) + 1,
        c = R(b);
      xa(a, d(), c, b);
      return c;
    }
    function Aa(a, b) {
      d().set(a, b);
    }
    var l, ba, ca, da, ea, ha;
    function n(a) {
      l = a;
      z.HEAP8 = ba = new Int8Array(a);
      z.HEAP16 = new Int16Array(a);
      z.HEAP32 = da = new Int32Array(a);
      z.HEAPU8 = ca = new Uint8Array(a);
      z.HEAPU16 = new Uint16Array(a);
      z.HEAPU32 = ea = new Uint32Array(a);
      z.HEAPF32 = new Float32Array(a);
      z.HEAPF64 = ha = new Float64Array(a);
    }
    var Ba = z.INITIAL_MEMORY || 67108864;
    if (F) (k = z.wasmMemory), (l = z.buffer);
    else if (z.wasmMemory) k = z.wasmMemory;
    else if (
      ((k = new WebAssembly.Memory({
        initial: Ba / 65536,
        maximum: 32768,
        shared: !0,
      })),
      !(k.buffer instanceof SharedArrayBuffer))
    )
      throw (
        (N(
          "requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"
        ),
        E &&
          console.log(
            "(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"
          ),
        Error("bad memory"))
      );
    k && (l = k.buffer);
    Ba = l.byteLength;
    n(l);
    var Ca,
      Da = [],
      Ea = [],
      Fa = [],
      Ga = [];
    F ||
      Ea.push({
        Ia: function () {
          Ha();
        },
      });
    function Ia() {
      var a = z.preRun.shift();
      Da.unshift(a);
    }
    var S = 0,
      Ja = null,
      T = null;
    z.preloadedImages = {};
    z.preloadedAudios = {};
    function M(a) {
      if (z.onAbort) z.onAbort(a);
      F && console.error("Pthread aborting at " + Error().stack);
      N(a);
      ua = !0;
      a = new WebAssembly.RuntimeError(
        "abort(" + a + "). Build with -s ASSERTIONS=1 for more info."
      );
      ja(a);
      throw a;
    }
    function Ka() {
      var a = U;
      return String.prototype.startsWith
        ? a.startsWith("data:application/octet-stream;base64,")
        : 0 === a.indexOf("data:application/octet-stream;base64,");
    }
    var U = "stockfish.wasm";
    Ka() || (U = oa(U));
    function La() {
      var a = U;
      try {
        if (a == U && P) return new Uint8Array(P);
        if (I) return I(a);
        throw "both async and sync fetching of the wasm failed";
      } catch (b) {
        M(b);
      }
    }
    function Ma() {
      return P || (!na && !D) || "function" !== typeof fetch
        ? Promise.resolve().then(function () {
            return La();
          })
        : fetch(U, { credentials: "same-origin" })
            .then(function (a) {
              if (!a.ok) throw "failed to load wasm binary file at '" + U + "'";
              return a.arrayBuffer();
            })
            .catch(function () {
              return La();
            });
    }
    var Oa = {
      11752: function () {
        throw "Canceled!";
      },
      12164: function (a, b) {
        setTimeout(function () {
          Na(a, b);
        }, 0);
      },
    };
    function Pa(a) {
      for (; 0 < a.length; ) {
        var b = a.shift();
        if ("function" == typeof b) b(z);
        else {
          var c = b.Ia;
          "number" === typeof c
            ? void 0 === b.ma
              ? Ca.get(c)()
              : Ca.get(c)(b.ma)
            : c(void 0 === b.ma ? null : b.ma);
        }
      }
    }
    function Qa(a, b) {
      if (0 >= a || a > d().length || a & 1 || 0 > b) return -28;
      if (0 == b) return 0;
      2147483647 <= b && (b = Infinity);
      var c = Atomics.load(v(), V >> 2),
        e = 0;
      if (
        c == a &&
        Atomics.compareExchange(v(), V >> 2, c, 0) == c &&
        (--b, (e = 1), 0 >= b)
      )
        return 1;
      a = Atomics.notify(v(), a >> 2, b);
      if (0 <= a) return a + e;
      throw "Atomics.notify returned an unexpected value " + a;
    }
    z._emscripten_futex_wake = Qa;
    function Ra(a) {
      if (F)
        throw "Internal Error! cleanupThread() can only ever be called from main application thread!";
      if (!a) throw "Internal Error! Null pthread_ptr in cleanupThread!";
      v()[(a + 12) >> 2] = 0;
      (a = A.ga[a]) && A.ta(a.worker);
    }
    var A = {
      fa: [],
      ia: [],
      La: function () {
        for (var a = 0; 1 > a; ++a) A.za();
      },
      Ma: function () {
        for (var a = W(228), b = 0; 57 > b; ++b) y()[a / 4 + b] = 0;
        v()[(a + 12) >> 2] = a;
        b = a + 152;
        v()[b >> 2] = b;
        var c = W(512);
        for (b = 0; 128 > b; ++b) y()[c / 4 + b] = 0;
        Atomics.store(y(), (a + 100) >> 2, c);
        Atomics.store(y(), (a + 40) >> 2, a);
        Sa(a, !D, 1);
        Ta(a);
      },
      Na: function () {
        A.receiveObjectTransfer = A.Pa;
        A.setThreadStatus = A.Ra;
        A.threadCancel = A.Ta;
        A.threadExit = A.Ua;
      },
      ga: {},
      Fa: [],
      Ra: function () {},
      Da: function () {
        for (; 0 < A.Fa.length; ) A.Fa.pop()();
        F && X() && Ua();
      },
      Ua: function (a) {
        var b = X();
        b &&
          (Atomics.store(y(), (b + 4) >> 2, a),
          Atomics.store(y(), (b + 0) >> 2, 1),
          Atomics.store(y(), (b + 56) >> 2, 1),
          Atomics.store(y(), (b + 60) >> 2, 0),
          A.Da(),
          Qa(b + 0, 2147483647),
          Sa(0, 0, 0),
          F && postMessage({ cmd: "exit" }));
      },
      Ta: function () {
        A.Da();
        var a = X();
        Atomics.store(y(), (a + 4) >> 2, -1);
        Atomics.store(y(), (a + 0) >> 2, 1);
        Qa(a + 0, 2147483647);
        Sa(0, 0, 0);
        postMessage({ cmd: "cancelDone" });
      },
      Ea: function () {
        for (var a in A.ga) {
          var b = A.ga[a];
          b && b.worker && A.ta(b.worker);
        }
        A.ga = {};
        for (a = 0; a < A.fa.length; ++a) {
          var c = A.fa[a];
          c.terminate();
        }
        A.fa = [];
        for (a = 0; a < A.ia.length; ++a)
          (c = A.ia[a]), (b = c.ea), A.ya(b), c.terminate();
        A.ia = [];
      },
      ya: function (a) {
        if (a) {
          if (a.ha) {
            var b = v()[(a.ha + 100) >> 2];
            v()[(a.ha + 100) >> 2] = 0;
            Va(b);
            Va(a.ha);
          }
          a.ha = 0;
          a.xa && a.ja && Va(a.ja);
          a.ja = 0;
          a.worker && (a.worker.ea = null);
        }
      },
      ta: function (a) {
        A.Qa(function () {
          delete A.ga[a.ea.ha];
          A.fa.push(a);
          A.ia.splice(A.ia.indexOf(a), 1);
          A.ya(a.ea);
          a.ea = void 0;
        });
      },
      Qa: function (a) {
        v()[Wa >> 2] = 0;
        try {
          a();
        } finally {
          v()[Wa >> 2] = 1;
        }
      },
      Pa: function () {},
      Ba: function (a, b) {
        a.onmessage = function (c) {
          var e = c.data,
            h = e.cmd;
          a.ea && (A.Ga = a.ea.ha);
          if (e.targetThread && e.targetThread != X()) {
            var g = A.ga[e.lb];
            g
              ? g.worker.postMessage(c.data, e.transferList)
              : console.error(
                  'Internal error! Worker sent a message "' +
                    h +
                    '" to target pthread ' +
                    e.targetThread +
                    ", but that thread no longer exists!"
                );
          } else if ("processQueuedMainThreadWork" === h) Xa();
          else if ("spawnThread" === h) Ya(c.data);
          else if ("cleanupThread" === h) Ra(e.thread);
          else if ("killThread" === h) {
            c = e.thread;
            if (F)
              throw "Internal Error! killThread() can only ever be called from main application thread!";
            if (!c) throw "Internal Error! Null pthread_ptr in killThread!";
            v()[(c + 12) >> 2] = 0;
            c = A.ga[c];
            c.worker.terminate();
            A.ya(c);
            A.ia.splice(A.ia.indexOf(c.worker), 1);
            c.worker.ea = void 0;
          } else if ("cancelThread" === h) {
            c = e.thread;
            if (F)
              throw "Internal Error! cancelThread() can only ever be called from main application thread!";
            if (!c) throw "Internal Error! Null pthread_ptr in cancelThread!";
            A.ga[c].worker.postMessage({ cmd: "cancel" });
          } else if ("loaded" === h)
            (a.loaded = !0), b && b(a), a.na && (a.na(), delete a.na);
          else if ("print" === h) qa("Thread " + e.threadId + ": " + e.text);
          else if ("printErr" === h) N("Thread " + e.threadId + ": " + e.text);
          else if ("alert" === h) alert("Thread " + e.threadId + ": " + e.text);
          else if ("exit" === h)
            a.ea && Atomics.load(y(), (a.ea.ha + 64) >> 2) && A.ta(a);
          else if ("exitProcess" === h)
            try {
              Za(e.returnCode);
            } catch (m) {
              if (m instanceof L) return;
              throw m;
            }
          else
            "cancelDone" === h
              ? A.ta(a)
              : "objectTransfer" !== h &&
                ("setimmediate" === c.data.target
                  ? a.postMessage(c.data)
                  : N("worker sent an unknown command " + h));
          A.Ga = void 0;
        };
        a.onerror = function (c) {
          N(
            "pthread sent an error! " +
              c.filename +
              ":" +
              c.lineno +
              ": " +
              c.message
          );
        };
        E &&
          (a.on("message", function (c) {
            a.onmessage({ data: c });
          }),
          a.on("error", function (c) {
            a.onerror(c);
          }),
          a.on("exit", function () {}));
        a.postMessage({
          cmd: "load",
          urlOrBlob: z.mainScriptUrlOrBlob || _scriptDir,
          wasmMemory: k,
          wasmModule: ta,
        });
      },
      za: function () {
        var a = oa("stockfish.worker.js");
        A.fa.push(new Worker(a));
      },
      Ja: function () {
        0 == A.fa.length && (A.za(), A.Ba(A.fa[0]));
        return 0 < A.fa.length ? A.fa.pop() : null;
      },
      $a: function (a) {
        for (a = performance.now() + a; performance.now() < a; );
      },
    };
    z.establishStackSpace = function (a, b) {
      $a(a, b);
      Y(a);
    };
    z.getNoExitRuntime = function () {
      return noExitRuntime;
    };
    z.invokeEntryPoint = function (a, b) {
      return Ca.get(a)(b);
    };
    var ab;
    ab = E
      ? function () {
          var a = process.hrtime();
          return 1e3 * a[0] + a[1] / 1e6;
        }
      : F
      ? function () {
          return performance.now() - z.__performance_now_clock_drift;
        }
      : function () {
          return performance.now();
        };
    var bb = [null, [], []],
      cb = {};
    function db(a, b, c) {
      return F ? Z(2, 1, a, b, c) : 0;
    }
    function eb(a, b, c) {
      return F ? Z(3, 1, a, b, c) : 0;
    }
    function fb(a, b, c) {
      if (F) return Z(4, 1, a, b, c);
    }
    function gb() {
      E ||
        D ||
        (ra || (ra = {}),
        ra[
          "Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread"
        ] ||
          ((ra[
            "Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread"
          ] = 1),
          N(
            "Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread"
          )));
    }
    function hb(a, b, c) {
      if (0 >= a || a > d().length || a & 1) return -28;
      if (na) {
        if (Atomics.load(v(), a >> 2) != b) return -6;
        var e = performance.now();
        c = e + c;
        for (Atomics.exchange(v(), V >> 2, a); ; ) {
          e = performance.now();
          if (e > c) return Atomics.exchange(v(), V >> 2, 0), -73;
          e = Atomics.exchange(v(), V >> 2, 0);
          if (0 == e) break;
          Xa();
          if (Atomics.load(v(), a >> 2) != b) return -6;
          Atomics.exchange(v(), V >> 2, a);
        }
        return 0;
      }
      a = Atomics.wait(v(), a >> 2, b, c);
      if ("timed-out" === a) return -73;
      if ("not-equal" === a) return -6;
      if ("ok" === a) return 0;
      throw "Atomics.wait returned an unexpected value " + a;
    }
    function Z(a, b) {
      for (
        var c = arguments.length - 2, e = ib(), h = R(8 * c), g = h >> 3, m = 0;
        m < c;
        m++
      ) {
        var p = arguments[2 + m];
        fa()[g + m] = p;
      }
      c = jb(a, c, h, b);
      Y(e);
      return c;
    }
    var kb = [],
      lb = [],
      mb = [
        0,
        "undefined" !== typeof document ? document : 0,
        "undefined" !== typeof window ? window : 0,
      ];
    function nb(a) {
      a = 2 < a ? Q(a) : a;
      return (
        mb[a] ||
        ("undefined" !== typeof document ? document.querySelector(a) : void 0)
      );
    }
    function ob(a, b, c) {
      var e = nb(a);
      if (!e) return -4;
      e.ra && ((v()[e.ra >> 2] = b), (v()[(e.ra + 4) >> 2] = c));
      if (e.Ca || !e.bb)
        e.Ca && (e = e.Ca),
          (a = !1),
          e.qa &&
            e.qa.pa &&
            ((a = e.qa.pa.getParameter(2978)),
            (a =
              0 === a[0] &&
              0 === a[1] &&
              a[2] === e.width &&
              a[3] === e.height)),
          (e.width = b),
          (e.height = c),
          a && e.qa.pa.viewport(0, 0, b, c);
      else {
        if (e.ra) {
          e = v()[(e.ra + 8) >> 2];
          a = a ? Q(a) : "";
          var h = ib(),
            g = R(12),
            m = 0;
          if (a) {
            m = ya(a) + 1;
            var p = W(m);
            xa(a, t(), p, m);
            m = p;
          }
          v()[g >> 2] = m;
          v()[(g + 4) >> 2] = b;
          v()[(g + 8) >> 2] = c;
          pb(0, e, 657457152, 0, m, g);
          Y(h);
          return 1;
        }
        return -4;
      }
      return 0;
    }
    function qb(a, b, c) {
      return F ? Z(5, 1, a, b, c) : ob(a, b, c);
    }
    function rb(a) {
      var b = a.getExtension("ANGLE_instanced_arrays");
      b &&
        ((a.vertexAttribDivisor = function (c, e) {
          b.vertexAttribDivisorANGLE(c, e);
        }),
        (a.drawArraysInstanced = function (c, e, h, g) {
          b.drawArraysInstancedANGLE(c, e, h, g);
        }),
        (a.drawElementsInstanced = function (c, e, h, g, m) {
          b.drawElementsInstancedANGLE(c, e, h, g, m);
        }));
    }
    function sb(a) {
      var b = a.getExtension("OES_vertex_array_object");
      b &&
        ((a.createVertexArray = function () {
          return b.createVertexArrayOES();
        }),
        (a.deleteVertexArray = function (c) {
          b.deleteVertexArrayOES(c);
        }),
        (a.bindVertexArray = function (c) {
          b.bindVertexArrayOES(c);
        }),
        (a.isVertexArray = function (c) {
          return b.isVertexArrayOES(c);
        }));
    }
    function tb(a) {
      var b = a.getExtension("WEBGL_draw_buffers");
      b &&
        (a.drawBuffers = function (c, e) {
          b.drawBuffersWEBGL(c, e);
        });
    }
    function ub(a) {
      a || (a = vb);
      if (!a.Ka) {
        a.Ka = !0;
        var b = a.pa;
        rb(b);
        sb(b);
        tb(b);
        b.cb = b.getExtension("EXT_disjoint_timer_query");
        b.ib = b.getExtension("WEBGL_multi_draw");
        (b.getSupportedExtensions() || []).forEach(function (c) {
          0 > c.indexOf("lose_context") &&
            0 > c.indexOf("debug") &&
            b.getExtension(c);
        });
      }
    }
    var vb,
      wb = ["default", "low-power", "high-performance"],
      xb = {};
    function yb() {
      if (!zb) {
        var a = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG:
              (
                ("object" === typeof navigator &&
                  navigator.languages &&
                  navigator.languages[0]) ||
                "C"
              ).replace("-", "_") + ".UTF-8",
            _: la || "./this.program",
          },
          b;
        for (b in xb) a[b] = xb[b];
        var c = [];
        for (b in a) c.push(b + "=" + a[b]);
        zb = c;
      }
      return zb;
    }
    var zb;
    function Ab(a, b) {
      if (F) return Z(6, 1, a, b);
      var c = 0;
      yb().forEach(function (e, h) {
        var g = b + c;
        h = v()[(a + 4 * h) >> 2] = g;
        for (g = 0; g < e.length; ++g) d()[h++ >> 0] = e.charCodeAt(g);
        d()[h >> 0] = 0;
        c += e.length + 1;
      });
      return 0;
    }
    function Bb(a, b) {
      if (F) return Z(7, 1, a, b);
      var c = yb();
      v()[a >> 2] = c.length;
      var e = 0;
      c.forEach(function (h) {
        e += h.length + 1;
      });
      v()[b >> 2] = e;
      return 0;
    }
    function Cb(a) {
      return F ? Z(8, 1, a) : 0;
    }
    function Eb(a, b, c, e) {
      if (F) return Z(9, 1, a, b, c, e);
      a = cb.fb(a);
      b = cb.eb(a, b, c);
      v()[e >> 2] = b;
      return 0;
    }
    function Fb(a, b, c, e, h) {
      if (F) return Z(10, 1, a, b, c, e, h);
    }
    function Gb(a, b, c, e) {
      if (F) return Z(11, 1, a, b, c, e);
      for (var h = 0, g = 0; g < c; g++) {
        for (
          var m = v()[(b + 8 * g) >> 2], p = v()[(b + (8 * g + 4)) >> 2], u = 0;
          u < p;
          u++
        ) {
          var r = t()[m + u],
            w = bb[a];
          0 === r || 10 === r
            ? ((1 === a ? qa : N)(wa(w, 0)), (w.length = 0))
            : w.push(r);
        }
        h += p;
      }
      v()[e >> 2] = h;
      return 0;
    }
    function Ya(a) {
      if (F)
        throw "Internal Error! spawnThread() can only ever be called from main application thread!";
      var b = A.Ja();
      if (void 0 !== b.ea) throw "Internal error!";
      if (!a.sa) throw "Internal error, no pthread ptr!";
      A.ia.push(b);
      for (var c = W(512), e = 0; 128 > e; ++e) v()[(c + 4 * e) >> 2] = 0;
      var h = a.ja + a.ka;
      e = A.ga[a.sa] = { worker: b, ja: a.ja, ka: a.ka, xa: a.xa, ha: a.sa };
      var g = e.ha >> 2;
      Atomics.store(y(), g + 16, a.detached);
      Atomics.store(y(), g + 25, c);
      Atomics.store(y(), g + 10, e.ha);
      Atomics.store(y(), g + 20, a.ka);
      Atomics.store(y(), g + 19, h);
      Atomics.store(y(), g + 26, a.ka);
      Atomics.store(y(), g + 28, h);
      Atomics.store(y(), g + 29, a.detached);
      c = Hb() + 40;
      Atomics.store(y(), g + 43, c);
      b.ea = e;
      var m = {
        cmd: "run",
        start_routine: a.Sa,
        arg: a.ma,
        threadInfoStruct: a.sa,
        stackBase: a.ja,
        stackSize: a.ka,
      };
      b.na = function () {
        m.time = performance.now();
        b.postMessage(m, a.Za);
      };
      b.loaded && (b.na(), delete b.na);
    }
    function Ib(a, b) {
      if (!a) return N("pthread_join attempted on a null thread pointer!"), 71;
      if (F && X() == a)
        return N("PThread " + a + " is attempting to join to itself!"), 16;
      if (!F && Jb() == a)
        return N("Main thread " + a + " is attempting to join to itself!"), 16;
      if (v()[(a + 12) >> 2] !== a)
        return (
          N(
            "pthread_join attempted on thread " +
              a +
              ", which does not point to a valid thread, or does not exist anymore!"
          ),
          71
        );
      if (Atomics.load(y(), (a + 64) >> 2))
        return (
          N("Attempted to join thread " + a + ", which was already detached!"),
          28
        );
      for (gb(); ; ) {
        var c = Atomics.load(y(), (a + 0) >> 2);
        if (1 == c)
          return (
            (c = Atomics.load(y(), (a + 4) >> 2)),
            b && (v()[b >> 2] = c),
            Atomics.store(y(), (a + 64) >> 2, 1),
            F ? postMessage({ cmd: "cleanupThread", thread: a }) : Ra(a),
            0
          );
        if (F) {
          var e = X();
          if (
            e &&
            !Atomics.load(y(), (e + 56) >> 2) &&
            2 == Atomics.load(y(), (e + 0) >> 2)
          )
            throw "Canceled!";
        }
        F || Xa();
        hb(a + 0, c, F ? 100 : 1);
      }
    }
    function Kb(a) {
      return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
    }
    function Lb(a, b) {
      for (var c = 0, e = 0; e <= b; c += a[e++]);
      return c;
    }
    var Mb = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Nb = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function Ob(a, b) {
      for (a = new Date(a.getTime()); 0 < b; ) {
        var c = a.getMonth(),
          e = (Kb(a.getFullYear()) ? Mb : Nb)[c];
        if (b > e - a.getDate())
          (b -= e - a.getDate() + 1),
            a.setDate(1),
            11 > c
              ? a.setMonth(c + 1)
              : (a.setMonth(0), a.setFullYear(a.getFullYear() + 1));
        else {
          a.setDate(a.getDate() + b);
          break;
        }
      }
      return a;
    }
    function Pb(a, b, c, e) {
      function h(f, q, x) {
        for (f = "number" === typeof f ? f.toString() : f || ""; f.length < q; )
          f = x[0] + f;
        return f;
      }
      function g(f, q) {
        return h(f, q, "0");
      }
      function m(f, q) {
        function x(Db) {
          return 0 > Db ? -1 : 0 < Db ? 1 : 0;
        }
        var O;
        0 === (O = x(f.getFullYear() - q.getFullYear())) &&
          0 === (O = x(f.getMonth() - q.getMonth())) &&
          (O = x(f.getDate() - q.getDate()));
        return O;
      }
      function p(f) {
        switch (f.getDay()) {
          case 0:
            return new Date(f.getFullYear() - 1, 11, 29);
          case 1:
            return f;
          case 2:
            return new Date(f.getFullYear(), 0, 3);
          case 3:
            return new Date(f.getFullYear(), 0, 2);
          case 4:
            return new Date(f.getFullYear(), 0, 1);
          case 5:
            return new Date(f.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(f.getFullYear() - 1, 11, 30);
        }
      }
      function u(f) {
        f = Ob(new Date(f.da + 1900, 0, 1), f.wa);
        var q = new Date(f.getFullYear() + 1, 0, 4),
          x = p(new Date(f.getFullYear(), 0, 4));
        q = p(q);
        return 0 >= m(x, f)
          ? 0 >= m(q, f)
            ? f.getFullYear() + 1
            : f.getFullYear()
          : f.getFullYear() - 1;
      }
      var r = v()[(e + 40) >> 2];
      e = {
        Xa: v()[e >> 2],
        Wa: v()[(e + 4) >> 2],
        ua: v()[(e + 8) >> 2],
        oa: v()[(e + 12) >> 2],
        la: v()[(e + 16) >> 2],
        da: v()[(e + 20) >> 2],
        va: v()[(e + 24) >> 2],
        wa: v()[(e + 28) >> 2],
        mb: v()[(e + 32) >> 2],
        Va: v()[(e + 36) >> 2],
        Ya: r ? Q(r) : "",
      };
      c = Q(c);
      r = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y",
      };
      for (var w in r) c = c.replace(new RegExp(w, "g"), r[w]);
      var aa = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
          " "
        ),
        sa =
          "January February March April May June July August September October November December".split(
            " "
          );
      r = {
        "%a": function (f) {
          return aa[f.va].substring(0, 3);
        },
        "%A": function (f) {
          return aa[f.va];
        },
        "%b": function (f) {
          return sa[f.la].substring(0, 3);
        },
        "%B": function (f) {
          return sa[f.la];
        },
        "%C": function (f) {
          return g(((f.da + 1900) / 100) | 0, 2);
        },
        "%d": function (f) {
          return g(f.oa, 2);
        },
        "%e": function (f) {
          return h(f.oa, 2, " ");
        },
        "%g": function (f) {
          return u(f).toString().substring(2);
        },
        "%G": function (f) {
          return u(f);
        },
        "%H": function (f) {
          return g(f.ua, 2);
        },
        "%I": function (f) {
          f = f.ua;
          0 == f ? (f = 12) : 12 < f && (f -= 12);
          return g(f, 2);
        },
        "%j": function (f) {
          return g(f.oa + Lb(Kb(f.da + 1900) ? Mb : Nb, f.la - 1), 3);
        },
        "%m": function (f) {
          return g(f.la + 1, 2);
        },
        "%M": function (f) {
          return g(f.Wa, 2);
        },
        "%n": function () {
          return "\n";
        },
        "%p": function (f) {
          return 0 <= f.ua && 12 > f.ua ? "AM" : "PM";
        },
        "%S": function (f) {
          return g(f.Xa, 2);
        },
        "%t": function () {
          return "\t";
        },
        "%u": function (f) {
          return f.va || 7;
        },
        "%U": function (f) {
          var q = new Date(f.da + 1900, 0, 1),
            x = 0 === q.getDay() ? q : Ob(q, 7 - q.getDay());
          f = new Date(f.da + 1900, f.la, f.oa);
          return 0 > m(x, f)
            ? g(
                Math.ceil(
                  (31 -
                    x.getDate() +
                    (Lb(Kb(f.getFullYear()) ? Mb : Nb, f.getMonth() - 1) - 31) +
                    f.getDate()) /
                    7
                ),
                2
              )
            : 0 === m(x, q)
            ? "01"
            : "00";
        },
        "%V": function (f) {
          var q = new Date(f.da + 1901, 0, 4),
            x = p(new Date(f.da + 1900, 0, 4));
          q = p(q);
          var O = Ob(new Date(f.da + 1900, 0, 1), f.wa);
          return 0 > m(O, x)
            ? "53"
            : 0 >= m(q, O)
            ? "01"
            : g(
                Math.ceil(
                  (x.getFullYear() < f.da + 1900
                    ? f.wa + 32 - x.getDate()
                    : f.wa + 1 - x.getDate()) / 7
                ),
                2
              );
        },
        "%w": function (f) {
          return f.va;
        },
        "%W": function (f) {
          var q = new Date(f.da, 0, 1),
            x =
              1 === q.getDay()
                ? q
                : Ob(q, 0 === q.getDay() ? 1 : 7 - q.getDay() + 1);
          f = new Date(f.da + 1900, f.la, f.oa);
          return 0 > m(x, f)
            ? g(
                Math.ceil(
                  (31 -
                    x.getDate() +
                    (Lb(Kb(f.getFullYear()) ? Mb : Nb, f.getMonth() - 1) - 31) +
                    f.getDate()) /
                    7
                ),
                2
              )
            : 0 === m(x, q)
            ? "01"
            : "00";
        },
        "%y": function (f) {
          return (f.da + 1900).toString().substring(2);
        },
        "%Y": function (f) {
          return f.da + 1900;
        },
        "%z": function (f) {
          f = f.Va;
          var q = 0 <= f;
          f = Math.abs(f) / 60;
          return (
            (q ? "+" : "-") +
            String("0000" + ((f / 60) * 100 + (f % 60))).slice(-4)
          );
        },
        "%Z": function (f) {
          return f.Ya;
        },
        "%%": function () {
          return "%";
        },
      };
      for (w in r)
        0 <= c.indexOf(w) && (c = c.replace(new RegExp(w, "g"), r[w](e)));
      w = Qb(c);
      if (w.length > b) return 0;
      Aa(w, a);
      return w.length - 1;
    }
    F || A.La();
    var Rb = [
      null,
      function (a, b) {
        if (F) return Z(1, 1, a, b);
      },
      db,
      eb,
      fb,
      qb,
      Ab,
      Bb,
      Cb,
      Eb,
      Fb,
      Gb,
    ];
    function Qb(a) {
      var b = Array(ya(a) + 1);
      xa(a, b, 0, b.length);
      return b;
    }
    var Vb = {
      c: function (a, b, c, e) {
        M(
          "Assertion failed: " +
            Q(a) +
            ", at: " +
            [b ? Q(b) : "unknown filename", c, e ? Q(e) : "unknown function"]
        );
      },
      i: db,
      q: eb,
      r: fb,
      E: function (a, b) {
        if (a == b) postMessage({ cmd: "processQueuedMainThreadWork" });
        else if (F) postMessage({ targetThread: a, cmd: "processThreadQueue" });
        else {
          a = (a = A.ga[a]) && a.worker;
          if (!a) return;
          a.postMessage({ cmd: "processThreadQueue" });
        }
        return 1;
      },
      b: function () {
        M();
      },
      v: function (a, b) {
        if (0 === a) a = Date.now();
        else if (1 === a || 4 === a) a = ab();
        else return (v()[Sb() >> 2] = 28), -1;
        v()[b >> 2] = (a / 1e3) | 0;
        v()[(b + 4) >> 2] = ((a % 1e3) * 1e6) | 0;
        return 0;
      },
      n: function (a, b, c) {
        lb.length = 0;
        var e;
        for (c >>= 2; (e = t()[b++]); )
          (e = 105 > e) && c & 1 && c++,
            lb.push(e ? fa()[c++ >> 1] : v()[c]),
            ++c;
        return Oa[a].apply(null, lb);
      },
      z: gb,
      m: function () {},
      f: hb,
      e: Qa,
      g: ab,
      u: function (a, b, c) {
        t().copyWithin(a, b, b + c);
      },
      A: function (a, b, c) {
        kb.length = b;
        c >>= 3;
        for (var e = 0; e < b; e++) kb[e] = fa()[c + e];
        return (0 > a ? Oa[-a - 1] : Rb[a]).apply(null, kb);
      },
      d: function (a) {
        a >>>= 0;
        var b = t().length;
        if (a <= b || 2147483648 < a) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var e = b * (1 + 0.2 / c);
          e = Math.min(e, a + 100663296);
          e = Math.max(16777216, a, e);
          0 < e % 65536 && (e += 65536 - (e % 65536));
          a: {
            try {
              k.grow((Math.min(2147483648, e) - l.byteLength + 65535) >>> 16);
              n(k.buffer);
              var h = 1;
              break a;
            } catch (g) {}
            h = void 0;
          }
          if (h) return !0;
        }
        return !1;
      },
      C: function (a, b, c) {
        return nb(a) ? ob(a, b, c) : qb(a, b, c);
      },
      l: function () {},
      D: function (a, b) {
        b >>= 2;
        var c = v()[b + 6];
        b = {
          alpha: !!v()[b],
          depth: !!v()[b + 1],
          stencil: !!v()[b + 2],
          antialias: !!v()[b + 3],
          premultipliedAlpha: !!v()[b + 4],
          preserveDrawingBuffer: !!v()[b + 5],
          powerPreference: wb[c],
          failIfMajorPerformanceCaveat: !!v()[b + 7],
          Oa: v()[b + 8],
          hb: v()[b + 9],
          Aa: v()[b + 10],
          Ha: v()[b + 11],
          jb: v()[b + 12],
          kb: v()[b + 13],
        };
        a = nb(a);
        if (!a || b.Ha) b = 0;
        else if ((a = a.getContext("webgl", b))) {
          c = W(8);
          v()[(c + 4) >> 2] = X();
          var e = { gb: c, attributes: b, version: b.Oa, pa: a };
          a.canvas && (a.canvas.qa = e);
          ("undefined" === typeof b.Aa || b.Aa) && ub(e);
          b = c;
        } else b = 0;
        return b;
      },
      x: Ab,
      y: Bb,
      h: function (a) {
        Za(a);
      },
      j: Cb,
      p: Eb,
      s: Fb,
      o: Gb,
      t: function () {
        A.Ma();
      },
      a: k || z.wasmMemory,
      k: function (a, b, c, e) {
        if ("undefined" === typeof SharedArrayBuffer)
          return (
            N(
              "Current environment does not support SharedArrayBuffer, pthreads are not available!"
            ),
            6
          );
        if (!a)
          return N("pthread_create called with a null thread pointer!"), 28;
        var h = [];
        if (F && 0 === h.length) return Tb(687865856, a, b, c, e);
        var g = 0,
          m = 0;
        if (b && -1 != b) {
          var p = v()[b >> 2];
          p += 81920;
          g = v()[(b + 8) >> 2];
          m = 0 !== v()[(b + 12) >> 2];
        } else p = 2097152;
        (b = 0 == g) ? (g = Ub(16, p)) : ((g -= p), assert(0 < g));
        for (var u = W(228), r = 0; 57 > r; ++r) y()[(u >> 2) + r] = 0;
        v()[a >> 2] = u;
        v()[(u + 12) >> 2] = u;
        a = u + 152;
        v()[a >> 2] = a;
        c = { ja: g, ka: p, xa: b, detached: m, Sa: c, sa: u, ma: e, Za: h };
        F ? ((c.ab = "spawnThread"), postMessage(c, h)) : Ya(c);
        return 0;
      },
      B: function (a, b) {
        return Ib(a, b);
      },
      w: function (a, b, c, e) {
        return Pb(a, b, c, e);
      },
    };
    (function () {
      function a(h, g) {
        z.asm = h.exports;
        Ca = z.asm.ca;
        ta = g;
        if (!F) {
          var m = A.fa.length;
          A.fa.forEach(function (p) {
            A.Ba(p, function () {
              if (
                !--m &&
                (S--,
                z.monitorRunDependencies && z.monitorRunDependencies(S),
                0 == S && (null !== Ja && (clearInterval(Ja), (Ja = null)), T))
              ) {
                var u = T;
                T = null;
                u();
              }
            });
          });
        }
      }
      function b(h) {
        a(h.instance, h.module);
      }
      function c(h) {
        return Ma()
          .then(function (g) {
            return WebAssembly.instantiate(g, e);
          })
          .then(h, function (g) {
            N("failed to asynchronously prepare wasm: " + g);
            M(g);
          });
      }
      var e = { a: Vb };
      F ||
        (assert(!F, "addRunDependency cannot be used in a pthread worker"),
        S++,
        z.monitorRunDependencies && z.monitorRunDependencies(S));
      if (z.instantiateWasm)
        try {
          return z.instantiateWasm(e, a);
        } catch (h) {
          return (
            N("Module.instantiateWasm callback failed with error: " + h), !1
          );
        }
      (function () {
        return P ||
          "function" !== typeof WebAssembly.instantiateStreaming ||
          Ka() ||
          "function" !== typeof fetch
          ? c(b)
          : fetch(U, { credentials: "same-origin" }).then(function (h) {
              return WebAssembly.instantiateStreaming(h, e).then(
                b,
                function (g) {
                  N("wasm streaming compile failed: " + g);
                  N("falling back to ArrayBuffer instantiation");
                  return c(b);
                }
              );
            });
      })().catch(ja);
      return {};
    })();
    var Ha = (z.___wasm_call_ctors = function () {
      return (Ha = z.___wasm_call_ctors = z.asm.F).apply(null, arguments);
    });
    z._main = function () {
      return (z._main = z.asm.G).apply(null, arguments);
    };
    var W = (z._malloc = function () {
        return (W = z._malloc = z.asm.H).apply(null, arguments);
      }),
      Va = (z._free = function () {
        return (Va = z._free = z.asm.I).apply(null, arguments);
      });
    z._uci_command = function () {
      return (z._uci_command = z.asm.J).apply(null, arguments);
    };
    var Hb = (z._emscripten_get_global_libc = function () {
        return (Hb = z._emscripten_get_global_libc = z.asm.K).apply(
          null,
          arguments
        );
      }),
      Sb = (z.___errno_location = function () {
        return (Sb = z.___errno_location = z.asm.L).apply(null, arguments);
      });
    z.___em_js__initPthreadsJS = function () {
      return (z.___em_js__initPthreadsJS = z.asm.M).apply(null, arguments);
    };
    var X = (z._pthread_self = function () {
        return (X = z._pthread_self = z.asm.N).apply(null, arguments);
      }),
      Ua = (z.___pthread_tsd_run_dtors = function () {
        return (Ua = z.___pthread_tsd_run_dtors = z.asm.O).apply(
          null,
          arguments
        );
      });
    z._emscripten_current_thread_process_queued_calls = function () {
      return (z._emscripten_current_thread_process_queued_calls =
        z.asm.P).apply(null, arguments);
    };
    var Ta = (z._emscripten_register_main_browser_thread_id = function () {
        return (Ta = z._emscripten_register_main_browser_thread_id =
          z.asm.Q).apply(null, arguments);
      }),
      Jb = (z._emscripten_main_browser_thread_id = function () {
        return (Jb = z._emscripten_main_browser_thread_id = z.asm.R).apply(
          null,
          arguments
        );
      }),
      Na = (z.__emscripten_do_dispatch_to_thread = function () {
        return (Na = z.__emscripten_do_dispatch_to_thread = z.asm.S).apply(
          null,
          arguments
        );
      }),
      Tb = (z._emscripten_sync_run_in_main_thread_4 = function () {
        return (Tb = z._emscripten_sync_run_in_main_thread_4 = z.asm.T).apply(
          null,
          arguments
        );
      }),
      Xa = (z._emscripten_main_thread_process_queued_calls = function () {
        return (Xa = z._emscripten_main_thread_process_queued_calls =
          z.asm.U).apply(null, arguments);
      }),
      jb = (z._emscripten_run_in_main_runtime_thread_js = function () {
        return (jb = z._emscripten_run_in_main_runtime_thread_js =
          z.asm.V).apply(null, arguments);
      }),
      pb = (z.__emscripten_call_on_thread = function () {
        return (pb = z.__emscripten_call_on_thread = z.asm.W).apply(
          null,
          arguments
        );
      });
    z._emscripten_tls_init = function () {
      return (z._emscripten_tls_init = z.asm.X).apply(null, arguments);
    };
    var Sa = (z.__emscripten_thread_init = function () {
        return (Sa = z.__emscripten_thread_init = z.asm.Y).apply(
          null,
          arguments
        );
      }),
      ib = (z.stackSave = function () {
        return (ib = z.stackSave = z.asm.Z).apply(null, arguments);
      }),
      Y = (z.stackRestore = function () {
        return (Y = z.stackRestore = z.asm._).apply(null, arguments);
      }),
      R = (z.stackAlloc = function () {
        return (R = z.stackAlloc = z.asm.$).apply(null, arguments);
      }),
      $a = (z._emscripten_stack_set_limits = function () {
        return ($a = z._emscripten_stack_set_limits = z.asm.aa).apply(
          null,
          arguments
        );
      }),
      Ub = (z._memalign = function () {
        return (Ub = z._memalign = z.asm.ba).apply(null, arguments);
      }),
      Wa = (z.__emscripten_allow_main_runtime_queued_calls = 25580),
      V = (z.__emscripten_main_thread_futex = 1088592);
    z.ccall = function (a, b, c, e) {
      var h = {
          string: function (r) {
            var w = 0;
            if (null !== r && void 0 !== r && 0 !== r) {
              var aa = (r.length << 2) + 1,
                sa = (w = R(aa));
              xa(r, t(), sa, aa);
            }
            return w;
          },
          array: function (r) {
            var w = R(r.length);
            Aa(r, w);
            return w;
          },
        },
        g = va(a),
        m = [];
      a = 0;
      if (e)
        for (var p = 0; p < e.length; p++) {
          var u = h[c[p]];
          u ? (0 === a && (a = ib()), (m[p] = u(e[p]))) : (m[p] = e[p]);
        }
      c = g.apply(null, m);
      c = (function (r) {
        return "string" === b ? Q(r) : "boolean" === b ? !!r : r;
      })(c);
      0 !== a && Y(a);
      return c;
    };
    z.PThread = A;
    z.PThread = A;
    z.wasmMemory = k;
    z.ExitStatus = L;
    var Wb;
    function L(a) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + a + ")";
      this.status = a;
    }
    T = function Xb() {
      Wb || Yb();
      Wb || (T = Xb);
    };
    function Yb(a) {
      function b() {
        if (!Wb && ((Wb = !0), (z.calledRun = !0), !ua)) {
          Pa(Ea);
          F || Pa(Fa);
          ia(z);
          if (z.onRuntimeInitialized) z.onRuntimeInitialized();
          if (Zb) {
            var c = a,
              e = z._main;
            c = c || [];
            var h = c.length + 1,
              g = R(4 * (h + 1));
            v()[g >> 2] = za(la);
            for (var m = 1; m < h; m++) v()[(g >> 2) + m] = za(c[m - 1]);
            v()[(g >> 2) + h] = 0;
            try {
              var p = e(h, g);
              Za(p, !0);
            } catch (u) {
              u instanceof L ||
                ("unwind" == u
                  ? (noExitRuntime = !0)
                  : ((c = u) &&
                      "object" === typeof u &&
                      u.stack &&
                      (c = [u, u.stack]),
                    N("exception thrown: " + c),
                    ma(1, u)));
            } finally {
            }
          }
          if (!F) {
            if (z.postRun)
              for (
                "function" == typeof z.postRun && (z.postRun = [z.postRun]);
                z.postRun.length;

              )
                (c = z.postRun.shift()), Ga.unshift(c);
            Pa(Ga);
          }
        }
      }
      a = a || ka;
      if (!(0 < S))
        if (F) ia(z), postMessage({ cmd: "loaded" });
        else {
          if (!F) {
            if (z.preRun)
              for (
                "function" == typeof z.preRun && (z.preRun = [z.preRun]);
                z.preRun.length;

              )
                Ia();
            Pa(Da);
          }
          0 < S ||
            (z.setStatus
              ? (z.setStatus("Running..."),
                setTimeout(function () {
                  setTimeout(function () {
                    z.setStatus("");
                  }, 1);
                  b();
                }, 1))
              : b());
        }
    }
    z.run = Yb;
    function Za(a, b) {
      if (!b || !noExitRuntime || 0 !== a) {
        if (!b && F)
          throw (postMessage({ cmd: "exitProcess", returnCode: a }), new L(a));
        if (!noExitRuntime) {
          A.Ea();
          if (z.onExit) z.onExit(a);
          ua = !0;
        }
        ma(a, new L(a));
      }
    }
    if (z.preInit)
      for (
        "function" == typeof z.preInit && (z.preInit = [z.preInit]);
        0 < z.preInit.length;

      )
        z.preInit.pop()();
    var Zb = !0;
    z.noInitialRun && (Zb = !1);
    noExitRuntime = !F;
    F && A.Na();
    Yb();

    return Stockfish.ready;
  };
})();
if (typeof exports === "object" && typeof module === "object")
  module.exports = Stockfish;
else if (typeof define === "function" && define["amd"])
  define([], function () {
    return Stockfish;
  });
else if (typeof exports === "object") exports["Stockfish"] = Stockfish;
