import { v4 as uuidv4 } from 'uuid';

export default function generateConfirmationId() {
  const uuid = uuidv4();
  return `${uuid.substring(0, 3)}-${uuid.substring(3, 6)}-${uuid.substring(6)}`.toUpperCase();
}
