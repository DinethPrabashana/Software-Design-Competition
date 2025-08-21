import "./index.css";
import { useEffect, useState } from "react";

// Components
import TransformerList from "./components/TransformerList";
import TransformerForm from "./components/TransformerForm";
import ImageUploadForm from "./components/ImageUploadForm";
import InspectionForm from "./components/InspectionForm";
import InspectionList from "./components/InspectionList";
import InspectionDetail from "./components/InspectionDetail";
import MaintenanceRecordView from "./components/MaintenanceRecordView";

// Import your group logo
import core4Logo from "./assets/core4_logo.jpg"; // place your logo in src/assets/

function App() {
  const [activeTab, setActiveTab] = useState("transformers"); // tabs: transformers, inspections, images

  const [transformers, setTransformers] = useState([]);
  const [editing, setEditing] = useState(null);

  const [images, setImages] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [selectedInspectionId, setSelectedInspectionId] = useState(null);
  const [recordModeId, setRecordModeId] = useState(null);

  // Load data from localStorage
  useEffect(() => {
    setTransformers(JSON.parse(localStorage.getItem("transformers")) || []);
    setImages(JSON.parse(localStorage.getItem("images")) || []);
    setInspections(JSON.parse(localStorage.getItem("inspections")) || []);
  }, []);

  // Save data to localStorage
  useEffect(() => { localStorage.setItem("transformers", JSON.stringify(transformers)); }, [transformers]);
  useEffect(() => { localStorage.setItem("images", JSON.stringify(images)); }, [images]);
  useEffect(() => { localStorage.setItem("inspections", JSON.stringify(inspections)); }, [inspections]);

  // --- Transformer Handlers ---
  const handleAddTransformer = (t) => setTransformers([...transformers, t]);
  const handleDeleteTransformer = (id) => setTransformers(transformers.filter((t) => t.id !== id));
  const handleEditTransformer = (t) => setEditing(t);
  const handleUpdateTransformer = (updated) => {
    setTransformers(transformers.map((t) => (t.id === updated.id ? updated : t)));
    setEditing(null);
  };

  // --- Image Upload ---
  const handleUploadImage = async (imgMeta) => {
    if (imgMeta.file && !imgMeta.dataUrl) {
      const dataUrl = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(imgMeta.file);
      });
      setImages((prev) => [...prev, { ...imgMeta, dataUrl }]);
    } else {
      setImages((prev) => [...prev, imgMeta]);
    }
  };

  // --- Inspections ---
  const handleCreateInspection = (payload) => {
    const maintImage = {
      id: payload.maintenanceImage.id,
      transformerId: payload.transformerId,
      type: "Maintenance",
      uploader: payload.inspector,
      uploadDate: new Date().toLocaleString(),
      name: payload.maintenanceImage.name,
      dataUrl: payload.maintenanceImage.dataUrl,
    };

    const baselines = images.filter(
      (im) => im.transformerId === payload.transformerId && im.type === "Baseline"
    );
    const matched = baselines.find((b) => b.condition === payload.condition) || baselines[0];

    const newInspection = { ...payload, baselineImageId: matched ? matched.id : null };

    setImages((prev) => [...prev, maintImage]);
    setInspections((prev) => [...prev, newInspection]);
    setSelectedInspectionId(newInspection.id);
  };

  const handleSelectInspection = (id) => setSelectedInspectionId(id);
  const handleDeleteInspection = (id) => {
    setInspections(inspections.filter((i) => i.id !== id));
    if (selectedInspectionId === id) setSelectedInspectionId(null);
  };
  const handleStatusChange = (id, status) => {
    setInspections(inspections.map((i) => (i.id === id ? { ...i, status } : i)));
  };
  const handleUpdateAnnotations = (id, anns) => {
    setInspections(inspections.map((i) => (i.id === id ? { ...i, annotations: anns } : i)));
  };

  const selectedInspection = inspections.find((i) => i.id === selectedInspectionId) || null;
  const selectedTransformer = selectedInspection
    ? transformers.find((t) => t.id === selectedInspection.transformerId)
    : null;
  const baselineForSelected =
    selectedInspection && selectedInspection.baselineImageId
      ? images.find((im) => im.id === selectedInspection.baselineImageId) || null
      : null;

  const openRecord = (id) => setRecordModeId(id);
  const closeRecord = () => setRecordModeId(null);
  const recordInspection = recordModeId ? inspections.find((i) => i.id === recordModeId) : null;
  const recordTransformer = recordInspection
    ? transformers.find((t) => t.id === recordInspection.transformerId)
    : null;
  const recordBaseline =
    recordInspection && recordInspection.baselineImageId
      ? images.find((im) => im.id === recordInspection.baselineImageId) || null
      : null;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <img src={core4Logo} alt="CORE4 Logo" className="logo" />
        <h1>CORE4 Transformer Dashboard</h1>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "transformers" ? "active" : ""} onClick={() => setActiveTab("transformers")}>Transformers</button>
        <button className={activeTab === "inspections" ? "active" : ""} onClick={() => setActiveTab("inspections")}>Inspections</button>
        <button className={activeTab === "images" ? "active" : ""} onClick={() => setActiveTab("images")}>Thermal Images</button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "transformers" && (
          <>
            <TransformerForm onAdd={handleAddTransformer} editing={editing} onUpdate={handleUpdateTransformer} />
            <TransformerList transformers={transformers} onDelete={handleDeleteTransformer} onEdit={handleEditTransformer} />
          </>
        )}

        {activeTab === "inspections" && (
          <>
            <InspectionForm transformers={transformers} onCreate={handleCreateInspection} />
            <InspectionList
              inspections={inspections}
              transformers={transformers}
              onSelect={handleSelectInspection}
              onDelete={handleDeleteInspection}
              onStatus={handleStatusChange}
            />
            {selectedInspection && (
              <InspectionDetail
                inspection={selectedInspection}
                transformer={selectedTransformer}
                baselineImage={baselineForSelected}
                onUpdateAnnotations={handleUpdateAnnotations}
                onPrintRecord={openRecord}
              />
            )}
          </>
        )}

        {activeTab === "images" && (
          <ImageUploadForm transformers={transformers} onUpload={handleUploadImage} />
        )}
      </div>

      {/* Printable Record */}
      {recordInspection && (
        <div className="record-modal">
          <div className="record-modal-inner">
            <button className="close" onClick={closeRecord}>×</button>
            <MaintenanceRecordView
              inspection={recordInspection}
              transformer={recordTransformer}
              baselineImage={recordBaseline}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
