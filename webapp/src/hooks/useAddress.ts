export const useAddress = () => {
    const getShortAddress = (address: string) => {
        return (
            address.slice(0,7).concat("....").concat(
                address.slice(address.length - 4, address.length)
            )
        )
    };

    const getObjectExplorerURL = (objectId: string) => {
        return "https://fuellabs.github.io/block-explorer-v2/beta-3/";
    }
    const editDaoLinkWithStatus = (dao) => {
        if (dao.status == -1 || dao.status == 0) {
            return `/dao/edit/${dao._id}`;
        } else {
            return `/dao/onchain/${dao._id}`;
        }
    }
    return { getShortAddress, getObjectExplorerURL, editDaoLinkWithStatus };
};