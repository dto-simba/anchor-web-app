import { fabricateStakingWithdraw } from '@anchor-protocol/anchor.js';
import {
  createOperationOptions,
  merge,
  OperationDependency,
  timeout,
} from '@terra-dev/broadcastable-operation';
import { StdFee } from '@terra-money/terra.js';
import { renderBroadcastTransaction } from 'components/TransactionRenderer';
import { pickAncUstLpClaimResult } from 'pages/gov/transactions/pickAncUstLpClaimResult';
import { createContractMsg } from '@anchor-protocol/web-contexts/transactions/createContractMsg';
import { createOptions } from '@anchor-protocol/web-contexts/transactions/createOptions';
import { getTxInfo } from '@anchor-protocol/web-contexts/transactions/getTxInfo';
import { postContractMsg } from '@anchor-protocol/web-contexts/transactions/postContractMsg';
import { parseTxResult } from '@anchor-protocol/web-contexts/transactions/tx';

export const ancUstLpClaimOptions = createOperationOptions({
  id: 'gov/ancUstLpClaim',
  //broadcastWhen: 'always',
  pipe: ({
    addressProvider,
    post,
    client,
    signal,
    fixedGas,
    gasFee,
    gasAdjustment,
  }: OperationDependency<{}>) => [
    fabricateStakingWithdraw, // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // -> MsgExecuteContract[]
    createOptions(() => ({
      fee: new StdFee(gasFee, fixedGas + 'uusd'),
      gasAdjustment,
    })), // -> CreateTxOptions
    timeout(postContractMsg(post), 1000 * 60 * 20), // -> Promise<StringifiedTxResult>
    parseTxResult, // -> TxResult
    merge(getTxInfo(client, signal), () => ({ fixedGas })), // -> { TxResult, TxInfo, fixedGas }
    pickAncUstLpClaimResult, // -> TransactionResult
  ],
  renderBroadcast: renderBroadcastTransaction,
  //breakOnError: true,
});
