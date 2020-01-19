import TypeSendGridRecipient from './TypeSendGridRecipient';

interface TypeSendGridPersonalization {
  to: TypeSendGridRecipient[];
  cc?: TypeSendGridRecipient[];
  bcc?: TypeSendGridRecipient[];
}

export default TypeSendGridPersonalization;
