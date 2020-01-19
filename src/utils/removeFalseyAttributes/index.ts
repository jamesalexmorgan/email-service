import TypeEmailDetails from 'src/types/TypeEmailDetails';

function removeFalseyAttributes(object: TypeEmailDetails): TypeEmailDetails {
  // @ts-ignore // ignoring overloading issue
  return Object.entries(object).reduce(
    (accumulator: TypeEmailDetails, pair: [string, any]): TypeEmailDetails => {
      const [key, value] = pair;
      if (!value) return accumulator;
      return { ...accumulator, [key]: value };
    },
    {},
  );
}

export default removeFalseyAttributes;
