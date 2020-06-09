import Web3 from "web3";
import NoncenseJson from "./Noncense.min.json";

const httpEndpoint = "https://ropsten-rpc.linkpool.io";
const wsEndpoint = "wss://ropsten-rpc.linkpool.io/ws";
const contractAddress = "0x190F4f46e91bF98Fa64e9D5DFEdB12236b5f138B";

const configStr = window.localStorage.getItem("config");
if (configStr) {
  const config = JSON.parse(configStr);
  if (config.chainId !== 3 || config.contractAddress !== contractAddress) {
    window.localStorage.clear();
  }
}

window.localStorage.setItem("config", JSON.stringify({
  chainId: 3,
  contractAddress: contractAddress
}));

let web3 = {
  http: undefined,
  ws: undefined,
  noncense: undefined,
};

if (window.ethereum) {
  web3.http = new Web3(window.ethereum);
  web3.http.eth.net.isListening(() => {
    (async () => {
      try {
        const chainId = await web3.http.eth.getChainId();
        if (chainId !== 3) {
          console.error("Not supported chainId", chainId, "!= 3 (Ropsten)");
          console.debug("Try connecting to fallback endpoint:", httpEndpoint);
          web3.http = new Web3(httpEndpoint);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  });
} else {
  web3.http = new Web3(httpEndpoint);
}

web3.ws = new Web3(wsEndpoint);
web3.noncense = new web3.http.eth.Contract(NoncenseJson.abi, contractAddress);

function timeConverter(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

export { web3, timeConverter };
