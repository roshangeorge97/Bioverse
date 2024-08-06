import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("UserProfileManager", (m) => {
  const UserProfileManager = m.contract("UserProfileManager", []);

  return {
    UserProfileManager,
  };
});
