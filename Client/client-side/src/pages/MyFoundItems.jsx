
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../ui/MyFoundItems.css";

function MyFoundItems() {

    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);


    // ================= FETCH MY FOUND ITEMS =================

    useEffect(() => {

        FetchFoundItems();

    }, [page]);


    const FetchFoundItems = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {

                navigate("/login");

                return;

            }


            const response = await api.get(
                `/see-found-item?page=${page}&limit=${limit}`,
                {
                    headers: {
                        auth: `Bearer ${token}`
                    }
                }
            );


            console.log(
                "FOUND ITEMS RESPONSE:",
                response.data
            );


            setItems(
                response.data.item || []
            );


        } catch (error) {

            console.log(error);


            if (error.response) {

                if (error.response.status === 404) {

                    setItems([]);

                } else if (error.response.status === 401) {

                    alert("Session expired. Please login again.");

                    localStorage.removeItem("token");

                    navigate("/login");

                } else {

                    alert(
                        error.response.data.detail ||
                        "Unable to fetch found items"
                    );

                }

            } else {

                alert("Something went wrong");

            }

        } finally {

            setLoading(false);

        }

    };


    // ================= NEXT PAGE =================

    const HandleNext = () => {

        if (items.length === limit) {

            setPage(page + 1);

        }

    };


    // ================= PREVIOUS PAGE =================

    const HandlePrevious = () => {

        if (page > 1) {

            setPage(page - 1);

        }

    };


    return (

        <div className="my-found-container">


            {/* ================= HEADER ================= */}

            <div className="page-header">

                <button
                    className="back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>


                <div>

                    <h1>
                        My Found Items
                    </h1>

                    <p>
                        Items that you have reported as found
                    </p>

                </div>

            </div>


            {/* ================= LOADING ================= */}

            {loading ? (

                <div className="loading-box">

                    <div className="loader"></div>

                    <p>
                        Loading your found items...
                    </p>

                </div>

            ) : items.length === 0 ? (

                /* ================= EMPTY ================= */

                <div className="empty-box">

                    <div className="empty-icon">
                        🔎
                    </div>

                    <h2>
                        No Found Items
                    </h2>

                    <p>
                        You haven't reported any found items yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/found-item")
                        }
                    >
                        Report Found Item
                    </button>

                </div>

            ) : (

                /* ================= ITEMS ================= */

                <>

                    <div className="items-grid">

                        {items.map((item) => (

                            <div
                                className="item-card"
                                key={item.id}
                            >

                                {/* IMAGE */}

                                <div className="item-image">

                                    {item.image ? (

                                        <img
                                            src={item.image}
                                            alt={item.title}
                                        />

                                    ) : (

                                        <span>
                                            🔎
                                        </span>

                                    )}

                                </div>


                                {/* CONTENT */}

                                <div className="item-content">

                                    <div className="item-title-row">

                                        <h3>
                                            {item.title}
                                        </h3>

                                        <span className="found-badge">
                                            FOUND
                                        </span>

                                    </div>


                                    <p className="description">

                                        {item.description}

                                    </p>


                                    <div className="item-info">

                                        <p>
                                            📍 {item.location}
                                        </p>

                                        <p>
                                            📅 {item.date}
                                        </p>

                                    </div>


                                    <button
                                        className="view-btn"
                                        onClick={() =>
                                            navigate(
                                                `/see-found-item/${item.id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* ================= PAGINATION ================= */}

                    <div className="pagination">

                        <button
                            onClick={HandlePrevious}
                            disabled={page === 1}
                        >
                            ← Previous
                        </button>


                        <span>
                            Page {page}
                        </span>


                        <button
                            onClick={HandleNext}
                            disabled={items.length < limit}
                        >
                            Next →
                        </button>

                    </div>

                </>

            )}

        </div>

    );

}

export default MyFoundItems;

