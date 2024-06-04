const express = require("express");
const { Web3 } = require("web3");
// const axios = require("axios");
// const WETH_abi = require("./rc20.json");
require("dotenv").config();

const app = express();
app.use(express.json());

const address = "0xB5A094A53b6e9003645c12c48676Bb6089e2e302";

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// const WETH_CONTRACT_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// const WETHContract = new web3.eth.Contract(WETH_abi, WETH_CONTRACT_ADDRESS);

app.get("/", (_, res) => {
  res.send("Hello");
});

app.get("/balance", async (req, res) => {
  try {
    const ethBalance = await web3.eth.getBalance(address);
    // const WETHBalance = await WETHContract.methods.balanceOf(address).call();

    res.send({
      address: address,
      ethBalance: web3.utils.fromWei(ethBalance, "ether"),
      //   WETHBalance: web3.utils.fromWei(usdcBalance, "ether"),
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
