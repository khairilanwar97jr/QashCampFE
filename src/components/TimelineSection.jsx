import React, { useState, useEffect } from "react";

export default function TimelineSection({ currentUser }) {
  const [modalImg, setModalImg] = useState(null);
  const [moments, setMoments] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const isAdmin = currentUser?.role === "ADMIN";

  // fetch moments
  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/moments`);
        const data = await res.json();
        setMoments(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMoments();
  }, []);

  // approve photo
  const handleApprove = async (pkid) => {
    try {
      const res = await fetch(`${API_URL}/api/moments/${pkid}/approve`, {
        method: "PATCH",
      });
      const updated = await res.json();
      setMoments(moments.map((m) => (m.pkid === updated.pkid ? updated : m)));
    } catch (err) {
      console.error(err);
    }
  };

  // handle file select
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  // upload photo
  const handleUpload = async () => {
    if (!currentUser) {
      setUploadOpen(false);
      setGuestModalOpen(true);
      return;
    }

    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    console.log("Uploading as user ID:", currentUser.id);
    formData.append("userId", currentUser.id); // ✅ FIXED

    try {
      setUploading(true);

      const res = await fetch(`${API_URL}/api/moments`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      // Admin can see immediately
      if (isAdmin) {
        setMoments((prev) => [data, ...prev]);
      }

      setUploadOpen(false);
      setFile(null);
      setCaption("");
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      id="timeline"
      className="max-w-8xl mx-auto h-[800px] overflow-y-scroll px-12 pt-8 relative"
      style={{
        backgroundImage: `url(/src/assets/notebook.jpg), url(/src/assets/woodtree.jpg)`,
        backgroundSize: "680px auto, cover",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundPosition: "center top, center center",
      }}
    >
      <div className="flex gap-12">
        <div className="w-64 sticky top-20 self-start hidden sm:flex flex-col">
          <h2
            className="text-8xl mb-6"
            style={{ fontFamily: "'Fredoka One', cursive", color: "#597E52" }}
          >
            Share your
            <br />
            moments
          </h2>
          <p
            className="text-lg"
            style={{ fontFamily: "'Patrick Hand', cursive", color: "#444" }}
          >
            A place to pin memories, stories, photos and handwritten notes.
          </p>
        </div>

        <div className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-[680px] relative">
            <div className="flex items-center mb-6">
              <h2
                className="text-3xl"
                style={{
                  fontFamily: "'Patrick Hand', cursive",
                  color: "#444",
                  textShadow: "1px 1px 1px #bbb",
                }}
              >
                Moments Timeline
              </h2>

              <button
                className="ml-auto bg-yellow-200 border-2 border-b-4 border-black px-4 py-2 rounded shadow-lg hover:bg-yellow-300 hover:border-b-2 transition-all duration-150"
                onClick={() =>
                  currentUser ? setUploadOpen(true) : setGuestModalOpen(true)
                }
              >
                Upload Photo
              </button>
            </div>

            <div className="flex flex-col space-y-8">
              {moments.map((m) => (
                <div key={m.pkid} className="flex justify-center">
                  <div
                    className="text-xl sm:text-2xl md:text-xl text-center mb-6 mr-4 sm:mr-6 md:mr-10 pr-0 sm:pr-4 md:pr-0"
                    style={{
                      fontFamily: "'Shadows Into Light', cursive",
                      color: "#4379ddff",
                      textShadow: "1px 1px 1px #bbb",
                    }}
                  >
                    <p>{new Date(m.submit_date).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-start space-x-4 mr-10">
                    <div
                      className="relative w-72 h-72 sm:w-96 sm:h-96 cursor-pointer"
                      onClick={() => setModalImg(m.image_url)}
                    >
                      <img
                        src={m.image_url} // already Cloudinary URL
                        alt={`moment-${m.pkid}`}
                        className="absolute top-[27px] left-[42px] w-[calc(86%-50px)] h-[calc(85%-50px)] object-cover z-10 rounded"
                      />
                      <div
                        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 
                        bg-yellow-50/90 w-72 p-4 rounded shadow-md rotate-[-2deg]"
                        style={{
                          fontFamily: "'Shadows Into Light', cursive",
                          color: "#4379ddff",
                        }}
                      >
                        <p className="text-sm text-center">{m.caption}</p>
                        <p className="text-xs text-right mt-2">
                          — {m.first_name} {m.last_name}
                        </p>
                        {isAdmin && !m.approved && (
                          <button
                            className="mt-2 bg-green-500 text-white px-2 py-1 rounded shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(m.pkid);
                            }}
                          >
                            Approve
                          </button>
                        )}
                      </div>
                      <img
                        src="/src/assets/pollaroid.png"
                        alt="polaroid frame"
                        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                      />
                    </div>

                    <div className="flex flex-col h-80 relative">
                      <span
                        className="text-2xl text-center mb-4"
                        style={{
                          fontFamily: "'Shadows Into Light', cursive",
                          color: "#4379ddff",
                          textShadow: "1px 1px 1px #bbb",
                        }}
                      >
                        By: {m.first_name} {m.last_name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setUploadOpen(false)}
        >
          <div
            className="bg-yellow-100 border-4 border-black rounded-lg p-6 w-96 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              Upload Your Moment
            </h2>

            {/* Preview polaroid box */}
            <div className="mb-4 w-full h-48 bg-white border-2 border-black rounded-lg flex justify-center items-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">Select an image</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2"
            />
            <input
              type="text"
              placeholder="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-4 py-2 rounded shadow text-white transition
                ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }
              `}
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Guest Modal */}
      {guestModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setGuestModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Join Our Community</h2>
            <p className="mb-4">
              Please join our community to upload your moments!
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              onClick={() => setGuestModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for enlarged image */}
      {modalImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setModalImg(null)}
        >
          <img
            src={modalImg}
            alt="Enlarged"
            className="max-h-[80vh] rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
