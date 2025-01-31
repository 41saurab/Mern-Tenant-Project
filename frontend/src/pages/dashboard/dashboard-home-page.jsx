import React, { useEffect, useState } from "react";
import { roomSvc } from "./room/room-service";
import Chart from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const DashboardHomePage = () => {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({
        labels: ["Available", "Unavailable"],
        datasets: [
            {
                label: "Count",
                data: [0, 0], // Default counts: 0 available, 0 unavailable
                backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
                borderWidth: 1,
            },
        ],
    });

    const loadRooms = async () => {
        setLoading(true);
        try {
            const response = await roomSvc.getRooms();
            const rooms = response.data;

            // Calculate counts for "Available" and "Unavailable"
            const availableCount = rooms.filter((room) => room.status === "available").length;
            const unavailableCount = rooms.length - availableCount;

            // Update chart data
            setChartData({
                labels: ["Available", "Unavailable"],
                datasets: [
                    {
                        label: "Count",
                        data: [availableCount, unavailableCount],
                        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
                        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error("Error loading rooms:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRooms();
    }, []);

    return (
        <div className="flex w-full justify-center min-h-screen">
            <div className="w-[40%]">
                {loading ? (
                    <p>Loading chart data...</p>
                ) : (
                    <div>
                        <p className="text-center">Rooms</p>
                        <Doughnut data={chartData} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHomePage;
