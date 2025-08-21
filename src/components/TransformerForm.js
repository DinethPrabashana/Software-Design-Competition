import { useState, useEffect } from "react";

function TransformerForm({ onAdd, editing, onUpdate }) {
  const [formData, setFormData] = useState({
    id: "", region: "", number: "", pole: "", type: "Distribution", location: ""
  });

  useEffect(() => {
    if (editing) setFormData(editing);
  }, [editing]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.region || !formData.number || !formData.location) {
      alert("Please fill all required fields!");
      return;
    }
    if (editing) onUpdate(formData);
    else onAdd({ ...formData, id: Date.now().toString() });
    setFormData({ id: "", region: "", number: "", pole: "", type: "Distribution", location: "" });
  };

  return (
    <div className="form">
      <h2>{editing ? "Edit Transformer" : "Add Transformer"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="region" placeholder="Region (e.g., Colombo)" value={formData.region} onChange={handleChange} required />
        <input type="text" name="number" placeholder="Transformer Number" value={formData.number} onChange={handleChange} required />
        <input type="text" name="pole" placeholder="Pole Number" value={formData.pole} onChange={handleChange} />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Distribution">Distribution</option>
          <option value="Bulk">Bulk</option>
        </select>
        <input type="text" name="location" placeholder="Location Details" value={formData.location} onChange={handleChange} required />
        <button type="submit">{editing ? "Update Transformer" : "Add Transformer"}</button>
      </form>
    </div>
  );
}

export default TransformerForm;
