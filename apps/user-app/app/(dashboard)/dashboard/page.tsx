import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '../../lib/auth';
import { getBalance, getOnRampTransactions } from '../transfer/page';
import { OnRampTransactions } from '../../../components/OnRampTransactions';

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const userId = session?.user.id;
    const loggedIn = {
        name: session.user.name,
        email: session.user.email,
    };
    const balance = await getBalance();
    const onRampTransaction = await getOnRampTransactions();

    return (
        <div className="p-8 bg-gray-900 text-white w-full min-h-screen">
            {/* Header Section */}
            <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-8 rounded-xl shadow-lg flex justify-between items-center w-full">
                <div>
                    <h1 className="text-4xl font-bold">Welcome, {loggedIn.name}!</h1>
                    <p className="text-sm opacity-80">Manage your account efficiently.</p>
                </div>
            </header>

            {/* User Info Section */}
            <section className="mt-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                    <h3 className="text-xl font-semibold">Contact Information</h3>
                    <p className="mt-4 text-gray-300">Email: {loggedIn.email}</p>
                    <p className="text-gray-300">Name: {loggedIn.name}</p>
                </div>
            </section>

            {/* Balance Section */}
            <section className="mt-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex justify-between items-center hover:shadow-2xl transition-shadow">
                    <div>
                        <h2 className="text-xl font-bold">Total Balance</h2>
                        <p className="text-4xl font-bold text-purple-400 mt-2">Rs. {balance.amount}</p>
                    </div>
                    <img
                        src="/assets/wallet-icon.svg"
                        alt="Wallet Icon"
                        className="w-16 h-16 opacity-90"
                    />
                </div>
            </section>

            {/* Transaction History Section */}
            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                    <OnRampTransactions transactions={onRampTransaction} />
                </div>
            </section>
        </div>
    );
}
