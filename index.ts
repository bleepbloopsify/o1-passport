import { AccountUpdate, Bool, Cache, Field, Mina, PrivateKey, Provable, SmartContract, State, method, state } from 'o1js';

const { log, time, timeEnd } = console;

const VALID_PASSPORT_NUMBER = 31337;
const INVALID_PASSPORT_NUMBER = 0xdeadbeef;

export class PassportVerifier extends SmartContract {
  @state(Field) allowed = State<Field>(Field(VALID_PASSPORT_NUMBER));

  @method async assert(passportNumber: Field) {
    return this.allowed.requireEquals(passportNumber);
  }

  @method.returns(Bool) async verify(passportNumber: Field): Promise<Bool> {
    const allowed = this.allowed.get();
    this.allowed.requireEquals(allowed);

    return allowed.equals(passportNumber);
  }
}

log("passport app");

time("passportVerifier compile")
const cache = Cache.FileSystem("./build")
await PassportVerifier.compile({ cache });
timeEnd("passportVerifier compile")


const localChain = await Mina.LocalBlockchain();
Mina.setActiveInstance(localChain)
const [feePayer] = localChain.testAccounts;

const contractAcct = Mina.TestPublicKey.random();
const contract = new PassportVerifier(contractAcct);

async function transact(
  sender: Mina.FeePayerSpec, privates: PrivateKey[],
  f: () => Promise<void>
) {
  const txn = await Mina.transaction(sender, f)
  await txn.prove();
  await txn.sign(privates).send();
}

{
  const txn = await Mina.transaction(feePayer, async () => {
    AccountUpdate.fundNewAccount(feePayer);
    await contract.deploy();
  })
  await txn.prove();
  await txn.sign([feePayer.key, contractAcct.key]).send();
}

log(Mina.getAccount(contractAcct).zkapp?.appState.map((state, idx) => `${idx}: ${state.toString()}`).join("\n"));

log("attempting to assert with valid passport number");
time("assert valid passport number")
await transact(feePayer, [feePayer.key], async () => {
  await contract.assert(Field(VALID_PASSPORT_NUMBER));
});
log(Mina.getAccount(contractAcct).zkapp?.appState.map((state, idx) => `${idx}: ${state.toString()}`).join("\n"));
timeEnd("assert valid passport number")

log("attempting to assert with invalid passport number (will error)")
time("assert invalid passport number")
await (
  transact(feePayer, [feePayer.key], async () => {
    await contract.assert(Field(INVALID_PASSPORT_NUMBER));
  }))
  .catch((e: Error) => {
    log("failed with error", e)
    log(e.stack);
  })
log(Mina.getAccount(contractAcct).zkapp?.appState.map((state, idx) => `${idx}: ${state.toString()}`).join("\n"));
timeEnd("assert invalid passport number")


log("attempting to verify with valid passport number");
time("verify valid passport number")
await transact(feePayer, [feePayer.key], async () => {
  const verified = await contract.verify(Field(VALID_PASSPORT_NUMBER));
  log("verified")
  Provable.log(verified)
});
log(Mina.getAccount(contractAcct).zkapp?.appState.map((state, idx) => `${idx}: ${state.toString()}`).join("\n"));
timeEnd("verify valid passport number")


log("attempting to verify with invalid passport number");
time("verify invalid passport number")
await transact(feePayer, [feePayer.key], async () => {
  const verified = await contract.verify(Field(INVALID_PASSPORT_NUMBER));
  log("verified")
  Provable.log(verified)
});
log(Mina.getAccount(contractAcct).zkapp?.appState.map((state, idx) => `${idx}: ${state.toString()}`).join("\n"));
timeEnd("verify invalid passport number")