// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import "./SubStringUtils.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@reclaimprotocol/verifier-solidity-sdk/contracts/Reclaim.sol";
import "@reclaimprotocol/verifier-solidity-sdk/contracts/Addresses.sol";
import "hardhat/console.sol";

contract DataFeedDAO is ReentrancyGuard {
    using SubStringUtils for string;

    Reclaim public reclaimSDK;

    struct apiData {
        uint currentTick;
        uint gap;
        uint reward;
        uint fee;
        uint FRESH_SEC_DELTA;
        mapping(uint => string) data;
        mapping(uint => uint) ticks;
    }

    uint public cnt;
    mapping(uint => string) private urls;
    mapping(string => apiData) private urlToApiData;

    uint private currentBalance;
    mapping(address => uint) private funding;

    event Funded(address by, uint amount, uint currentBalance);

    constructor(Reclaim _reclaimSDK) {
        reclaimSDK = _reclaimSDK;
        cnt = 0;
    }

    function registerAPI(
        string memory _url,
        uint _gap,
        uint _reward,
        uint _fee,
        uint _FRESH_SEC_DELTA
    ) public {
        urls[cnt] = _url;
        urlToApiData[_url].currentTick = 0;
        urlToApiData[_url].gap = _gap;
        urlToApiData[_url].reward = _reward;
        urlToApiData[_url].fee = _fee;
        urlToApiData[_url].FRESH_SEC_DELTA = _FRESH_SEC_DELTA;
        cnt++;
    }

    receive() external payable {
        funding[msg.sender] += msg.value;
        currentBalance = address(this).balance;
        emit Funded(msg.sender, msg.value, currentBalance);
    }

    function checkDataValidity(
        string memory parameters,
        string memory _url,
        string memory _data
    ) private pure {
        // Checks for url match
        require(
            parameters.findSubstring(
                string(abi.encodePacked('"url":"', _url, '"'))
            ) != -1,
            "Invalid URL!"
        );

        // Checks for data match
        uint dataStartIndex = uint(parameters.findSubstring('"value":"') + 9);
        uint dataEndIndex = uint(
            parameters.findSubstring('"}],"responseRedactions":')
        );
        require(
            keccak256(
                bytes(parameters.substring(dataStartIndex, dataEndIndex))
            ) == keccak256(bytes(_data)),
            "Data mismatch!"
        );
    }

    function submitData(
        Reclaim.Proof memory proof,
        string memory _url,
        string memory _data
    ) public nonReentrant {
        require(
            proof.signedClaim.claim.timestampS >
                block.timestamp - urlToApiData[_url].FRESH_SEC_DELTA,
            "Outdated data!"
        );
        if (urlToApiData[_url].currentTick > 0) {
            require(
                urlToApiData[_url].ticks[urlToApiData[_url].currentTick - 1] +
                    urlToApiData[_url].gap <
                    block.number,
                "Too early!"
            );
        }

        string memory parameters = proof.claimInfo.parameters;

        reclaimSDK.verifyProof(proof);
        checkDataValidity(parameters, _url, _data);

        urlToApiData[_url].data[urlToApiData[_url].currentTick] = _data;
        urlToApiData[_url].ticks[urlToApiData[_url].currentTick] = block.number;
        urlToApiData[_url].currentTick++;
        if (address(this).balance >= urlToApiData[_url].reward) {
            (bool result, ) = msg.sender.call{value: urlToApiData[_url].reward}(
                ""
            );
            require(result);
        }
    }

    function getData(
        string memory url,
        uint tickOffset
    ) public returns (string memory) {
        require(urlToApiData[url].currentTick >= 1, "Data doesn't exist");
        require(
            funding[msg.sender] >= urlToApiData[url].fee,
            "Not enough fund"
        );
        funding[msg.sender] -= urlToApiData[url].fee;
        return
            urlToApiData[url].data[
                urlToApiData[url].currentTick - tickOffset - 1
            ];
    }

    function getUrl(uint id) public view returns (string memory) {
        require(id < cnt, "Invalid id");
        return urls[id];
    }

    function getApiData(
        string memory url
    ) public view returns (uint, uint, uint, uint, uint) {
        return (
            urlToApiData[url].currentTick,
            urlToApiData[url].gap,
            urlToApiData[url].reward,
            urlToApiData[url].fee,
            urlToApiData[url].FRESH_SEC_DELTA
        );
    }
}
