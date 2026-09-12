import { useEffect, useState } from 'react';

const API_URL = "https://skillpaths-backend.onrender.com";

type Order = {
    id: number;
    amount: string;
    status: string;
    createdAt: string;
    course: {
        courseName: string;
        category: string;
    }
}
function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");

            if(!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/orders`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                const data = await response.json();

                if(!response.ok) {
                    throw new Error(data.message || "Failed to fetch orders")
                }

                setOrders(data || []);
            } catch (error) {
                console.error(" Orders error ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);
    if (loading) {
        return <div className="p-6">Loading orders…</div>;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        return <div className="p-6">Please log in to view your orders.</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <ul className="space-y-4">
                    {orders.map((o) => (
                        <li key={o.id} className="border p-4 rounded">
                            <div className="flex justify-between">
                                <div>
                                    <div className="font-bold">{o.course.courseName}</div>
                                    <div className="text-sm text-gray-600">{o.course.category}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{o.amount}</div>
                                    <div className="text-sm">{o.status}</div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(o.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyOrdersPage;