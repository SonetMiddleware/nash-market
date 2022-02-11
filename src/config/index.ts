export const BASE_BSC_SCAN_URL = 'https://bscscan.com';

export const SellTokenOptions = [
    {
        label: 'TT',
        value: '0x132Eb6C9d49ACaB9cb7B364Ea79FdC169Ef90e59',
    },
    { label: 'MATIC', value: '0x0000000000000000000000000000000000000000' },
];

//订单状态有(0,1,2,3,4)五种值，分别表示：刚创建、部分成交、完全成交、部分成交后被撤单、未成交就撤单
export enum ORDER_STATUS {
    CREATED = 0,
    PART_SELLED = 1,
    ALL_SELLED = 2,
    PART_CANCELED = 3,
    CANCELED = 4,
}
