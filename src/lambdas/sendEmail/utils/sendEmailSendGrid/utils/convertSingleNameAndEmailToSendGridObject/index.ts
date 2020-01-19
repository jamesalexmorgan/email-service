import TypeSendGridRecipient from 'src/types/TypeSendGridRecipient';
import { onlyEmailRegex, onlyEmailWithNameRegex } from 'src/utils/regexes';

export function convertSingleNameAndEmailToSendGridObject(
  nameAndEmailString: string,
): TypeSendGridRecipient {
  // if it's just an email address, let's send that in the email att
  const matchEmail = nameAndEmailString.match(onlyEmailRegex);
  if (matchEmail) {
    return { email: nameAndEmailString };
  }

  // if it has name too, then populat both
  const matchEmailWithName = nameAndEmailString.match(onlyEmailWithNameRegex);
  if (matchEmailWithName) {
    const [all, name, email] = matchEmailWithName;
    return { name, email };
  }
}
export default convertSingleNameAndEmailToSendGridObject;
