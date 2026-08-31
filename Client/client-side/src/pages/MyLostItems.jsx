import { useEffect, useState } from "react";
import api from "../api";
import "../ui/MyLostItems.css";
import { useNavigate } from "react-router-dom";

function MyLostItems() {
    const navigate = useNavigate();

    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(true);

    // Current page
    const [page, setPage] = useState(1);

    // Fetch items
    const fetchLostItems = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.get("/see-lost-item", {
                params: {
                    page: page,
                    limit: 10
                },
                headers: {
                    auth: `Bearer ${token}`
                }
            });

            console.log("RESPONSE:", response.data);

            setItem(response.data.item || []);

        } catch (error) {

            console.log(error);

            if (error.response) {
                console.log(error.response.data);
            }

        } finally {
            setLoading(false);
        }
    };

    // Page change hone par API call
    useEffect(() => {
        fetchLostItems();
    }, [page]);


    // Previous
    const handlePrevious = () => {

        if (page > 1) {
            setPage(page - 1);
        }

    };


    // Next
    const handleNext = () => {

        if (item.length === 10) {
            setPage(page + 1);
        }

    };


    if (loading) {
        return (
            <div className="lost-loading">
                <p>Loading your lost items...</p>
            </div>
        );
    }


    return (
        <div className="my-lost-page">

            <div className="my-lost-header">

                <div>
                    <h1>My Lost Items</h1>
                    <p>Items you have reported as lost.</p>
                </div>

                <button className="report-new-btn">
                    + Report Lost Item
                </button>

            </div>


            {item.length === 0 ? (

                <div className="empty-state">
                    <h2>No Lost Items</h2>

                    <p>
                        You haven't reported any lost items yet.
                    </p>
                </div>

            ) : (

                <>
                    <div className="lost-items-grid">

                        {item.map((lostItem) => (

                            <div
                                className="lost-item-card"
                                key={lostItem.id}
                            >

                                <div className="item-image">

                                    {lostItem.image ? (

                                        <img
                                            src={lostItem.image}
                                            alt={lostItem.title}
                                        />

                                    ) : (

                                        <span>No Image</span>

                                    )}

                                </div>


                                <div className="item-content">

                                    <div className="item-title-row">

                                        <h2>
                                            {lostItem.title}
                                        </h2>

                                        <span className="status-badge">
                                            {lostItem.status}
                                        </span>

                                    </div>


                                    <p className="item-description">
                                        {lostItem.description}
                                    </p>


                                    <div className="item-info">

                                        <p>
                                            📍 {lostItem.location}
                                        </p>

                                        <p>
                                            📅 {lostItem.date}
                                        </p>

                                    </div>


                                    <div className="item-actions">

                                        <button className="view-btn">
                                            View
                                        </button>

                                        <button className="edit-btn">
                                            Edit
                                        </button>

                                        <button className="delete-btn">
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* Pagination */}

                    <div className="pagination">

                        <button
                            onClick={handlePrevious}
                            disabled={page === 1}
                        >
                            ← Previous
                        </button>


                        <span>
                            Page {page}
                        </span>


                        <button
                            onClick={handleNext}
                            disabled={item.length < 10}
                        >
                            Next →
                        </button>

                    </div>

                </>

            )}

        </div>
    );
}

export default MyLostItems;