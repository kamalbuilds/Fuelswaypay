
import { notification } from 'antd';


export const MESSAGE_TYPE = {
    SUCCESS: "success",
    ERROR: "error",
    INFO: "info",
    WARNING: "warning",
    OPEN: "open",
    DESTROY: "destroy"
}

/**
 * 
 * @param title 
 * @param description 
 * @param messageType success, error, info, warning, open, destroy
 * @param fn 
 */
export const openNotification = (title: string, description: string, messageType: string, fn?: () => void) => {
    let config = {
        message: title,
        description: description,
        onClick: () => {
            fn()
        }
    }

    switch (messageType) {
        case MESSAGE_TYPE.OPEN:
            notification.open(config);
            break;
        case MESSAGE_TYPE.INFO:
            notification.info(config);
            break;
        case MESSAGE_TYPE.SUCCESS:
            notification.success(config);
            break;
        case MESSAGE_TYPE.ERROR:
            notification.error(config);
            break;
        case MESSAGE_TYPE.WARNING:
            notification.warning(config);
            break;
        default:
            notification.open(config);
            break;
    }


};


export const updateStatistic = async (field: string, value: number) => {
    try {
        let request = await fetch("/api/statistic/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                field: field,
                value: value
            })
        })

        let result = await request.json()

        if (result.success) {
            return true;
        }
    } catch (e) {
        return false;
    }

}

export const updatePayout = async (field: string, value: number, date: string) => {
    try {
        let request = await fetch("/api/proposal-payout/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                field: field,
                value: value,
                date: date
            })
        })

        let result = await request.json()

        if (result.success) {
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }

}

export const getGeneralStatistic = async () => {
    try {
        let request = await fetch("api/statistic/getGeneral", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
           
        })
        let result = await request.json();

        if (result.success) {
            return result.statistic;
        }
    } catch (e) {
        return false;
    }
   
}

export const getPayoutStatistic = async () => {
    try {
        let request = await fetch("/api/statistic/getPayoutStatistic", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
           
        })
        let result = await request.json();

        if (result.success) {
            return {
                totalPayout: result.totalPayout, 
                totalPayoutByDate: result.totalPayoutByDate
            };
        }
    } catch (e) {
        return false;
    }
   
}

export const countDAOProposalStreamChannel = async (account: string) => {
    try {
        let request = await fetch("/api/statistic/getCountDAOProposalsStreamChannel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: account
            })
        })

        let result = await request.json();
        return result;
    } catch (e) {
        console.error("Error:", e.message);
        return false;
    }

}