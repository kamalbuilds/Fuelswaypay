
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { store } from "src/controller/store";
import { MESSAGE_TYPE, openNotification } from "./common";
import { Address, WalletUnlocked } from "fuels";

export const doBatch = async (formValues: {
    recipients: { address: `fuel${string}`, amount: number }[],
}) => {
    try {
        const { account } = store.getState().account;

        if (!window.fuel || !account) {
            openNotification("FUEL wallet is not currently connected.", `To utilize SWAYPAY features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        if (!formValues.recipients || !formValues.recipients.length) return;

        let wallet: WalletUnlocked = await window.fuel.getWallet(account);

        store.dispatch(updateProcessStatus({
            actionName: actionNames.createBatchPayment,
            att: processKeys.processing,
            value: true
        }))
        for (let i = 0; i < formValues.recipients.length; i++) {
            let recipient = formValues.recipients[i];
            let tx = await wallet.transfer(
                new Address(recipient.address),
                recipient.amount * 10**9
            )
            await tx.wait();
        }

        openNotification("Create Batch Payment", `Create Batch Payment Successful`, MESSAGE_TYPE.SUCCESS, () => { })

    } catch (e) {
        openNotification("Create Batch Payment", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.createBatchPayment,
        att: processKeys.processing,
        value: false
    }))
}
