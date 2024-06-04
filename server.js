const express = require("express");
const { Web3 } = require("web3");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to Arbitrum network
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

app.get("/", (req, res) => {
  res.send("Hello from Arbitrum Network!");
});

app.get("/balance/:address", async (req, res) => {
  try {
    const balance = await web3.eth.getBalance(req.params.address);
    res.send({
      address: req.params.address,
      balance: web3.utils.fromWei(balance, "ether"),
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/wallet", (req, res) => {
  try {
    res.send({
      address: account.address,
      privateKey: account.privateKey,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/transactions/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const url = `https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const response = await axios.get(url);
    res.send(response.data);

    // if (response.data.status !== "1") {
    //   throw new Error(response.data.message);
    // }

    // res.send(response.data.result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
//

app.listen(PORT, () => console.log("serverstart on port 5000"));