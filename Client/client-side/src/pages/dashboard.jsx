import "../ui/Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        FetchProfile();
    }, []);

    const FetchProfile = async () => {
        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/me", {
                headers: {
                    auth: `Bearer ${token}`
                }
            });

            setUser(response.data.user);

        } catch (error) {

            console.log(error);

            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Something went wrong");
            }

            navigate("/login");
        }
    };

    const HandleLogout = () => {

        localStorage.removeItem("token");
        alert("Logout Successfully");
        navigate("/login");

    };

    if (!user) {
        return (
            <div className="loading-container">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard-container">

            {/* ================= NAVBAR ================= */}

            <nav className="dashboard-navbar">

                <div
                    className="logo"
                    onClick={() => navigate("/dashboard")}
                >
                    Lost & Found
                </div>

                <div className="nav-links">

                    <button onClick={() => navigate("/dashboard")}>
                        Home
                    </button>

                    <button onClick={() => navigate("/items")}>
                        Browse Items
                    </button>

                    <button onClick={() => navigate("/see-lost-item")}>
                        My Lost Items
                    </button>

                    <button onClick={() => navigate("/see-found-item")}>
                        My Found Items
                    </button>

                </div>

                <div className="nav-profile">
                    👤 {user.name}
                </div>

            </nav>


            {/* ================= WELCOME ================= */}

            <section className="welcome-section">

                <p className="welcome-small">
                    Welcome back 👋
                </p>

                <h1>
                    {user.name}
                </h1>

                <p className="welcome-text">
                    Find what you've lost or help someone
                    find what they've lost.
                </p>

            </section>


            {/* ================= QUICK ACTIONS ================= */}

            <section className="dashboard-section">

                <h2>Quick Actions</h2>

                <div className="quick-actions">

                    {/* REPORT LOST */}

                    <div
                        className="action-card"
                        onClick={() => navigate("/lost-item")}
                    >

                        <div className="action-icon">
                            📦
                        </div>

                        <div>
                            <h3>Report Lost Item</h3>

                            <p>
                                Report something you have lost.
                            </p>
                        </div>

                    </div>


                    {/* REPORT FOUND */}

                    <div
                        className="action-card"
                        onClick={() => navigate("/found-item")}
                    >

                        <div className="action-icon">
                            🔎
                        </div>

                        <div>
                            <h3>Report Found Item</h3>

                            <p>
                                Help someone find their item.
                            </p>
                        </div>

                    </div>


                    {/* BROWSE ITEMS */}

                    <div
                        className="action-card"
                        onClick={() => navigate("/items")}
                    >

                        <div className="action-icon">
                            🔍
                        </div>

                        <div>
                            <h3>Browse Items</h3>

                            <p>
                                Browse all lost and found items.
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* ================= OVERVIEW ================= */}

            <section className="dashboard-section">

                <h2>My Items</h2>

                <div className="stats-container">

                    <div
                        className="stat-card"
                        onClick={() => navigate("/see-lost-item")}
                    >

                        <div className="stat-icon">
                            📦
                        </div>

                        <div>
                            <h3>My Lost Items</h3>

                            <p>
                                View your lost item reports
                            </p>
                        </div>

                    </div>


                    <div
                        className="stat-card"
                        onClick={() => navigate("/see-found-item")}
                    >

                        <div className="stat-icon">
                            🔎
                        </div>

                        <div>
                            <h3>My Found Items</h3>

                            <p>
                                View items you have found
                            </p>
                        </div>

                    </div>


                    <div
                        className="stat-card"
                        onClick={() => navigate("/items")}
                    >

                        <div className="stat-icon">
                            🔍
                        </div>

                        <div>
                            <h3>Browse All</h3>

                            <p>
                                Explore all reported items
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* ================= BROWSE SECTION ================= */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>Lost & Found Items</h2>

                        <p>
                            Browse items reported by users.
                        </p>
                    </div>

                    <button
                        className="view-all-btn"
                        onClick={() => navigate("/items")}
                    >
                        Browse All
                    </button>

                </div>

            </section>


            {/* ================= PROFILE ================= */}

            <section className="dashboard-section">

                <h2>My Profile</h2>

                <div className="profile-card">

                    <div className="profile-header">

                        <div className="profile-image">
                            👤
                        </div>

                        <h2>{user.name}</h2>

                        <p>{user.role}</p>

                    </div>

                    <div className="profile-body">

                        <div className="info">
                            <span>Email</span>
                            <span>{user.email}</span>
                        </div>

                        <div className="info">
                            <span>ERP ID</span>
                            <span>{user.erp_id}</span>
                        </div>

                        <div className="info">
                            <span>Phone</span>
                            <span>{user.phone_number}</span>
                        </div>

                        <button
                            className="logout-btn"
                            onClick={HandleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Dashboard;