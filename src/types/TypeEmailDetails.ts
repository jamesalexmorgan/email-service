interface TypeEmailDetails {
  to: string;
  cc?: string;
  bcc?: string;
  from: string;
  subject?: string;
  text: string;
}

export default TypeEmailDetails;
