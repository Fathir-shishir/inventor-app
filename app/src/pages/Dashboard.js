import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../components/Layout/Layout";

const Dashboard = () => {
    const [mobiles, setMobiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8005/api/Dashboard.php');
                setMobiles(response.data);
            } catch (error) {
                console.error('Error fetching mobile data:', error);
                alert('Failed to load mobile data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTotalQuantities = () => {
        let total = 0;
        mobiles.forEach(mobile => {
            Object.values(mobile.quantities).forEach(quantity => {
                total += quantity;
            });
        });
        return total;
    };

    if (isLoading) {
        return (
            <Layout>
                <div>Loading mobile data...</div>
            </Layout>
        );
    }

    if (!mobiles.length) {
        return (
            <Layout>
                <div>No mobile data found.</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-wrap justify-center -mx-4">
                {/* Detail Column */}
                <div className="w-full md:w-1/3 px-4 py-8 bg-gray-100 rounded-lg ">
                    <div className="mb-4  text-lg bg-[#a0f630] text-white p-4 rounded-lg">
                        <h2 className="text-center">Mobile</h2>
                        <h2 className="text-center">Total Quantity: {getTotalQuantities()}</h2>
                    </div>
                    {mobiles.map((mobile, index) => (
                        <div key={index} className="mb-3 p-4 bg-white rounded-lg shadow-lg flex justify-between items-center">
                            <h4 className="mb-2 justify-center">{mobile.model}</h4>
                            <div className="">
                                {Object.entries(mobile.quantities).map(([condition, quantity]) => (
                                    <p key={condition}>{condition}: {quantity}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Placeholder Columns for other content or layout balance */}
                {/* Column 2 */}
                <div className="w-full md:w-1/3 px-4">
                    {/* Additional content can go here */}
                </div>

                {/* Column 3 */}
                <div className="w-full md:w-1/3 px-4">
                    {/* Additional content can go here */}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
