export enum DocumentStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class Document {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly mimeType: string,
    public status: DocumentStatus = DocumentStatus.PROCESSING,
  ) {}

  markCompleted(): void {
    this.status = DocumentStatus.COMPLETED;
  }

  markFailed(): void {
    this.status = DocumentStatus.FAILED;
  }
}