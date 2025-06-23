export const EnquiryEmail = ({ email }) => {
    return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Enquiry Received</h2>
      <p>We'll contact you shortly at <strong>${email}</strong>.</p>
      <p>Thanks for reaching out!</p>
    </div>
  `;
};
