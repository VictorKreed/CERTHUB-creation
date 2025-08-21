export const FACTORY_ABI = [
  {
    "type": "function",
    "name": "approveInstitutionAdmin",
    "inputs": [
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "verifiedWalletAddress", "type": "address", "internalType": "address" },
      { "name": "institutionAdminAddress", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "checkRegistrationDetails",
    "inputs": [
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "walletAddress", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct CredentialsAndCertificatesFactoryContract.RegisteredInstitution",
        "components": [
          { "name": "InstitutionName", "type": "string", "internalType": "string" },
          { "name": "InstitutionType", "type": "string", "internalType": "string" },
          { "name": "IndustryOrSector", "type": "string", "internalType": "string" },
          { "name": "LegalOrOperatingAddress", "type": "string", "internalType": "string" },
          { "name": "EmailAddress", "type": "string", "internalType": "string" },
          { "name": "WebsiteUrlOrDomainName", "type": "string", "internalType": "string" },
          { "name": "WalletAddress1", "type": "address", "internalType": "address" },
          { "name": "WalletAddress2", "type": "address", "internalType": "address" },
          { "name": "WalletAddress3", "type": "address", "internalType": "address" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claimCertificate",
    "inputs": [
      { "name": "studentName", "type": "string", "internalType": "string" },
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "certificateName", "type": "string", "internalType": "string" },
      { "name": "certificateId", "type": "string", "internalType": "string" },
      { "name": "proof", "type": "bytes32[]", "internalType": "bytes32[]" },
      { "name": "recipientWalletAddress", "type": "address", "internalType": "address" },
      { "name": "studentId", "type": "uint256", "internalType": "uint256" },
      { "name": "certificateYear", "type": "uint256", "internalType": "uint256" },
      { "name": "institutionWalletAddress", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createCertificate",
    "inputs": [
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "certificateName", "type": "string", "internalType": "string" },
      { "name": "certificateId", "type": "string", "internalType": "string" },
      { "name": "uri", "type": "string", "internalType": "string" },
      { "name": "merkleRoot", "type": "bytes32", "internalType": "bytes32" },
      { "name": "certificateYear", "type": "uint256", "internalType": "uint256" },
      { "name": "certificateTokenQuantity", "type": "uint256", "internalType": "uint256" },
      { "name": "verifiedWalletAddress", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "disapproveInstitutionAdmin",
    "inputs": [
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "verifiedWalletAddress", "type": "address", "internalType": "address" },
      { "name": "institutionAdminAddress", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "expandCertificateDetails",
    "inputs": [
      { "name": "institutionWalletAddress", "type": "address", "internalType": "address" },
      { "name": "certificateName", "type": "string", "internalType": "string" },
      { "name": "certificateYear", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "details",
        "type": "tuple",
        "internalType": "struct ICredentialsAndCertificatesImplementation.Certificate",
        "components": [
          { "name": "InstitutionAddress", "type": "address", "internalType": "address" },
          { "name": "IssuerAddress", "type": "address", "internalType": "address" },
          { "name": "InstitutionName", "type": "string", "internalType": "string" },
          { "name": "CertificateName", "type": "string", "internalType": "string" },
          { "name": "CertificateId", "type": "string", "internalType": "string" },
          { "name": "CertificateYear", "type": "uint256", "internalType": "uint256" },
          { "name": "Uri", "type": "string", "internalType": "string" },
          { "name": "MerkleRoot", "type": "bytes32", "internalType": "bytes32" },
          { "name": "CertificateTokenQuantity", "type": "uint256", "internalType": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "factory_agent",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getClaimedCertificates",
    "inputs": [{ "name": "recipientAddress", "type": "address", "internalType": "address" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct ICredentialsAndCertificatesImplementation.Recipient[]",
        "components": [
          { "name": "RecipientName", "type": "string", "internalType": "string" },
          { "name": "CertificateName", "type": "string", "internalType": "string" },
          { "name": "CertificateYear", "type": "uint256", "internalType": "uint256" },
          { "name": "CertificateId", "type": "string", "internalType": "string" },
          { "name": "RecipientId", "type": "uint256", "internalType": "uint256" },
          { "name": "InstitutionName", "type": "string", "internalType": "string" },
          { "name": "Claimed", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "implementation_contract",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      { "name": "implementationAddress", "type": "address", "internalType": "address" },
      { "name": "ultimateFactoryAgent", "type": "address", "internalType": "address" },
      { "name": "factoryAgent0", "type": "address", "internalType": "address" },
      { "name": "factoryAgent1", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "institution_admins",
    "inputs": [
      { "name": "", "type": "string", "internalType": "string" },
      { "name": "", "type": "address", "internalType": "address" },
      { "name": "", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "institution_certificates",
    "inputs": [
      { "name": "", "type": "address", "internalType": "address" },
      { "name": "", "type": "string", "internalType": "string" },
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "recipient_claims",
    "inputs": [
      { "name": "", "type": "address", "internalType": "address" },
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerInstitution",
    "inputs": [
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "institutionType", "type": "string", "internalType": "string" },
      { "name": "industryOrSector", "type": "string", "internalType": "string" },
      { "name": "legalOrOperatingAddress", "type": "string", "internalType": "string" },
      { "name": "emailAddress", "type": "string", "internalType": "string" },
      { "name": "websiteUrlOrDomainName", "type": "string", "internalType": "string" },
      { "name": "walletAddress1", "type": "address", "internalType": "address" },
      { "name": "walletAddress2", "type": "address", "internalType": "address" },
      { "name": "walletAddress3", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registered_institutions",
    "inputs": [
      { "name": "", "type": "string", "internalType": "string" },
      { "name": "", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "InstitutionName", "type": "string", "internalType": "string" },
      { "name": "InstitutionType", "type": "string", "internalType": "string" },
      { "name": "IndustryOrSector", "type": "string", "internalType": "string" },
      { "name": "LegalOrOperatingAddress", "type": "string", "internalType": "string" },
      { "name": "EmailAddress", "type": "string", "internalType": "string" },
      { "name": "WebsiteUrlOrDomainName", "type": "string", "internalType": "string" },
      { "name": "WalletAddress1", "type": "address", "internalType": "address" },
      { "name": "WalletAddress2", "type": "address", "internalType": "address" },
      { "name": "WalletAddress3", "type": "address", "internalType": "address" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "removeFactoryAgent",
    "inputs": [{ "name": "agentAddress", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revoke_a_Certificate",
    "inputs": [
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "certificateName", "type": "string", "internalType": "string" },
      { "name": "certificateYear", "type": "uint256", "internalType": "uint256" },
      { "name": "institutionWalletAddress", "type": "address", "internalType": "address" },
      { "name": "studentAddress", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ultimate_factory_agent",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "unverifyInstitution",
    "inputs": [
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "walletAddress", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateCertificate",
    "inputs": [
      { "name": "institutionWalletAddress", "type": "address", "internalType": "address" },
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "previousCertificateName", "type": "string", "internalType": "string" },
      { "name": "certificateName", "type": "string", "internalType": "string" },
      { "name": "certificateId", "type": "string", "internalType": "string" },
      { "name": "uri", "type": "string", "internalType": "string" },
      { "name": "previousCertificateYear", "type": "uint256", "internalType": "uint256" },
      { "name": "newCertificateYear", "type": "uint256", "internalType": "uint256" },
      { "name": "merkleRoot", "type": "bytes32", "internalType": "bytes32" },
      { "name": "certificateTokenUpdateQuantity", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeCredentialsImplementation",
    "inputs": [{ "name": "newImplementation", "type": "address", "internalType": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "verified_institutions",
    "inputs": [
      { "name": "", "type": "string", "internalType": "string" },
      { "name": "", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyCertificate",
    "inputs": [
      { "name": "recipientAddress", "type": "address", "internalType": "address" },
      { "name": "certificateName", "type": "string", "internalType": "string" },
      { "name": "certificateYear", "type": "uint256", "internalType": "uint256" },
      { "name": "institutionWalletAddress", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "details",
        "type": "tuple",
        "internalType": "struct ICredentialsAndCertificatesImplementation.Recipient",
        "components": [
          { "name": "RecipientName", "type": "string", "internal-klinternalType": "string" },
          { "name": "CertificateName", "type": "string", "internalType": "string" },
          { "name": "CertificateYear", "type": "uint256", "internalType": "uint256" },
          { "name": "CertificateId", "type": "string", "internalType": "string" },
          { "name": "RecipientId", "type": "uint256", "internalType": "uint256" },
          { "name": "InstitutionName", "type": "string", "internalType": "string" },
          { "name": "Claimed", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyInstitution",
    "inputs": [
      { "name": "institutionName", "type": "string", "internalType": "string" },
      { "name": "institutionWalletAddress", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "CertificateDeployed",
    "inputs": [
      { "name": "certificateAddress", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "institutionAddress", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "institutionName", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "certificateName", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "year", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CertificateUpdated",
    "inputs": [
      { "name": "certificateAddress", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "institutionAddress", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "institutionName", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "certificateName", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "year", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FactoryAgentRemoved",
    "inputs": [
      { "name": "agent", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "removedBy", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [{ "name": "version", "type": "uint64", "indexed": false, "internalType": "uint64" }],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "InstitutionRegistered",
    "inputs": [
      { "name": "institutionName", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "institutionType", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "industryOrSector", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "legalOrOperatingAddress", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "emailAddress", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "websiteUrlOrDomainName", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "walletAddress1", "type": "address", "indexed": false, "internalType": "address" },
      { "name": "walletAddress2", "type": "address", "indexed": false, "internalType": "address" },
      { "name": "walletAddress3", "type": "address", "indexed": false, "internalType": "address" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "InstitutionUnverified",
    "inputs": [
      { "name": "institution", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "agent", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "FailedDeployment",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientBalance",
    "inputs": [
      { "name": "balance", "type": "uint256", "internalType": "uint256" },
      { "name": "needed", "type": "uint256", "internalType": "uint256" }
    ]
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  }
];