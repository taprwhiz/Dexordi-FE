import axios from "axios";
import { BEARER_TOKEN } from "../config/authkeys";
import { OPENAPI_UNISAT } from "../config/url";

import { MY_COMPANY_API_KEY } from "../config/authkeys";

import { DEEP_LAKE_REST_API_URL } from "../config/url";

// interface StakingDataProps {
//   amount: number;
//   lockTime: number;
// }
// interface StakingProps {
//   wallet: string;
//   tokenType: string;
//   stakingData: StakingDataProps;
//   escrowId: number;
// }
interface TransferInscriptionProps {
  receiveAddress: string;
  feeRate: number;
  ticker: string;
  amount: string;
}
interface SendBTCProps {
  amount: number;
  targetAddress: string;
  feeRate: number;
}

interface CreatingEscrowProps {
  where: object;
  data: {
    fee: number;
    staker: {
      utxo: {
        id: string;
        sequence: number;
      };
      ordinal: {
        value: string;
        publicKey: string;
      };
      cardinal: {
        value: string;
        publicKey: string;
      };
    };
    product: {
      id: number;
    };
    expiry: string;
  };
}

interface SignPsbtProps {
  hex: string;
  address: string;
  publicKey: string;
}

interface BroadcastingProps {
  escrowId: number;
  signedHex: string;
}

interface UnstakingArr {
  params: string[];
}

export const GetInscribeId = async (orderId: string) => {
  const payload = await axios.post(
    "http://localhost:8080/api/cbrc/getInscribeId",
    {
      orderId: orderId,
    }
  );

  console.log("payload.data in getInscribeId ==> ", payload.data);
  return payload.data;
};

export const GetUtxoId = async (inscribeId: string) => {
  const payload = await axios.post(`http://localhost:8080/api/cbrc/getUtxoId`, {
    inscribeId,
  });
  return payload.data.result;
};

export const Testing = async () => {
  const payload = await axios.post("http://localhost:8080/api/test", {});
  return payload.data;
};
//Staking 1
export const TransferInscrioption = async ({
  receiveAddress,
  feeRate,
  ticker,
  amount,
}: TransferInscriptionProps) => {
  const params = {
    receiveAddress: receiveAddress,
    feeRate: feeRate,
    outputValue: 900,
    devAddress: receiveAddress,
    devFee: 0,
    brc20Ticker: ticker,
    brc20Amount: amount,
  };

  const headers = { Authorization: BEARER_TOKEN };
  console.log("headers ==> ", headers);
  const payload = await axios.post(`${OPENAPI_UNISAT}/brc20-transfer`, params, {
    headers: {
      Authorization: BEARER_TOKEN,
    },
  });

  console.log("payaddress ==> ", payload.data);

  console.log("transferInscription ==> ", payload.data);
  return payload.data;
};
//Staking 2
export const SendBTC = async ({
  amount,
  targetAddress,
  feeRate,
}: SendBTCProps) => {
  const params = {
    amount,
    targetAddress,
    feeRate,
  };
  const payload = await axios.post(
    "http://localhost:8080/api/cbrc/sendBTC",
    params
  );
  console.log("payload ==> ", payload);
};
//Staking 3
export const CreatingEscrow = async (params: CreatingEscrowProps) => {
  console.log("params ==> ", params);

  const headers = { Authorization: MY_COMPANY_API_KEY };
  console.log("headers ==> ", headers);
  const payload = await axios.post(
    `${DEEP_LAKE_REST_API_URL}/flows/execute`,
    params,
    { headers }
  );
  console.log(payload.data);
  return payload.data;
};
//Staking 4
export const SignPsbt = async ({ hex, address, publicKey }: SignPsbtProps) => {
  const payload = await (window as any).unisat.signPsbt(hex, {
    autoFinalized: false,
    toSignInputs: [
      {
        index: 0,
        address: address,
      },
      {
        index: 1,
        publicKey: publicKey,
      },
    ],
  });

  return payload.data;
};

export const Broadcasting = async ({
  escrowId,
  signedHex,
}: BroadcastingProps) => {
  const qs = require("qs");
  const headers = { Authorization: MY_COMPANY_API_KEY };
  const data = {
    state: "broadcast-stake",
    transactions: [
      {
        hex: signedHex,
      },
    ],
    product: {
      id: 14,
    },
  };
  const where = qs.stringify({ where: { id: escrowId } });
  const payload = await axios.post(
    `${DEEP_LAKE_REST_API_URL}/flows/execute?${where}`,
    { data },
    { headers }
  );

  return payload.data;
};

// Unstaking 2
export const Unstaking = async ({ params }: UnstakingArr) => {
  const headers = { Authorization: MY_COMPANY_API_KEY };
  const data = {
    state: "unstake",
    fee: 200,
    index: 0,
    product: {
      id: 14,
    },
  };

  params.map((value) => {
    // const qs = require("qs");
    // const where = qs.stringify({ where: { id: params } });

    // const payload = axios.post(
    //   `${DEEP_LAKE_REST_API_URL}/flows/execute?${where}`,
    //   { data },
    //   { headers }
    // );

    console.log(" Unstaking ID[] ==> ", params);
  });
};

// export const Staking = async (params: StakingProps) => {
//   console.log("params ==> ", params);
//   const payload = await axios.post(
//     "http://localhost:8080/api/cbrc/staking",
//     params
//   );
//   console.log("Staking Test ==> ", payload.data);
//   return payload.data;
// };