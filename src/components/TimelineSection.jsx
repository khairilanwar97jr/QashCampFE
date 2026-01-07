import React, { useState } from "react";

// Import your new local images
import exampleImage1 from "../assets/exampleimage1.jpg";
import exampleImage2 from "../assets/exampleimage2.jpg";
import exampleImage3 from "../assets/exampleimage3.jpg";

export default function TimelineSection() {
  const [modalImg, setModalImg] = useState(null);

  const moments = [
    {
      date: "2025-11-02",
      img: exampleImage1,
      caption:
        "Buat rasa rasa nak try manual tent. Sebelum ni pakai air tent kita kasi survey dulu. So far nice!",
      by: "Nazri",
    },
    {
      date: "2025-12-29",
      img: exampleImage2,
      caption:
        "Layan camping dekat Behrang malam new year. 4h3m puas hati satu fam hujan tak masuk air. Sambut new year dengan kawan2",
      by: "Rawandi",
    },
    {
      date: "2025-12-31",
      img: exampleImage3,
      caption:
        "Dapat guna Tarp dengan Meja. Cuak gak malam tu kena sekat dengan kepala air hahahax",
      by: "RARA",
    },
  ];

  return (
    <div
      id="timeline"
      className="max-w-8xl mx-auto h-[800px] overflow-y-scroll px-12 pt-8"
      style={{
        backgroundImage: `url(/src/assets/notebook.jpg), url(/src/assets/woodtree.jpg)`,
        backgroundSize: "680px auto, cover",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundPosition: "center top, center center",
      }}
    >
      {/* MAIN ROW */}
      <div className="flex gap-12">
        {/* LEFT PANE */}
        <div className="w-64 sticky top-20 self-start -translate-x-2 sm:-translate-x-0 hidden sm:flex flex-col">
          <h2
            className="text-4xl sm:text-8xl mb-6"
            style={{
              fontFamily: "'Fredoka One', cursive",
              color: "#597E52",
            }}
          >
            Share your
            <br />
            moments
          </h2>

          <p
            className="text-lg leading-relaxed"
            style={{
              fontFamily: "'Patrick Hand', cursive",
              color: "#444",
            }}
          >
            A place to pin memories, stories, photos and handwritten notes.
          </p>
        </div>

        {/* NOTEBOOK / TIMELINE */}
        <div className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-[680px] relative translate-x-4 sm:-translate-x-16 md:-translate-x-[150px]">
            <h2
              className="text-3xl text-center mb-6"
              style={{
                fontFamily: "'Patrick Hand', cursive",
                color: "#444",
                textShadow: "1px 1px 1px #bbb",
              }}
            >
              Moments Timeline
            </h2>

            <div className="flex flex-col space-y-8">
              {moments.map((m, idx) => (
                <div key={idx} className="flex justify-center">
                  {/* Date */}
<div
  className="text-xl sm:text-2xl md:text-xl text-center mb-6 mr-4 sm:mr-6 md:mr-10 pr-0 sm:pr-4 md:pr-0"
  style={{
    fontFamily: "'Shadows Into Light', cursive",
    color: "#4379ddff",
    textShadow: "1px 1px 1px #bbb",
  }}
>
  <p>{m.date}</p>
</div>

                  {/* Image + Caption */}
                  <div className="flex items-start space-x-4 mr-10">
                    <div
                      className="relative w-72 h-72 sm:w-96 sm:h-96 cursor-pointer"
                      onClick={() => setModalImg(m.img)}
                    >
                      <img
                        src={m.img}
                        alt={`moment-${idx}`}
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
                        <p className="text-xs text-right mt-2">— {m.by}</p>
                      </div>

                      <img
                        src="/src/assets/pollaroid.png"
                        alt="polaroid frame"
                        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                      />
                    </div>

                    {/* Right-side BY text */}
                    <div className="flex flex-col h-80 relative">
                      <span
                        className="text-2xl text-center mb-4"
                        style={{
                          fontFamily: "'Shadows Into Light', cursive",
                          color: "#4379ddff",
                          textShadow: "1px 1px 1px #bbb",
                        }}
                      >
                        By: {m.by}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
