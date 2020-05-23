# Noncense
Your first uncensorable SNS.

### Dependency
Use node v10.20.1 due to [node-scrypt install error](https://github.com/barrysteyn/node-scrypt/issues/192).
```sh
npm install -g ganache-cli
npm install
```

### Test
Test runs in the development network.
```sh
ganache-cli
truffle test
```

### Deploy
Set environment variables through filling in `.env` referring to `.sample-env` and run:
```sh
truffle deploy --network ropsten
```
