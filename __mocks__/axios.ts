const mockAxiosCall = jest
  .fn()
  .mockImplementation(async function(): Promise<{ data: any }> {
    return { data: 'Successful mock response!!' };
  });

export default mockAxiosCall;
