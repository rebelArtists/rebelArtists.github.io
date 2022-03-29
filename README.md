# REBEL ARTIST

## _Decentralized Creator Payments Platform_

REBEL is an easy-to-use minting and peer-to-peer creator payments system. Artists earn directly from their fans via crypto without needing any disbursement from social media or streaming institutions. Gone are the days of giant corporations taking billions and leaving their creators with fractions. Take control of your content. Own what's yours as a Rebel Artist!

## Features

- Art uploads automatically converted to ERC721 tokens (dead-simple minting)
- 1st class audio, image, video file support (universal media support)
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

## Installation

1. clone this repo
   `git clone https://github.com/rebelArtists/rebelArtists.github.io.git`
2. enter root directory of project
   `cd rebelArtists.github.io`
3. install all dependencies
   `npm i`
4. start app locally
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
