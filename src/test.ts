import { Cache, Field, verify, ZkProgram } from "o1js";

const { log } = console;

const SimpleProgram = ZkProgram({
  name: "simple-program",
  publicOutput: Field,
  methods: {
    baseCase: {
      privateInputs: [],
      async method() {
        return {
          publicOutput: Field(1),
        };
      },
    },
  },
});

log("compiling");
const { verificationKey: vk } = await SimpleProgram.compile({
  cache: Cache.None,
});
log("proving");
const { proof } = await SimpleProgram.baseCase();
log("verifying");
const ok = await verify(proof, vk);

log("ok", ok);
