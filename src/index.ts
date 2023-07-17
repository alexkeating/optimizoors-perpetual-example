import { ethers } from "ethers";

const main = async () => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Tested with anvil node fork of optimism

  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Tested with anvil account
    provider
  );

  const depositTx = await depositEther(
    wallet,
    "0x067799acf2594162d2C1218E9ea53D61c51C0826",
    "10000000000000000000"
  );

  await depositTx.wait();

  const approveTx = await delegateApprove(
    wallet,
    "0xfd7bB5F6844a43c5469c972640Eddfa99597a547"
  );
  await approveTx.wait();

  const openTx = await openPosition(
    wallet,
    "0x957d09ff87f3B019e3b3Ff7E133Fd8cc720735d8",
    ethers.solidityPacked(
      ["uint8", "uint160", "uint32", "uint96", "uint96"],
      [4, 0, Math.pow(2, 31), "100", 0]
    )
  );
  await openTx.wait();
};

const depositEther = async (
  wallet: ethers.Wallet,
  contract: string,
  value: string
) => {
  const txData = {
    to: contract,
    value: value,
  };
  const d = await wallet.populateTransaction(txData);
  return await wallet.sendTransaction(d);
};

const openPosition = async (
  wallet: ethers.Wallet,
  contract: string,
  data: string
) => {
  const txData = {
    to: contract,
    data: data,
  };
  const d = await wallet.populateTransaction(txData);
  return await wallet.sendTransaction(d);
};

const delegateApprove = async (wallet: ethers.Wallet, contract: string) => {
  const abi = ["function approve(address delegate, uint8 actions) external"];

  // Create a contract
  const c = new ethers.Contract(contract, abi, wallet);
  return await c.approve("0x957d09ff87f3B019e3b3Ff7E133Fd8cc720735d8", 1);
};
main();
