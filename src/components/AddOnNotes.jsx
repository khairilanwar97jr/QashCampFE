export default function AddOnNotes({ name = "" }) {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const notes = [];
  const isMattress = /mattress|matress|tilam|airbed/.test(normalizedName);

  if (isMattress) {
    notes.push("Not for Awan / Senja / Purnama");
  }
  if (/chair|kerusi/.test(normalizedName)) {
    notes.push("For users under 90 kg.");
  }
  if (/fan|kipas/.test(normalizedName) ||
      (/blackdog/.test(normalizedName) && /lamp|light|lantern/.test(normalizedName))) {
    notes.push("Rechargeable · ~4 hours");
  }

  if (!notes.length) return null;

  return (
    <ul className="mt-2 space-y-1 text-xs leading-relaxed text-stone-600">
      {notes.map((note) => <li key={note}>{note}</li>)}
    </ul>
  );
}
