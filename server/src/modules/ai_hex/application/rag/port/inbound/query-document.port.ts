import { QueryDocumentCommand, QueryDocumentResult } from "../../contract/query-document.contract";

export interface QueryDocumentPort {
  execute(
    command: QueryDocumentCommand,
  ): Promise<QueryDocumentResult>;
}