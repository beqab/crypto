const express = require("express");
const { Web3 } = require("web3");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to Linea network through Infura
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// USDC contract address and ABI
const USDC_CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48"; // Mainnet USDC contract address
const USDC_ABI = [
  // ABI for the `balanceOf` method
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

const usdcContract = new web3.eth.Contract(USDC_ABI, USDC_CONTRACT_ADDRESS);

app.get("/", (req, res) => {
  res.send("Hello connected via Infura!");
});

app.get("/balance/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const ethBalance = await web3.eth.getBalance(address);
    const usdcBalance = await usdcContract.methods.balanceOf(address).call();

    res.send({
      address: address,
      ethBalance: web3.utils.fromWei(ethBalance, "ether"),
      usdcBalance: web3.utils.fromWei(usdcBalance, "mwei"), // USDC has 6 decimal places
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

// app.get("/transactions/:address", async (req, res) => {
//   try {
//     const address = req.params.address;
//     const url = `https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`;
//     const response = await axios.get(url);
//     res.send(response.data);

//     // if (response.data.status !== "1") {
//     //   throw new Error(response.data.message);
//     // }

//     // res.send(response.data.result);
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

const PORT = process.env.PORT || 5000;
//

app.listen(PORT, () => console.log("serverstart on port 5000"));
