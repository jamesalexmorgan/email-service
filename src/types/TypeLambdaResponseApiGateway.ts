import { EnumStatusCode, EnumContentType } from './Enums';

interface TypeCustomerResponse {
  statusCode: EnumStatusCode;
  body: string;
  headers: { 'Content-Type': EnumContentType };
}

export default TypeCustomerResponse;
