/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.38.1
  Forc version: 0.35.5
  Fuel-Core version: 0.17.3
*/

import { Interface, Contract } from "fuels";
import type { Provider, Account, AbstractAddress } from "fuels";
import type { CryptoStreamingContractAbi, CryptoStreamingContractAbiInterface } from "../CryptoStreamingContractAbi";

const _abi = {
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "(_, _, _, _, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 8,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 7,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "enum InvalidError",
      "components": [
        {
          "name": "CannotReinitialize",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "SenderIsNotOwner",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "StreamIsNotStart",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "StreamIsNotActive",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "IncorrectAssetId",
          "type": 7,
          "typeArguments": null
        },
        {
          "name": "StreamBalanceNotEnough",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NotStreamRecipient",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NotOwnerOrRecipient",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NotAvaiableAmount",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NotPermissionToCancel",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NotPermissionToTransfer",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "struct Address",
      "components": [
        {
          "name": "value",
          "type": 2,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "struct Config",
      "components": [
        {
          "name": "start_date",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "cancel_previlege",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "transfer_previlege",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "recipient",
          "type": 3,
          "typeArguments": null
        },
        {
          "name": "unlock_number",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "unlock_amount_each_time",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "unlock_every",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "prepaid",
          "type": 8,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "struct ContractId",
      "components": [
        {
          "name": "value",
          "type": 2,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "u64",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [],
      "name": "cancel_stream",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_balance",
      "output": {
        "name": "",
        "type": 8,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [],
      "name": "get_stream_info",
      "output": {
        "name": "",
        "type": 1,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "config",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "initialize",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "send_fund",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "new_recipient",
          "type": 3,
          "typeArguments": null
        }
      ],
      "name": "transfer_stream",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "withdraw",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [
    {
      "logId": 0,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 1,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 2,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 3,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 4,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 5,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 6,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 7,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 8,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 9,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 10,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 11,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 12,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 13,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 14,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 15,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    }
  ],
  "messagesTypes": [],
  "configurables": []
}

export class CryptoStreamingContractAbi__factory {
  static readonly abi = _abi
  static createInterface(): CryptoStreamingContractAbiInterface {
    return new Interface(_abi) as unknown as CryptoStreamingContractAbiInterface
  }
  static connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): CryptoStreamingContractAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as CryptoStreamingContractAbi
  }
}
