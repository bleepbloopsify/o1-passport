# o1 passport

a smart contract testbed that allows for individuals to match against a single, deployed value on chain.

a sample test run looks something like this:

```
o1-passport ♞  bun run ./index.ts
passport app
[978.42ms] passportVerifier compile
0: 31337
1: 0
2: 0
3: 0
4: 0
5: 0
6: 0
7: 0
attempting to assert with valid passport number
0: 31337
1: 0
2: 0
3: 0
4: 0
5: 0
6: 0
7: 0
[8.22s] assert valid passport number
attempting to assert with invalid passport number (will error)
failed with error 155 |         },
156 |         send() {
157 |             return toPendingTransactionPromise(async () => {
158 |                 const pendingTransaction = await sendTransaction(self);
159 |                 if (pendingTransaction.errors.length > 0) {
160 |                     throw Error(`Transaction failed with errors:\n- ${pendingTransaction.errors.join('\n- ')}`);
                                ^
error: Transaction failed with errors:
- [[],[["Account_app_state_precondition_unsatisfied",0]]]
      at <anonymous> (/Users/leon/github/o1-passport/node_modules/.pnpm/o1js@2.9.0/node_modules/o1js/dist/node/lib/mina/v1/transaction.js:160:27)

Error: Transaction failed with errors:
- [[],[["Account_app_state_precondition_unsatisfied",0]]]
    at <anonymous> (/Users/leon/github/o1-passport/node_modules/.pnpm/o1js@2.9.0/node_modules/o1js/dist/node/lib/mina/v1/transaction.js:160:27)
    at processTicksAndRejections (native:7:39)
0: 31337
1: 0
2: 0
3: 0
4: 0
5: 0
6: 0
7: 0
[17.07s] assert invalid passport number
attempting to verify with valid passport number
verified
true
verified
true
0: 31337
1: 0
2: 0
3: 0
4: 0
5: 0
6: 0
7: 0
[9.64s] verify valid passport number
attempting to verify with invalid passport number
verified
false
verified
false
0: 31337
1: 0
2: 0
3: 0
4: 0
5: 0
6: 0
7: 0
[6.87s] verify invalid passport number
```

Note that `Provable.log` is called twice, each time we attempt to `prove` the transaction.


## Commentary on the process

Mina has a global `transaction` object, that prevents us from creating multiple promises and attempting to prove in parallel.

---

Holy package size batman, 27mb? What is that, a house? (for ref, usual npm packages are kbs)

---

Need to use decorators?;
```
"experimentalDecorators": true, // needed for decorators
"emitDecoratorMetadata": true, // needed for decorators
"preserveSymlinks": true,
```
My tsconfig was hilariously upset, and I don't see docs anywhere for this.

I basically copied this out of the o1js repository.

---

Lack of documentation

I'm very surprised we don't have a `Quickstart` or something for experienced developers to just hot-drop in. Seems like an easy barrier to entry to cross.

---

Same vein, why is the first-scroll on our github repo so enourmous? I see that we're attempting to move scripts in, so thats at least a good start :p

---

I wasn't sure if I could use a dictionary or an array in my `Field` objects, so I just used a single Uint64. There should be a reference for this somewhere, right?

---

Damn this verification takes a while, 10 seconds for a single comparison?

---

Also, how am I supposed to use `Field` outside of `transaction`? I wanted to return the boolean into js-land, but Ocaml seemed _quite_ unhappy with the whole ordeal.

---

```
const allowed = this.allowed.get();
this.allowed.requireEquals(allowed);
```
This feels like the API has a footgun built into it, we probably want an implicit proof here