import { useEffect, useState } from "react";
import api from "../api";
import "../ui/ReportLost.css"
import { useNavigate } from "react-router-dom";

function ReportLost() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState("");

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

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

    const HandleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryId) {
            alert("Please select a category");
            return;
        }

        try {
            setSubmitting(true);

            const token = localStorage.getItem("token");

            const payload = {
                title,
                description,
                category_id: Number(categoryId),
                location,
                date,
                image
            };

            const response = await api.post(
                "/lost-item",
                payload,
                {
                    headers: {
                        auth: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message);
            navigate("/dashboard")

            // Clear form
            setTitle("");
            setDescription("");
            setCategoryId("");
            setLocation("");
            setDate("");
            setImage("");

        } catch (error) {
            console.log(error);

            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Something went wrong");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="report-lost-page">

            <div className="report-lost-card">

                <div className="report-lost-header">
                    <h1>Report Lost Item</h1>
                    <p>
                        Help others find your lost item by providing the details below.
                    </p>
                </div>

                <form onSubmit={HandleSubmit}>

                    {/* Title */}
                    <div className="form-group">
                        <label>Item Title</label>

                        <input
                            type="text"
                            placeholder="e.g. Black Leather Wallet"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            placeholder="Describe the item..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label>Category</label>

                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            disabled={loadingCategories}
                        >
                            <option value="">
                                {loadingCategories
                                    ? "Loading categories..."
                                    : "Select a category"}
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <div className="form-group">
                        <label>Lost Location</label>

                        <input
                            type="text"
                            placeholder="e.g. College Canteen"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    {/* Date */}
                    <div className="form-group">
                        <label>Lost Date</label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Image */}
                    <div className="form-group">
                        <label>Image</label>

                        <input
                            type="text"
                            placeholder="Enter image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />

                        <small>
                            Add an image URL of the lost item.
                        </small>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="report-btn"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Reporting..."
                            : "Report Lost Item"}
                    </button>
                

                    

                </form>
                

            </div>

        </div>
    );
}
export default ReportLost;