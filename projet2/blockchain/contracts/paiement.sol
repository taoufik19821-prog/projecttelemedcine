// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaiementTracker {
    struct Paiement {
        string patient;
        string docteur;
        string dateEnvoi;
        string statut;           // "pending", "accepted", "rejected"
        uint256 montant;
        address payable patientAddr;
        address payable docteurAddr;
    }

    Paiement[] public paiements;

    event PaiementCreated(
        uint indexed index,
        string patient,
        string docteur,
        string dateEnvoi,
        string statut,
        uint256 montant,
        address sender
    );
    event PaiementUpdated(uint indexed index, string newStatut);

    /// @notice Le patient crée un paiement et les fonds sont immédiatement transférés au docteur
    function createPaiement(
        string calldata patient,
        string calldata docteur,
        address payable docteurAddr,
        string calldata dateEnvoi
    ) external payable {
        require(msg.value > 0, "solde insuffisant");

        // Enregistrer le paiement (statut initial "pending")
        paiements.push(Paiement({
            patient: patient,
            docteur: docteur,
            dateEnvoi: dateEnvoi,
            statut: "pending",
            montant: msg.value,
            patientAddr: payable(msg.sender),
            docteurAddr: docteurAddr
        }));
        uint idx = paiements.length - 1;
        emit PaiementCreated(idx, patient, docteur, dateEnvoi, "pending", msg.value, msg.sender);

        // Transfert immédiat au docteur
        docteurAddr.transfer(msg.value);
    }

    /// @notice Le docteur peut juste mettre à jour le statut (sans toucher aux fonds)
    function updateStatut(uint256 index, string calldata newStatut) external {
        Paiement storage p = paiements[index];
        require(msg.sender == p.docteurAddr, "adresse le docteur");
        
  require(keccak256(bytes(p.statut)) == keccak256(bytes("pending")), unicode"Statut déjà modifié");
        require(
            keccak256(bytes(newStatut)) == keccak256(bytes("accepted")) ||
            keccak256(bytes(newStatut)) == keccak256(bytes("rejected")),
            "Statut invalide"
        );

        p.statut = newStatut;
        emit PaiementUpdated(index, newStatut);
    }

    function getPaiementsCount() external view returns (uint256) {
        return paiements.length;
    }

    function getPaiement(uint256 index)
        external
        view
        returns (
            string memory patient,
            string memory docteur,
            string memory dateEnvoi,
            string memory statut,
            uint256 montant,
            address patientAddr,
            address docteurAddr
        )
    {
        Paiement storage p = paiements[index];
        return (
            p.patient,
            p.docteur,
            p.dateEnvoi,
            p.statut,
            p.montant,
            p.patientAddr,
            p.docteurAddr
        );
    }
}
