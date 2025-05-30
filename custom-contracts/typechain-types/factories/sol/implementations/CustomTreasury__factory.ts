/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BytesLike,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  CustomTreasury,
  CustomTreasuryInterface,
} from "../../../sol/implementations/CustomTreasury";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_hub",
        type: "address",
      },
      {
        internalType: "address",
        name: "_nameRegistry",
        type: "address",
      },
      {
        internalType: "address",
        name: "_group",
        type: "address",
      },
      {
        internalType: "string",
        name: "_groupName",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "_metadataDigest",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CollateralIsNotTrustedByGroup",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientCollateral",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyGroup",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyHub",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawalFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "CollateralDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "withdrawer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "CollateralWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "EmergencyWithdrawal",
    type: "event",
  },
  {
    inputs: [],
    name: "GROUP",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "HUB",
    outputs: [
      {
        internalType: "contract IHub",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NAME_REGISTRY",
    outputs: [
      {
        internalType: "contract INameRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "collateralBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "depositCollateral",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "getCollateralBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_metadataDigest",
        type: "bytes32",
      },
    ],
    name: "updateMetadataDigest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60e080604052346102a0575f610e17803803809161001d82866102b8565b8439820160c0838203126102a057610034836102db565b92610041602082016102db565b9161004e604083016102db565b9261005b606084016102db565b60808401519094906001600160401b0381116102a057840183601f820112156102a0578051946001600160401b0386116102a457604051956100a7601f8201601f1916602001886102b8565b8087526020870195602082850101116102a0576020815f928260a09601895e8801015201519160018060a01b031660805260018060a01b031660a0528360c05261011f60096020604051809582820197518091895e8101682d747265617375727960b81b8382015203016016198101855201836102b8565b6080516001600160a01b0316803b156102a0575f9283606460405180978196829563bfde380d60e01b8452604060048501525180928160448601528585015e82820184018590526024830152601f01601f191681010301925af1801561029557610280575b506080516001600160a01b031690813b1561027c576040516375dcebc760e01b81526001600160a01b0390911660048201526001600160601b0360248201529082908290604490829084905af1801561027157610259575b600280546001600160a01b0319166001600160a01b038516179055604051610b2790816102f0823960805181818161011401528181610283015281816102ea015281816108b201526109e0015260a05181818161032f01526105a7015260c0518181816101cb01528181610577015281816108880152610a050152f35b6102648280926102b8565b61026e57806101dc565b80fd5b6040513d84823e3d90fd5b8280fd5b61028d9192505f906102b8565b5f905f610184565b6040513d5f823e3d90fd5b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b601f909101601f19168101906001600160401b038211908210176102a457604052565b51906001600160a01b03821682036102a05756fe6080806040526004361015610012575f80fd5b5f905f3560e01c90816301ffc9a7146106b45750806313af4035146106675780632703ee851461063057806329bc969d146106305780633857d9d71461056357806344df8e70146105475780634ac8eb5f146105295780636112fe2e146104785780636f758140146104165780636ff1c9bc146103875780638da5cb5b1461035e578063a05c261614610319578063a4c52b86146102d4578063bc197c81146101fa578063e532b61d146101b55763f23a6e61146100ce575f80fd5b346101b25760a03660031901126101b2576100e7610707565b506100f061071d565b5060843567ffffffffffffffff81116101b0576101119036906004016107ee565b507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031633036101a157604051610150604082610733565b6001815260208082019036823781511561018d57610173925060443590526109d6565b61017b61086c565b60405163f23a6e6160e01b8152602090f35b634e487b7160e01b83526032600452602483fd5b63058a7c7360e31b8152600490fd5b505b80fd5b50346101b257806003193601126101b2576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b50346101b25760a03660031901126101b257610214610707565b5061021d61071d565b5060443567ffffffffffffffff81116101b05761023e903690600401610769565b9060643567ffffffffffffffff81116101b05761025f903690600401610769565b5060843567ffffffffffffffff81116101b0576102809036906004016107ee565b507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031633036101a1576102ba826109d6565b6102c261086c565b60405163bc197c8160e01b8152602090f35b50346101b257806003193601126101b2576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b50346101b257806003193601126101b2576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b50346101b257806003193601126101b2576002546040516001600160a01b039091168152602090f35b50346101b25760203660031901126101b2576103a1610707565b6103b660018060a01b03600254163314610834565b47908280808085855af16103c861099a565b5015610407576040519182526001600160a01b0316907f23d6711a1d031134a36921253c75aa59e967d38e369ac625992824315e204f2090602090a280f35b6312171d8360e31b8352600483fd5b50806003193601126101b25733815280602052604081206104383482546109c9565b9055610446346001546109c9565b6001556040513481527fd7243f6f8212d5188fd054141cf6ea89cfc0d91facb8c3afe2f88a135848014260203392a280f35b50346101b25760203660031901126101b257600435338252816020528060408320541061051a5733825281602052604082206104b5828254610979565b90556104c381600154610979565b6001558180808084335af16104d661099a565b501561050b576040519081527fc30fcfbcaac9e0deffa719714eaa82396ff506a0d0d0eebe170830177288715d60203392a280f35b6327fcd9d160e01b8252600482fd5b633a23d82560e01b8252600482fd5b50346101b257806003193601126101b2576020600154604051908152f35b50346101b257806003193601126101b25761056061086c565b80f35b503461061d57602036600319011261061d577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163303610621577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316803b1561061d575f8091602460405180948193633857d9d760e01b835260043560048401525af1801561061257610604575080f35b61061091505f90610733565b005b6040513d5f823e3d90fd5b5f80fd5b636346b2b760e01b5f5260045ffd5b3461061d57602036600319011261061d576001600160a01b03610651610707565b165f525f602052602060405f2054604051908152f35b3461061d57602036600319011261061d57610680610707565b60025490610698336001600160a01b03841614610834565b6001600160a01b03166001600160a01b03199190911617600255005b3461061d57602036600319011261061d576004359063ffffffff60e01b821680920361061d57602091630271189760e51b81149081156106f6575b5015158152f35b6301ffc9a760e01b149050836106ef565b600435906001600160a01b038216820361061d57565b602435906001600160a01b038216820361061d57565b90601f8019910116810190811067ffffffffffffffff82111761075557604052565b634e487b7160e01b5f52604160045260245ffd5b9080601f8301121561061d5781359167ffffffffffffffff8311610755578260051b90602082019361079e6040519586610733565b845260208085019282010192831161061d57602001905b8282106107c25750505090565b81358152602091820191016107b5565b67ffffffffffffffff811161075557601f01601f191660200190565b81601f8201121561061d57803590610805826107d2565b926108136040519485610733565b8284526020838301011161061d57815f926020809301838601378301015290565b1561083b57565b60405162461bcd60e51b81526020600482015260096024820152682737ba1037bbb732b960b91b6044820152606490fd5b604051627eeac760e11b81523060048201526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116602483018190527f000000000000000000000000000000000000000000000000000000000000000090911691602081604481865afa908115610612575f91610947575b50806108f757505050565b823b1561061d5760845f928360405195869485936380a5a37160e01b855260048501526024840152606060448401528160648401525af180156106125761093b5750565b5f61094591610733565b565b90506020813d602011610971575b8161096260209383610733565b8101031261061d57515f6108ec565b3d9150610955565b9190820391821161098657565b634e487b7160e01b5f52601160045260245ffd5b3d156109c4573d906109ab826107d2565b916109b96040519384610733565b82523d5f602084013e565b606090565b9190820180921161098657565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811691907f0000000000000000000000000000000000000000000000000000000000000000165f5b8251811015610aeb578251811015610ad7576020600582901b84018101516040516306713e2360e41b8152600481018590526001600160a01b03909116602482015290816044815f895af1908115610612575f91610a9d575b5015610a8e57600101610a27565b631c74bb5760e11b5f5260045ffd5b90506020813d8211610acf575b81610ab760209383610733565b8101031261061d5751801515810361061d575f610a80565b3d9150610aaa565b634e487b7160e01b5f52603260045260245ffd5b5050505056fea2646970667358221220169d44faa233e9bf2f0e45419632c423c11b8877aabb031964a4d0df88ad9db264736f6c634300081c0033";

type CustomTreasuryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CustomTreasuryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CustomTreasury__factory extends ContractFactory {
  constructor(...args: CustomTreasuryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _owner: AddressLike,
    _hub: AddressLike,
    _nameRegistry: AddressLike,
    _group: AddressLike,
    _groupName: string,
    _metadataDigest: BytesLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _owner,
      _hub,
      _nameRegistry,
      _group,
      _groupName,
      _metadataDigest,
      overrides || {}
    );
  }
  override deploy(
    _owner: AddressLike,
    _hub: AddressLike,
    _nameRegistry: AddressLike,
    _group: AddressLike,
    _groupName: string,
    _metadataDigest: BytesLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _owner,
      _hub,
      _nameRegistry,
      _group,
      _groupName,
      _metadataDigest,
      overrides || {}
    ) as Promise<
      CustomTreasury & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): CustomTreasury__factory {
    return super.connect(runner) as CustomTreasury__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CustomTreasuryInterface {
    return new Interface(_abi) as CustomTreasuryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): CustomTreasury {
    return new Contract(address, _abi, runner) as unknown as CustomTreasury;
  }
}
