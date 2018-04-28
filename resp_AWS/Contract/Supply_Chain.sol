pragma solidity ^0.4.18;

contract SupplyChain{

    struct StockItem{
        bytes32 barCode;
        uint checkinTime;
        bytes32 extrainfo;
    }


    event Itemchecked(address scanner, uint time);

    mapping(address => StockItem[]) public Records;


    function ScanItem(bytes32 _barCode, bytes32 _extrainfo) returns(bool success){

        StockItem memory stockItem;
        stockItem.barCode = _barCode;
        stockItem.checkinTime = now;
        stockItem.extrainfo = _extrainfo;

        Records[msg.sender].push(stockItem);

        Itemchecked(msg.sender, stockItem.checkinTime);

        return true;
    }

    function getInfo(address _address) view returns(bytes32[], bytes32[], uint[]){ // this does not cost gas
        uint length = Records[_address].length;

        bytes32[] memory codes = new bytes32[](length);
        bytes32[] memory extra = new bytes32[](length);
        uint[] memory times = new uint[](length);

        for (uint i=0; i < length; i++) {
            codes[i] = Records[_address][i].barCode;
            times[i] = Records[_address][i].checkinTime;
            extra[i] = Records[_address][i].extrainfo;
        }

        return (codes,extra, times);

    }


}
