"use client";

import Link from "next/link";

export default function Docs() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CERTHUB
          </Link>
          <div className="text-sm">
            <span className="rounded-md bg-emerald-500/10 px-3 py-1 text-emerald-300">
              Documentation
            </span>
          </div>
        </header>

        <section className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">CERTHUB Documentation</h1>
          <p className="mt-2 text-white/70">
            CERTHUB is a blockchain-based platform for issuing, claiming, and verifying certificates on the Hyperion Explorer. This documentation covers the smart contract functionality, user interface workflows, input requirements, and precautions for users.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ul className="list-disc pl-5 text-white/70">
            <li><a href="#overview" className="hover:underline text-emerald-400">Overview</a></li>
            <li><a href="#smart-contracts" className="hover:underline text-emerald-400">Smart Contract Functions</a></li>
            <li><a href="#ui-workflows" className="hover:underline text-emerald-400">UI Workflows</a></li>
            <li><a href="#input-guidelines" className="hover:underline text-emerald-400">Input Guidelines</a></li>
            <li><a href="#precautions" className="hover:underline text-emerald-400">Precautions</a></li>
            <li><a href="#fetching-data" className="hover:underline text-emerald-400">Fetching Data</a></li>
          </ul>
        </section>

        <section id="overview" className="mb-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-white/70">
            CERTHUB leverages the Hyperion Testnet to provide a secure, transparent, and tamper-proof system for certificate management. Institutions issue soulbound (non-transferable) certificates, recipients claim them using Merkle proofs, and anyone can verify claims or inspect certificate details. The platform ensures authenticity through institution verification and blockchain immutability.
          </p>
          <p className="text-white/70 mt-2">
            Key features include institution registration, certificate issuance and updates, claim verification, and profile management. The smart contracts enforce access control, while the UI provides an intuitive interface for all users.
          </p>
        </section>

        <section id="smart-contracts" className="mb-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold mb-4">Smart Contract Functions</h2>
          <p className="text-white/70 mb-4">
            The core functionality resides in the `CredentialsAndCertificatesFactoryContract` and `ICredentialsAndCertificatesImplementation` contracts, deployed on the Hyperion Testnet. Below are the primary functions:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-400">registerInstitution</h3>
              <p className="text-white/70">
                Registers a new institution, restricted to factory agents.
              </p>
              <pre className="bg-black/50 p-4 rounded-lg text-sm text-white/80 mt-2">
{`function registerInstitution(
  address institutionWalletAddress,
  string calldata institutionName
) public onlyFactoryAgent {
  // Stores in verified_institutions mapping
}`}
              </pre>
              <p className="text-white/70 mt-2">
                <strong>Inputs:</strong> Institution wallet address (e.g., `0x123...`), institution name (e.g., `Harvard`).
                <br />
                <strong>Output:</strong> Emits `InstitutionRegistered` event.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">issueCertificate</h3>
              <p className="text-white/70">
                Issues a new certificate, restricted to verified institutions or admins.
              </p>
              <pre className="bg-black/50 p-4 rounded-lg text-sm text-white/80 mt-2">
{`function issueCertificate(
  address institutionWalletAddress,
  string calldata institutionName,
  string calldata certificateName,
  string calldata certificateId,
  string calldata uri,
  uint256 certificateYear,
  bytes32 merkleRoot,
  uint256 certificateTokenQuantity
) public onlyVerifiedInstitutionOrAdmin(institutionName, institutionWalletAddress) {
  // Deploys certificate contract, stores in institution_certificates
}`}
              </pre>
              <p className="text-white/70 mt-2">
                <strong>Inputs:</strong> Institution wallet address, institution name, certificate name (e.g., `Bachelor of Science`), certificate ID (e.g., `CERT123`), URI (e.g., `ipfs://Qm...`), year (e.g., `2023`), Merkle root (32-byte hex), token quantity (e.g., `100`).
                <br />
                <strong>Output:</strong> Emits `CertificateIssued` event.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">updateCertificate</h3>
              <p className="text-white/70">
                Updates an existing certificate’s details, restricted to verified institutions or admins.
              </p>
              <pre className="bg-black/50 p-4 rounded-lg text-sm text-white/80 mt-2">
{`function updateCertificate(
  address institutionWalletAddress,
  string calldata institutionName,
  string calldata previousCertificateName,
  string calldata certificateName,
  string calldata certificateId,
  string calldata uri,
  uint256 previousCertificateYear,
  uint256 newCertificateYear,
  bytes32 merkleRoot,
  uint256 certificateTokenUpdateQuantity
) public onlyVerifiedInstitutionOrAdmin(institutionName, institutionWalletAddress) {
  // Updates certificate details via institution_certificates mapping
}`}
              </pre>
              <p className="text-white/70 mt-2">
                <strong>Inputs:</strong> Institution wallet address, institution name, previous certificate name, new certificate name, certificate ID, URI, previous year, new year, Merkle root, token quantity.
                <br />
                <strong>Output:</strong> Emits `CertificateUpdated` event.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">verifyCertificate</h3>
              <p className="text-white/70">
                Verifies a recipient’s certificate claim, public function.
              </p>
              <pre className="bg-black/50 p-4 rounded-lg text-sm text-white/80 mt-2">
{`function verifyCertificate(
  address recipientAddress,
  string calldata certificateName,
  uint256 certificateYear,
  address institutionWalletAddress
) public view returns (Recipient memory details) {
  // Returns Recipient struct with claim details
}`}
              </pre>
              <p className="text-white/70 mt-2">
                <strong>Inputs:</strong> Recipient address, certificate name, certificate year, institution wallet address.
                <br />
                <strong>Output:</strong> `Recipient` struct (`RecipientName`, `CertificateName`, `CertificateYear`, `CertificateId`, `RecipientId`, `InstitutionName`, `Claimed`).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">claimCertificate (Assumed)</h3>
              <p className="text-white/70">
                Allows recipients to claim a certificate using a Merkle proof.
              </p>
              <pre className="bg-black/50 p-4 rounded-lg text-sm text-white/80 mt-2">
{`function claimCertificate(
  address recipientAddress,
  string calldata certificateId,
  string calldata institutionName,
  bytes32[] calldata merkleProof
) public {
  // Verifies Merkle proof and marks claim in certificate contract
}`}
              </pre>
              <p className="text-white/70 mt-2">
                <strong>Inputs:</strong> Recipient address, certificate ID, institution name, Merkle proof (array of 32-byte hex strings).
                <br />
                <strong>Output:</strong> Emits `CertificateClaimed` event.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">expandCertificateDetails (Assumed)</h3>
              <p className="text-white/70">
                Retrieves detailed certificate information, public function.
              </p>
              <pre className="bg-black/50 p-4 rounded-lg text-sm text-white/80 mt-2">
{`function expandCertificateDetails(
  address institutionWalletAddress,
  string calldata certificateName,
  uint256 certificateYear
) public view returns (string memory certificateId, string memory uri, bytes32 merkleRoot, uint256 tokenQuantity) {
  // Returns certificate metadata
}`}
              </pre>
              <p className="text-white/70 mt-2">
                <strong>Inputs:</strong> Institution wallet address, certificate name, certificate year.
                <br />
                <strong>Output:</strong> Certificate ID, URI, Merkle root, token quantity.
              </p>
            </div>
          </div>
        </section>

        <section id="ui-workflows" className="mb-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold mb-4">UI Workflows</h2>
          <p className="text-white/70 mb-4">
            The CERTHUB UI provides intuitive pages for interacting with the smart contracts. Below are the main workflows:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-400">Register Institution (/register)</h3>
              <p className="text-white/70">
                Factory agents register institutions to allow them to issue certificates.
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2">
                <li>Navigate to <Link href="/register" className="text-emerald-400 hover:underline">/register</Link>.</li>
                <li>Connect a factory agent wallet (e.g., `0x85E12F2100554D46b498D887a83ABBf9C42fF951`).</li>
                <li>Enter institution wallet address and name.</li>
                <li>Submit to register the institution.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">Issue Certificate (/issue)</h3>
              <p className="text-white/70">
                Verified institutions or admins issue new certificates with Merkle proofs for recipients.
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2">
                <li>Navigate to <Link href="/issue" className="text-emerald-400 hover:underline">/issue</Link>.</li>
                <li>Connect an institution admin wallet.</li>
                <li>Enter institution details, certificate details (name, ID, URI, year, token quantity), and recipient addresses.</li>
                <li>Generate a Merkle root and download proofs via the UI.</li>
                <li>Submit to deploy the certificate contract.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">Update Certificate (/agent/update-certificate)</h3>
              <p className="text-white/70">
                Verified institutions or admins update existing certificate details.
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2">
                <li>Navigate to <Link href="/agent/update-certificate" className="text-emerald-400 hover:underline">/agent/update-certificate</Link>.</li>
                <li>Connect an institution admin wallet.</li>
                <li>Enter institution name, previous certificate details (name, year), and updated details (name, ID, URI, year, Merkle root, token quantity).</li>
                <li>Optionally generate a new Merkle root and download proofs.</li>
                <li>Submit to update the certificate.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">Claim Certificate (/claim)</h3>
              <p className="text-white/70">
                Recipients claim their certificates using a Merkle proof.
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2">
                <li>Navigate to <Link href="/claim" className="text-emerald-400 hover:underline">/claim</Link>.</li>
                <li>Connect the recipient’s wallet.</li>
                <li>Enter certificate ID, institution name, and upload or paste the Merkle proof.</li>
                <li>Submit to claim the certificate.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">Verify Certificate Claim (/verify)</h3>
              <p className="text-white/70">
                Anyone can verify a recipient’s certificate claim.
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2">
                <li>Navigate to <Link href="/verify" className="text-emerald-400 hover:underline">/verify</Link>.</li>
                <li>Enter institution wallet address, certificate name, certificate year, and recipient address.</li>
                <li>Submit to view claim details (e.g., Recipient Name, Certificate ID, Claimed status).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">Inspect Certificate (/inspect)</h3>
              <p className="text-white/70">
                View detailed certificate metadata.
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2">
                <li>Navigate to <Link href="/inspect" className="text-emerald-400 hover:underline">/inspect</Link>.</li>
                <li>Enter institution wallet address, certificate name, and certificate year.</li>
                <li>Submit to view certificate details (e.g., ID, URI, Merkle root).</li>
                <li><strong>Note:</strong> This feature may encounter issues (e.g., `CALL_EXCEPTION`); check logs for debugging.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400">View Profiles (/profile)</h3>
              <p className="text-white/70">
                View institution or recipient profiles, including issued or claimed certificates.
              </p>
              <ul className="list-disc pl-5 text-white/70 mt-2">
                <li>Navigate to <Link href="/profile" className="text-emerald-400 hover:underline">/profile</Link>.</li>
                <li>Connect a wallet to view your profile or enter an address to view another’s.</li>
                <li>Displays issued certificates (for institutions) or claimed certificates (for recipients).</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="input-guidelines" className="mb-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold mb-4">Input Guidelines</h2>
          <p className="text-white/70 mb-4">
            Accurate inputs are critical for successful contract interactions. Below are guidelines for each input type:
          </p>
          <ul className="list-disc pl-5 text-white/70 space-y-2">
            <li><strong>Ethereum Addresses</strong> (e.g., `institutionWalletAddress`, `recipientAddress`): Must be valid 40-character hexadecimal strings prefixed with `0x` (e.g., `0x1234567890abcdef1234567890abcdef12345678`). Use wallets like MetaMask.</li>
            <li><strong>Institution Name</strong>: A string identifying the institution (e.g., `Harvard`). Must match the registered name exactly for restricted functions.</li>
            <li><strong>Certificate Name</strong>: A string describing the certificate (e.g., `Bachelor of Science`). Case-sensitive and must match existing records for updates/verification.</li>
            <li><strong>Certificate ID</strong>: A unique string identifier (e.g., `CERT123`). Avoid spaces or special characters unless supported.</li>
            <li><strong>URI</strong>: A link to certificate metadata, typically an IPFS URL (e.g., `ipfs://Qm...`). Ensure the link is accessible.</li>
            <li><strong>Certificate Year</strong>: A positive integer (e.g., `2023`). Use four digits for consistency.</li>
            <li><strong>Merkle Root</strong>: A 32-byte hexadecimal string prefixed with `0x` (e.g., `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`). Generated via the UI’s `/api/merkle` endpoint.</li>
            <li><strong>Merkle Proof</strong>: An array of 32-byte hex strings (e.g., `["0x123...", "0x456..."]`). Upload a JSON file from `/issue` or `/update-certificate` or paste manually.</li>
            <li><strong>Token Quantity</strong>: A positive integer (e.g., `100`). Represents the number of certificate tokens issued or updated.</li>
          </ul>
        </section>

        <section id="precautions" className="mb-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold mb-4">Precautions</h2>
          <p className="text-white/70 mb-4">
            To ensure smooth interaction with CERTHUB, follow these precautions:
          </p>
          <ul className="list-disc pl-5 text-white/70 space-y-2">
            <li><strong>Wallet Connection</strong>: Connect a wallet via MetaMask for actions requiring transactions (e.g., `/register`, `/issue`, `/claim`, `/agent/update-certificate`). Ensure the wallet is on the Hyperion Testnet.</li>
            <li><strong>Network</strong>: Switch to the Hyperion Testnet (RPC: `https://hyperion-testnet.metisdevops.link`) in MetaMask. Mismatched networks cause errors.</li>
            <li><strong>Access Control</strong>: Only factory agents can access `/register`. Only verified institution admins can access `/issue` and `/agent/update-certificate`. Verify your wallet’s permissions via the contract’s `institution_admins` mapping.</li>
            <li><strong>Input Accuracy</strong>: Double-check addresses, names, and years. Errors like “Certificate address lookup failed” occur if inputs don’t match contract records.</li>
            <li><strong>Merkle Proofs</strong>: Ensure proofs match the certificate’s Merkle root. Use the downloaded JSON from `/issue` or `/update-certificate`.</li>
            <li><strong>Gas Fees</strong>: Hyperion .</li>
            <li><strong>Error Handling</strong>: Common errors include “Certificate address lookup failed” (invalid certificate details), “Unauthorized” (access control), or `CALL_EXCEPTION` (contract issues). Check console logs for details.</li>
            <li><strong>Testing</strong>: Use test data (e.g., factory agent `0x85E12F2100554D46b498D887a83ABBf9C42fF951`) on Hyperion Testnet to avoid real-world consequences.</li>
          </ul>
        </section>

        <section id="fetching-data" className="mb-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold mb-4">Fetching Data</h2>
          <p className="text-white/70 mb-4">
            CERTHUB allows users to retrieve certificate and claim data via public `view` functions and UI pages:
          </p>
          <ul className="list-disc pl-5 text-white/70 space-y-2">
            <li><strong>Verify a Claim (/verify)</strong>: Use `verifyCertificate` to check if a recipient has claimed a certificate. Returns a `Recipient` struct with details like `RecipientName`, `CertificateId`, and `Claimed` status.</li>
            <li><strong>Inspect Certificates (/inspect)</strong>: Use `expandCertificateDetails` to retrieve certificate metadata (ID, URI, Merkle root, token quantity). Note: Debug `CALL_EXCEPTION` if errors occur.</li>
            <li><strong>Profiles (/profile)</strong>: View issued or claimed certificates for an institution or recipient. Query `institution_certificates` or `claimedCertificates` mappings.</li>
            <li><strong>Contract Queries</strong>: Use `ethers.js` or similar to call `view` functions directly:
              <pre className="bg-black/50 p-4 rounded-lg text-sm text-white/80 mt-2">
{`const provider = new ethers.JsonRpcProvider("https://hyperion-testnet.metisdevops.link");
const contract = new ethers.Contract("0xC04b063F5Fd9F03B67359DE79d3b18a55f73cB0c", ABI, provider);
const details = await contract.verifyCertificate("0x123...", "Bachelor of Science", 2023, "0x456...");
console.log(details); // Recipient struct
`}
              </pre>
            </li>
            <li><strong>Event Logs</strong>: Monitor events like `CertificateIssued`, `CertificateUpdated`, or `CertificateClaimed` using ethers.js or a blockchain explorer for transaction history.</li>
          </ul>
        </section>

        <div className="mt-6">
          <Link href="/" className="text-white/70 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}