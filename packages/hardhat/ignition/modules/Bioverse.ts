import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Bioverse", (m) => {
  const Bioverse = m.contract("Bioverse", []);

  return {
    Bioverse,
  };
});
