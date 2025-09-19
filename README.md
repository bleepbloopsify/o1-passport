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

