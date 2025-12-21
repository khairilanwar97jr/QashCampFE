import Navbar from "../components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="mt-24 max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-4">Contact Us</h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border rounded-lg p-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-2"
          />
          <textarea
            placeholder="Message"
            className="w-full border rounded-lg p-2"
          ></textarea>

          <button className="bg-green-700 text-white px-4 py-2 rounded-lg w-full">
            Send
          </button>
        </form>
      </div>
    </>
  );
}
