import { IngestDocumentCommand, IngestDocumentResult } from "../../contract/ingest-document.contract";

export interface IngestDocumentPort {
  execute(
    command: IngestDocumentCommand,
  ): Promise<IngestDocumentResult>;
}