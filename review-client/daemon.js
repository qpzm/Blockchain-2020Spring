const readline = require("readline");
const Web3 = require("web3");
// Deployed contract address in ropsten testnet
const contractAddress = "0x190F4f46e91bF98Fa64e9D5DFEdB12236b5f138B"

getInfuraProjectId().then((projectId) => {
  console.log(`INFURA_PROJECT_ID: ${projectId}`)
  subscribeMyContract(projectId, contractAddress)
})

function getInfuraProjectId() {
  let projectId = process.env.INFURA_PROJECT_ID
  if(!projectId) {
    return askQuestion('Input your Infura Project Id: \n')
  } else {
    return new Promise(resolve => {
      resolve(projectId)
    })
  }
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

function subscribeMyContract(projectId, address) {
  const web3 = new Web3(new Web3.providers.WebsocketProvider(
    `wss://ropsten.infura.io/ws/v3/${projectId}`,
  ));

  web3.eth.subscribe('logs', {
    address: address,
    },
    (error, result) => {
    if (!error) {
      console.log('result: ', result);
    } else {
      console.log('error', error);
    }
  })
}
