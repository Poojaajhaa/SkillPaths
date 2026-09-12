import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://skillpaths-backend.onrender.com";

type Order = {
    id: number;
    amount: string;
    status?: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    course: {
        courseName: string;
        category: string;
    };
};

function SellerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSellerOrders = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/seller/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.dispatchEvent(new Event("auth-change"));
                        navigate("/login");
                        return;
                    }
                    if (response.status === 403) {
                        setErrorMessage(data.message || "You do not have permission to view seller orders.");
                        return;
                    }
                    throw new Error(data.message || "Failed to fetch seller orders");
                }

                setOrders(data);
            } catch (error: any) {
                console.error("Seller orders error:", error);
                setErrorMessage(error.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchSellerOrders();
    }, [navigate]);

    const handleStatusChange = async (orderId: number, status: string) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `${API_URL}/api/seller/orders/${orderId}/status`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.dispatchEvent(new Event("auth-change"));
                    navigate("/login");
                    return;
                }
                console.error("Status update error:", data);
                return;
            }

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, status } : order
                )
            );
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

    const token = localStorage.getItem("token");
    if (!token) {
        return <div className="p-6">Please log in first.</div>;
    }

    if (loading) {
        return <div className="p-6">Loading seller orders...</div>;
    }

    if (errorMessage) {
        return (
            <div className="p-6 text-red-600">
                <p className="font-semibold">Access Error:</p>
                <p>{errorMessage}</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Seller Orders</h1>

            {orders.length === 0 ? (
                <p className="mt-4">No orders yet.</p>
            ) : (
                <div className="mt-4 space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="rounded-xl border p-5">
                            <h2 className="font-semibold">{order.course.courseName}</h2>
                            <p>Buyer: {order.user.name}</p>
                            <p>Email: {order.user.email}</p>
                            <p>Amount: {order.amount}</p>
                            <div className="mt-2">
                                <label className="mr-2 font-medium">Status:</label>
                                <select
                                    value={order.status || "PENDING"}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="rounded-lg border px-3 py-1"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            <p>Created At: {order.createdAt}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SellerOrdersPage;