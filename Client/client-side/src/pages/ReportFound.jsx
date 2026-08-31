
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../ui/ReportFound.css";

function ReportFound() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState("");

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);


    // ================= FETCH CATEGORIES =================

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");

                setCategories(response.data.categories);

            } catch (error) {
                console.log(error);
                alert("Unable to fetch categories");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);


    // ================= SUBMIT FOUND ITEM =================

    const HandleSubmit = async (e) => {

        e.preventDefault();

        if (!categoryId) {

            alert("Please select a category");

            return;

        }


        try {

            setLoading(true);

            const token = localStorage.getItem("token");


            if (!token) {

                alert("Please login first");

                navigate("/login");

                return;

            }


            const payload = {

                title: title,

                description: description,

                category_id: Number(categoryId),

                location: location,

                date: date,

                image: image

            };


            console.log(
                "FOUND ITEM PAYLOAD:",
                payload
            );


            const response = await api.post(
                "/found-item",
                payload,
                {
                    headers: {
                        auth: `Bearer ${token}`
                    }
                }
            );


            alert(response.data.message);


            // ================= CLEAR FORM =================

            setTitle("");
            setDescription("");
            setCategoryId("");
            setLocation("");
            setDate("");
            setImage("");


            // ================= GO DASHBOARD =================

            navigate("/dashboard");


        } catch (error) {

            console.log(error);

            if (error.response) {

                alert(
                    error.response.data.detail ||
                    "Something went wrong"
                );

            } else {

                alert("Something went wrong");

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="report-found-container">

            <div className="report-found-card">


                {/* ================= HEADER ================= */}

                <div className="form-header">

                    <div className="found-icon">
                        🔎
                    </div>

                    <h2>
                        Report Found Item
                    </h2>

                    <p>
                        Help someone find their lost item
                    </p>

                </div>


                {/* ================= FORM ================= */}

                <form onSubmit={HandleSubmit}>


                    {/* TITLE */}

                    <div className="form-group">

                        <label>
                            Item Title
                        </label>

                        <input
                            type="text"
                            placeholder="Example: Black Wallet"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            placeholder="Describe the item..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* CATEGORY */}

                    <div className="form-group">

                        <label>
                            Category
                        </label>

                        <select
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(e.target.value)
                            }
                            required
                        >

                            <option value="">
                                Select Category
                            </option>


                            {categories?.map((category) => (

                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* LOCATION */}

                    <div className="form-group">

                        <label>
                            Found Location
                        </label>

                        <input
                            type="text"
                            placeholder="Example: College Library"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* DATE */}

                    <div className="form-group">

                        <label>
                            Found Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* IMAGE */}

                    <div className="form-group">

                        <label>
                            Image URL
                        </label>

                        <input
                            type="text"
                            placeholder="Enter image URL"
                            value={image}
                            onChange={(e) =>
                                setImage(e.target.value)
                            }
                        />

                    </div>


                    {/* ================= BUTTONS ================= */}

                    <div className="form-buttons">


                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Reporting..."
                                : "Report Found Item"
                            }

                        </button>


                    </div>

                </form>

            </div>

        </div>

    );

}

export default ReportFound;

