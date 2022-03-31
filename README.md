# REBEL ARTIST

## _Decentralized Creator Payments Platform_

<img src="https://user-images.githubusercontent.com/100106211/160684827-19458222-e5e0-4e18-9260-3232abcaa129.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/100106211/160684829-b4b5786f-3f29-4495-80cd-3fa99a91281c.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/100106211/160684830-60cd8e14-2ef7-4885-b61a-d7b372d506e8.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/100106211/160684833-cf1505ef-4ade-41cb-835c-cfcd20af9897.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/100106211/160684834-db75fe32-13e0-4e29-a78c-65437f41bffe.png" width="30%"></img> <img src="https://user-images.githubusercontent.com/100106211/160685081-a17f30ad-0091-4890-ad77-2afd5810ca00.png" width="30%"></img>

REBEL is an easy-to-use minting and peer-to-peer creator payments system. Artists earn directly from their fans via crypto without needing any disbursement from social media or streaming institutions. Gone are the days of giant corporations taking billions and leaving their creators with fractions. Take control of your content. Own what's yours as a Rebel Artist!

## Features

- Art uploads automatically converted to ERC721 tokens (dead-simple minting)
- 1st class audio, image, video file support (universal media support)
- Fully functional on web and mobile
  - For mobile, navigate to https://rebelartists.github.io/ in Metamask's mobile browser, [see how here](https://consensys.net/blog/news/metamask-mobile-now-available-on-android-and-ios/)
- All media/metadata pinned to IPFS for permanent storage (censorship-resistant)
- Near-zero gas fees for all actions in dApp (Polygon network)
- Artists paid per "like" of their content (instant payouts)
  - Direct fan-to-creator donations also possible
- Unlock valuable ERC20 tokens as "like milestones" reached (top creator rewards)
- Creators take 98% of all profits (transparent)

## Tech

Build by COIN alums, we're leveraging the following tech stack:

- [VueJs] - frontend framework
- [Vite] - frontend tooling
- [Pinia] - state management
- [Polygon] - proof-of-stake sidechain to Ethereum
- [Hardhat/Chai] - smart contract testing
- [Solidity/Open Zeppelin] - smart contract logic
- [Cloudinary] - media chaching
- [Alchemy] - blockchain connector API
- [Infura] - IPFS connector API
- [IPFS] - Inter Planetary File System for media/metadata storage

REBEL itself is open source and located on github here: [public repository](https://github.com/rebelArtists/rebelArtists.github.io)

Learn more about our mission, architecture, and roadmap in our whitepaper [here](https://rebelartists.github.io/about)

## Installation and Getting Started

1. clone this repo
   `git clone https://github.com/rebelArtists/rebelArtists.github.io.git`
2. enter root directory of project
   `cd rebelArtists.github.io`
3. install all dependencies
   `npm i`
4. add polygon test network to your MetaMask, following steps [here](https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/#using-polygonscan)
5. send some free polygon testnet MATIC to your wallet, using faucet [here](https://faucet.polygon.technology/)
6. start app locally
   `npm run dev`

## Helper Commands

- compile all solidity code
  `npm run compile-solidity`
- deploy smart contract code to Polygon testnet
  `npm run deploy-rebel-dev`
- build project
  `npm run build`
- preview build locally
  `npm run preview`
- run suite of smart contract tests
  `npm run test`

## Developer Notes

- Our development environment uses Node v17.6.0, other versions may also work
- Testnet MATIC is needed for dev blockchain actions, it can be sourced via the faucet [here](https://faucet.polygon.technology/)
- Currently, we only officially support Metamask cryptocurrency wallets

## Development

Want to contribute? Great!

Feel free to submit a new pull request or file an issue [here](https://github.com/rebelArtists/rebelArtists.github.io/issues)!

## License

MIT

## Sponsor

To sponsor development send ETH :) 0xBd7367Acc570AB6fcAb39a00ef479765065a2709
