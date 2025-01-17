export const YOINK_ABI = [
  {
    inputs: [],
    name: "yoink",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "yoinker", type: "address" }],
    name: "score",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "yoinks", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
          { internalType: "uint256", name: "lastYoinkedAt", type: "uint256" }
        ],
        internalType: "struct Score",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "lastYoinkedBy",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
] as const;
