import axios from 'axios';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import paiementAbi from '../abis/PaiementContract.json';
import { AppContext } from '../context/AppContext';

const CONTRACT_ADDRESS = '0xa9c5c3887f5e894bdacc26a9da56bf18376e02f5';

export default function PaymentPage() {
  const { backendUrl, token } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentId, patient, docteur, docteurAddr, docteurfrais } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [montant] = useState(docteurfrais || '0');
  const [txStatus, setTxStatus] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  // Initialisation du provider et du contrat
  useEffect(() => {
    async function init() {
      if (!appointmentId || !patient || !docteur || !docteurAddr) {
        setTxStatus('Erreur : Données du rendez-vous manquantes.');
        setLoading(false);
        return;
      }
      if (!window.ethereum) {
        setTxStatus('MetaMask non détecté !');
        setLoading(false);
        return;
      }
      try {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(prov);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setWalletConnected(accounts.length > 0);

        const c = new ethers.Contract(CONTRACT_ADDRESS, paiementAbi, prov);
        setContract(c);

        const count = await c.getPaiementsCount();
        if (Number(appointmentId) < count.toNumber()) {
          setIsPaid(true);
          setTxStatus('Paiement déjà enregistré.');
        }
      } catch (err) {
        console.error('Erreur de chargement:', err);
        setTxStatus("Erreur lors de l'initialisation du contrat");
      }
      setLoading(false);
    }
    init();
  }, [appointmentId, patient, docteur, docteurAddr]);

  async function connectWallet() {
    if (!window.ethereum) return alert('Veuillez installer MetaMask !');
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletConnected(accounts.length > 0);
    } catch (err) {
      console.error('Connexion MetaMask refusée', err);
    }
  }

  async function handlePay(e) {
    e.preventDefault();
    if (!walletConnected || !provider || !contract) return;

    // Vérification du solde
    try {
      const signer = provider.getSigner();
      const balance = await signer.getBalance();
      const required = ethers.utils.parseEther(montant.toString());
      if (balance.lt(required)) {
        setTxStatus('Solde insuffisant pour effectuer ce paiement.');
        return;
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du solde:', err);
      setTxStatus('Impossible de vérifier le solde du wallet.');
      return;
    }

    setTxStatus('Envoi de la transaction...');
    try {
      const signer = provider.getSigner();
      const cWithSigner = contract.connect(signer);
      const txResponse = await cWithSigner.createPaiement(
        patient,
        docteur,
        docteurAddr,
        new Date().toISOString(),
        { value: ethers.utils.parseEther(montant.toString()) }
      );
      const receipt = await txResponse.wait();

      if (receipt.status === 1) {
        // Transaction réussie
        setIsPaid(true);
        setTxStatus('Paiement effectué avec succès !');
        // Notifier le backend
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifypayment`,
            { txHash: receipt.transactionHash, appointmentId },
            { headers: { token } }
          );
          if (data.success) {
            toast.success('Rendez-vous marqué comme payé.');
            navigate('/my-appointments');
          } else {
            toast.error(data.message || 'Échec de la mise à jour backend.');
          }
        } catch (backendErr) {
          console.error('Erreur backend:', backendErr);
          toast.error('Erreur lors de la notification du paiement.');
        }
      } else {
        // Transaction échouée
        setTxStatus('La transaction a échoué.');
      }
    } catch (err) {
      console.error('Erreur transaction:', err);
      if (err.code === 4001) {
        // Rejet par l'utilisateur
        setTxStatus('Transaction annulée par l "utilisateur.');
      } else {
        setTxStatus(`Transaction annulée par l "utilisateur`);
      }
    }
  }

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement du paiement...</p>;
  if (isPaid)
    return (
      <div className="max-w-md mx-auto mt-8 border rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Paiement déjà effectué</h2>
        <p>Le paiement pour le rendez-vous #{appointmentId} a déjà été enregistré.</p>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-8 border rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Paiement Rendez-vous #{appointmentId}</h2>
      <p className="mb-2">
        <strong>Patient :</strong> {patient}
      </p>
      <p className="mb-4">
        <strong>Docteur :</strong> {docteur}
      </p>

      {!walletConnected ? (
        <button
          onClick={connectWallet}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition"
        >
          Connecter MetaMask
        </button>
      ) : (
        <form onSubmit={handlePay} className="space-y-4 mt-4">
          <div>
            <label htmlFor="montant" className="block font-medium mb-1">
              Montant (ETH)
            </label>
            <input
              id="montant"
              type="number"
              step="0.0001"
              value={montant}
              readOnly
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Payer le montant
          </button>
        </form>
      )}

      {txStatus && <p className="mt-4 text-center text-sm text-gray-700">{txStatus}</p>}
    </div>
  );
}
