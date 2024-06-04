const express = require("express");
const { Web3 } = require("web3");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// USDC contract address and ABI
const USDC_CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48"; // Mainnet USDC contract address
const USDC_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

const usdcContract = new web3.eth.Contract(USDC_ABI, USDC_CONTRACT_ADDRESS);

app.get("/", (_, res) => {
  res.send("Hello connected via Infura!");
});

app.get("/balance", async (req, res) => {
  try {
    const address = "0xB5A094A53b6e9003645c12c48676Bb6089e2e302";
    const ethBalance = await web3.eth.getBalance(address);
    const usdcBalance = await usdcContract.methods.balanceOf(address).call();

    res.send({
      address: address,
      ethBalance: web3.utils.fromWei(ethBalance, "ether"),
      usdcBalance: web3.utils.fromWei(usdcBalance, "mwei"),
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/wallet", (req, res) => {
  try {
    res.send(account);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
//

app.listen(PORT, () => console.log("serverstart on port 5000"));
