# [NextJS 15](https://nextjs.org/blog/next-15-rc) project bootstrapped with `create-next-app@rc`

## Create NextJS App

To create NextJS 15 project run:

```Bash
create-next-app@rc
```

If you want to start an empty project (without styles and extra files), you can use the `--empty` flag, resulting in a minimal “hello world” page:

```Bash
npx create-next-app@rc --empty
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.


## Setup HardHat

```Bash
cd hardhat-contract
```

Initialize a Node.js project:
```Bash
npm init -y
```

Install Hardhat:
```Bash
npm install --save-dev hardhat
```

If you run npx hardhat init now, you will be shown some options to facilitate project creation:
```Bash
npx hardhat init
```

Project structure:
```JSON
contracts/
ignition/modules/
test/
hardhat.config.js
```

- `contracts/` is where the source files for your contracts should be.
- `ignition/modules/` is where the Ignition modules that handle contract deployments should be.
- `test/` is where your tests should go.

### Solidity
Hardhat Network has first-class Solidity support. It always knows which smart contracts are being run, what exactly they do, and why they fail, making smart contract development easier. To do these kinds of things, Hardhat integrates very deeply with Solidity, which means that new versions of it aren't automatically supported.

To install specific version of the Solidity compiler via Node.js you can run:
```Bash
npm i solc@0.8.19
```
See more in [docs](https://hardhat.org/hardhat-runner/docs/reference/solidity-support).

if you still want to install the latest version of the Solidity you can run:
```Bash
npm i solc
```
Check the version of the Solidity you get:
```Bash
npx solc --version
0.8.19+commit.7dd6d404.Emscripten.clang
```


## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)