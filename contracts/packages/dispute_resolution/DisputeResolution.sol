// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DisputeResolution {
    struct Evidence {
        address submitter;
        string ipfsHash;
        string description;
        uint256 timestamp;
    }

    struct Dispute {
        uint256 id;
        address complainant;
        address respondent;
        address arbitrator;
        uint8 status; // 0: OPEN, 1: VOTING, 2: RESOLVED, 3: APPEALED
        uint256 deadline;
        string resolution;
    }

    uint256 public disputeCount;
    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => Evidence[]) public disputeEvidences;

    event DisputeCreated(uint256 indexed id, address indexed complainant, address indexed respondent, address arbitrator);
    event EvidenceSubmitted(uint256 indexed id, address indexed submitter, string ipfsHash);
    event DisputeResolved(uint256 indexed id, string resolution);
    event DisputeAppealed(uint256 indexed id, address newArbitrator);

    function createDispute(address respondent, string memory ipfsHash, string memory description) external returns (uint256) {
        disputeCount++;
        address arbitrator = msg.sender == address(0) ? address(0) : msg.sender; // simplified assignment
        disputes[disputeCount] = Dispute({
            id: disputeCount,
            complainant: msg.sender,
            respondent: respondent,
            arbitrator: arbitrator,
            status: 0,
            deadline: block.timestamp + 7 days,
            resolution: ""
        });

        disputeEvidences[disputeCount].push(Evidence({
            submitter: msg.sender,
            ipfsHash: ipfsHash,
            description: description,
            timestamp: block.timestamp
        }));

        emit DisputeCreated(disputeCount, msg.sender, respondent, arbitrator);
        return disputeCount;
    }

    function addEvidence(uint256 disputeId, string memory ipfsHash, string memory description) external {
        require(disputes[disputeId].id != 0, "Dispute does not exist");
        disputeEvidences[disputeId].push(Evidence({
            submitter: msg.sender,
            ipfsHash: ipfsHash,
            description: description,
            timestamp: block.timestamp
        }));
        emit EvidenceSubmitted(disputeId, msg.sender, ipfsHash);
    }

    function resolveDispute(uint256 disputeId, string memory resolution) external {
        Dispute storage disp = disputes[disputeId];
        require(msg.sender == disp.arbitrator, "Only assigned arbitrator");
        disp.status = 2;
        disp.resolution = resolution;
        emit DisputeResolved(disputeId, resolution);
    }

    function appealDispute(uint256 disputeId, address newArbitrator) external {
        Dispute storage disp = disputes[disputeId];
        require(disp.status == 2, "Must be resolved first");
        disp.status = 3;
        disp.arbitrator = newArbitrator;
        emit DisputeAppealed(disputeId, newArbitrator);
    }
}
