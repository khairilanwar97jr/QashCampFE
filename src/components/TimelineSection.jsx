import React, { useState } from "react";

export default function TimelineSection() {
  const [modalImg, setModalImg] = useState(null);

  const moments = [
    {
      date: "2025-01-15",
      img: "https://picsum.photos/id/1018/400/300",
      caption: "Had a great camping night with friends!",
      by: "Ali",
    },
    {
      date: "2025-02-10",
      img: "https://picsum.photos/id/1025/400/300",
      caption:
        "If you want, I can rewrite your polaroid + caption JSX to make it look like a real polaroid with handwritten text under the image, matching your notebook aesthetic.",
      by: "Sara",
    },
    {
      date: "2025-03-05",
      img: "https://picsum.photos/id/1035/400/300",
      caption: "Cooking by the campfire. Delicious meals!",
      by: "Mika",
    },
    {
      date: "2025-04-12",
      img: "https://picsum.photos/id/1043/400/300",
      caption: "Night under the stars, feeling peaceful.",
      by: "Kaiso",
    },
  ];

  return (
    <div
      id="timeline"
      className="max-w-8xl w-full mx-auto mt-16 p-6 rounded-xl shadow-lg h-[600px] overflow-y-scroll bg-repeat bg-center"
      style={{
        backgroundImage: `url(/src/assets/notebook.jpg)`,
        backgroundSize: "600px",
      }}
    >
      <h2
        className="text-3xl text-center mb-6"
        style={{
          fontFamily: "'Patrick Hand', cursive",
          color: "#444", // pencil gray
          textShadow: "1px 1px 1px #bbb", // subtle pencil shadow
        }}
      >
        Moments Timeline
      </h2>

      <div className="flex flex-col space-y-8">
        {moments.map((m, idx) => (
          <div key={idx} className="flex items-start space-x-6">
            {/* Date */}
            <div
              className="text-3xl text-center mb-6"
              style={{
                fontFamily: "'Shadows Into Light', cursive",
                color: "#373636ff", // pencil gray
                textShadow: "1px 1px 1px #bbb", // subtle pencil shadow
              }}
            >
              <p>{m.date}</p>
            </div>

            {/* Image + Caption */}
            <div className="flex items-start space-x-4">
              {/* Image */}
              <div
                className="relative w-96 h-96 cursor-pointer" // Bigger polaroid
                onClick={() => setModalImg(m.img)}
              >
                {/* Moment image smaller inside polaroid */}
                <img
                  src={m.img}
                  alt={`moment-${idx}`}
                  className="absolute top-[27px] left-[42px] w-[calc(86%-50px)] h-[calc(85%-50px)] object-cover z-10 rounded"
                />

                {/* Polaroid frame behind */}
                <img
                  src="/src/assets/pollaroid.png"
                  alt="polaroid frame"
                  className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                />
              </div>

              {/* Caption + By text, right of image */}
              <div className="flex flex-col h-80 relative">
                {/* BY text (Top, static) */}
                <span
                  className="text-2xl text-center mb-4"
                  style={{
                    fontFamily: "'Shadows Into Light', cursive",
                    color: "#373636ff",
                    textShadow: "1px 1px 1px #bbb",
                  }}
                >
                  By: {m.by}
                </span>

                {/* Sticky Note (independent, positioned inside relative parent) */}
                <div className="flex-grow relative">
                  <div
                    className="absolute bottom-16 left-1 bg-yellow-50 w-72 p-6 rounded shadow-md rotate-[-2deg] text-gray-700 font-handwriting text-base"
                  >
                    <p>{m.caption}</p>

                    {/* Tail */}
                    <div
                      className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[10px] border-t-transparent border-b-transparent border-r-yellow-50"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
