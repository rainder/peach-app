import { Linking } from "react-native";
import { showLiquidAddress } from "./showLiquidAddress";

describe("showLiquidAddress", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL");

  it("links to mainnet blockexplorer", async () => {
    await showLiquidAddress("address", "bitcoin");
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://liquid.network/address/address",
    );
  });
  it("links to testnet blockexplorer", async () => {
    await showLiquidAddress("address", "testnet");
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://liquid.network/testnet/address/address",
    );
  });
  it("links to regtest blockexplorer", async () => {
    await showLiquidAddress("address", "regtest");
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://localhost:3000/address/address",
    );
  });
});
