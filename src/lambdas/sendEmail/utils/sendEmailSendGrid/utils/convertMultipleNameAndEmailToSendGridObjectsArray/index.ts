import TypeSendGridRecipient from 'src/types/TypeSendGridRecipient';

import convertSingleNameAndEmailToSendGridObject from '../convertSingleNameAndEmailToSendGridObject';

export function convertMultipleNameAndEmailToSendGridObjectsArray(
  nameAndEmailString: string,
): TypeSendGridRecipient[] {
  if (!nameAndEmailString) return [];

  return nameAndEmailString
    .split(',')
    .map(convertSingleNameAndEmailToSendGridObject);
}

export default convertMultipleNameAndEmailToSendGridObjectsArray;
