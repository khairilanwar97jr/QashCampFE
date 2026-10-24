// Website wording based on the supplied rental policy. Business review required
// before publication; this is not a legal opinion or a complete privacy notice.
export const cancellationRules = [
  { category: "Booking payment only", condition: "Booked 48 hours or more before camping", policy: "Refund eligible when cancellation reaches QashCamp at least 48 hours before the confirmed camping start time." },
  { category: "Last-minute booking payment only", condition: "Booked less than 48 hours before camping", policy: "Refund eligible when cancellation reaches QashCamp at least 12 hours before the confirmed camping start time." },
  { category: "Fully paid / Walk-In", condition: "The full rental balance has been paid", policy: "Non-refundable for customer cancellations, including advance bookings later settled in full." },
];

export const rentalTerms = [
  {
    id: "equipment-responsibility", title: "Equipment responsibility",
    paragraphs: [
      "Please take reasonable care of all rented equipment from collection until it is returned to QashCamp. Use each item only for its intended camping purpose and follow the setup and care instructions provided.",
      "Check the equipment and accessories at collection. Let us know promptly if an item is missing, damaged or not working, and take photographs where possible. Reporting an issue later does not remove your rights relating to a fault that was already present. Do not attempt repairs or modifications without our agreement.",
    ],
  },
  {
    id: "loss-damage", title: "Loss, damage & missing items",
    paragraphs: [
      "You are responsible for loss, theft or damage arising from misuse, negligence or failure to take reasonable care during the rental period. Tell QashCamp promptly about any incident and stop using equipment that may be unsafe.",
      "Any charge must reflect a reasonable, evidenced repair cost or, if repair is not practical, the reasonable replacement value taking account of the item's age and condition. Normal wear, pre-existing damage and faults not caused by the renter are excluded. We will explain the assessment and provide supporting details before making a deduction or requesting payment. You may question an assessment through our contact page.",
    ],
  },
  {
    id: "security-deposit", title: "Security deposit",
    paragraphs: [
      "A refundable security deposit is required before the camping period begins. The amount and payment arrangements must be communicated before you confirm your rental. This deposit is separate from rental fees or any payment used to reserve a booking.",
      "Deductions may only cover justified amounts under the agreed rental terms, such as renter-caused damage, missing items or applicable late-return charges. A deposit is not automatically forfeited because an issue is reported. Any amount claimed beyond the deposit must also be explained and supported.",
    ],
  },
  {
    id: "equipment-return", title: "Return date & late returns",
    paragraphs: [
      "Return all equipment at the date, time and location agreed in your booking confirmation. Returns are normally arranged after the camping activity, preferably the following day; this does not extend the confirmed rental period automatically.",
      "Contact us as soon as possible if you expect a delay. An extension depends on availability and our agreement. Any late-return fee or additional rental charge must be disclosed in advance and be reasonable in relation to the delay. No fixed late fee is set by this page; check the arrangements in your booking confirmation.",
    ],
  },
  {
    id: "return-condition", title: "Condition on return",
    paragraphs: [
      "Return the equipment clean, dry where reasonably possible, and packed with all supplied poles, pegs, ropes, bags and accessories. Remove rubbish and loose dirt, and follow the supplied packing instructions. Do not use harsh chemicals or methods that could damage the fabric or protective coating.",
      "If rain prevents drying, tell us at return so we can arrange prompt airing. Do not leave wet equipment sealed in its bag. A full security-deposit refund is due when there are no justified deductions, allowing for normal wear from proper use.",
    ],
  },
  {
    id: "deposit-refund", title: "Deposit inspection & refund",
    paragraphs: [
      "The security deposit is refunded within 2–3 working days after the equipment has been returned following your trip, subject to inspection. Working days exclude weekends and public holidays in Selangor. Please provide accurate refund details.",
      "If inspection identifies an issue, we will explain it, provide an itemised assessment and update you on the refund. Any undisputed balance should be returned within the normal timeframe; an unresolved assessment should not justify holding the entire deposit without explanation. Bank or payment-provider processing may affect when funds appear in your account.",
    ],
  },
  {
    id: "fire-safety", title: "No smoking, flames or cooking inside tents",
    paragraphs: [
      "Smoking, vaping, candles, open flames, barbecues and fuel-burning appliances are prohibited inside or near tents and other flammable equipment. Never use a stove or fuel-burning heater inside an enclosed tent because of fire and carbon-monoxide risks.",
      "Use cooking equipment only in a suitable open area, following the manufacturer's clearance requirements and campsite rules. Keep heat sources away from tent fabric, groundsheets, awnings and stored fuel.",
    ],
  },
  {
    id: "tent-setup", title: "Tent setup & weather",
    paragraphs: [
      "Our general setup sequence is sunshade → groundsheet → tent. Follow the instructions for your particular model where they differ, and ask us before setup if anything is unclear.",
      "Choose a suitable, level location away from flood paths, unstable ground and overhead hazards. Secure poles, pegs and guy lines as instructed. Do not force fittings or continue using a damaged structure. A rental tent is not a permanent shelter for severe weather; follow campsite instructions and move to a safe place when conditions become unsafe.",
    ],
  },
  {
    id: "personal-safety", title: "Personal safety & responsibility",
    paragraphs: [
      "Camping involves outdoor risks, including weather, terrain and wildlife. You are responsible for choosing a suitable campsite, supervising children and other people in your care, and using the equipment safely.",
      "QashCamp is not responsible for incidents caused solely by a renter's misuse or circumstances outside our reasonable control. This does not exclude liability for our negligence, defective equipment, breach of legal obligations or any responsibility that cannot lawfully be excluded. Your statutory consumer rights remain unaffected.",
    ],
  },
  {
    id: "verification-privacy", title: "Renter verification & privacy",
    paragraphs: [
      "We may request information reasonably necessary to verify the renter, administer the booking, protect rental equipment, communicate about collection and returns, and process payments or refunds. We should explain which information is required, why it is needed and the effect of not supplying it before collecting it. Do not send unnecessary identity-document details through public channels.",
      "Personal information must be handled confidentially, with appropriate safeguards and access limited to authorised people who need it for those purposes. Any disclosure to service providers or authorities must have a lawful basis and be explained in the applicable privacy notice. Information should be retained only as long as necessary for the rental, legitimate record-keeping or legal requirements, then securely deleted or anonymised.",
      "Contact QashCamp to request access to or correction of your information, or to ask about consent and data handling. This rental summary does not replace the privacy notice provided when your data is collected.",
    ],
  },
  {
    id: "camp-rules", title: "Campsite rules & consideration for others",
    paragraphs: [
      "Follow the campsite operator's rules, safety instructions and applicable local requirements, including fire restrictions, quiet hours, waste disposal and permitted camping areas. Obtain any campsite booking or permission required for your trip.",
      "Keep the area clean, dispose of waste responsibly and avoid damaging vegetation or disturbing other campers. Equipment rental does not override the campsite operator's rules or include a campsite reservation unless your booking expressly says so.",
    ],
  },
  {
    id: "cancellation", title: "Cancellation & booking-payment refunds",
    paragraphs: [
      "The cancellation windows apply only while you have paid a booking payment and have not settled the full rental balance. For reservations made at least 48 hours before camping, you must cancel at least 48 hours before the confirmed camping start time. For last-minute reservations made less than 48 hours before camping, you must cancel at least 12 hours before that start time.",
      "If these conditions are met, the booking payment is refundable. Cancellations outside the applicable window do not qualify for a refund under this cancellation policy, subject to rights required by law. A reservation made less than 12 hours before camping cannot meet the 12-hour cancellation deadline.",
      "Send your cancellation through QashCamp's contact channel with your booking reference and rental dates, and retain a record of the message. The deadline is assessed using the time your request reaches us, not when we reply. All times are Malaysia time (UTC+8). Ask us to confirm the camping start time before paying if your confirmation does not specify it.",
    ],
  },
  {
    id: "full-payment", title: "Full payment & Walk-In reservations",
    paragraphs: [
      "Once the full rental balance is paid, the reservation is treated as Fully Paid / Walk-In for this cancellation policy and rental payments are non-refundable for customer cancellations. This applies even if you booked in advance, initially paid only a booking payment, or cancel before the 48-hour or 12-hour deadline.",
      "This restriction concerns rental payments, not the refundable security deposit. It does not remove remedies required by law, including where QashCamp cannot supply the agreed rental or equipment fails to meet applicable legal requirements. Please check your dates and understand this change in refund eligibility before settling the balance.",
    ],
  },
  {
    id: "questions-rights", title: "Questions, disputes & your rights",
    paragraphs: [
      "Contact QashCamp with your booking reference if you need clarification, wish to dispute a charge or have a concern about the equipment. We will review the relevant booking details and supporting information with you.",
      "These terms are subject to Malaysian law and do not limit consumer rights or access to any court, tribunal or authority available under that law. An unenforceable provision does not remove the remaining valid terms. Changes to this page do not retrospectively change an existing booking without a lawful basis or your agreement.",
    ],
  },
];
